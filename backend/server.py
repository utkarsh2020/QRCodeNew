from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Literal, Any, Dict
import qrcode
from qrcode.constants import ERROR_CORRECT_L, ERROR_CORRECT_M, ERROR_CORRECT_Q, ERROR_CORRECT_H
from io import BytesIO
import base64
import re
import requests
from PIL import Image, ImageDraw

app = FastAPI(title="QR Code Backend", version="0.1.0")

# Allow Angular dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Dev: allow all origins (Angular can use random port)
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models reflecting the frontend contracts
class QROptions(BaseModel):
    color: Optional[str] = "#000000"
    bgColor: Optional[str] = "#ffffff"
    width: Optional[int] = 256
    errorCorrection: Optional[Literal['L', 'M', 'Q', 'H']] = 'M'
    quietZone: Optional[int] = 0
    logoUrl: Optional[str] = None

class GenerateRequest(BaseModel):
    type: str
    data: Any
    options: Optional[QROptions] = QROptions()

class GenerateResponse(BaseModel):
    image: Optional[str] = None
    imageUrl: Optional[str] = None

class DynamicRequest(BaseModel):
    type: str
    data: Any
    options: Optional[QROptions] = QROptions()
    title: Optional[str] = None

class DynamicResponse(BaseModel):
    id: str
    shortUrl: str
    imageUrl: Optional[str] = None


def map_ec_level(level: str):
    return {
        'L': ERROR_CORRECT_L,
        'M': ERROR_CORRECT_M,
        'Q': ERROR_CORRECT_Q,
        'H': ERROR_CORRECT_H,
    }.get((level or 'M').upper(), ERROR_CORRECT_M)


def data_to_payload(qr_type: str, data: Any) -> str:
    """Convert frontend data into a string payload for QR encoding.
    For simplicity, most complex types are JSON-stringified.
    """
    try:
        if qr_type == 'url' and isinstance(data, dict):
            return str(data.get('url', ''))
        if qr_type == 'text' and isinstance(data, dict):
            return str(data.get('text', ''))
        if qr_type == 'email' and isinstance(data, dict):
            to = data.get('to', '')
            subject = data.get('subject', '')
            body = data.get('body', '')
            return f"mailto:{to}?subject={subject}&body={body}"
        if qr_type == 'sms' and isinstance(data, dict):
            phone = data.get('phone', '')
            message = data.get('message', '')
            return f"SMSTO:{phone}:{message}"
        if qr_type == 'wifi' and isinstance(data, dict):
            ssid = data.get('ssid', '')
            password = data.get('password', '')
            enc = data.get('encryption', 'WPA')
            hidden = 'true' if data.get('hidden') else 'false'
            return f"WIFI:T:{enc};S:{ssid};P:{password};H:{hidden};;"
        if qr_type == 'file' and isinstance(data, dict):
            return str(data.get('fileUrl', ''))
        # Fallback: JSON string
        import json
        return json.dumps(data)
    except Exception:
        return str(data)


def _load_logo_image(logo_url: str) -> Optional[Image.Image]:
    """Load logo from http(s) URL or data URL into a PIL Image (RGBA)."""
    try:
        if logo_url.startswith('data:'):
            match = re.match(r'^data:image/(png|jpeg|jpg|webp);base64,(.+)$', logo_url, re.IGNORECASE)
            if not match:
                return None
            b64 = match.group(2)
            raw = base64.b64decode(b64)
            img = Image.open(BytesIO(raw)).convert('RGBA')
            return img
        # http(s)
        resp = requests.get(logo_url, timeout=10)
        resp.raise_for_status()
        img = Image.open(BytesIO(resp.content)).convert('RGBA')
        return img
    except Exception:
        return None


def _hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    """Convert hex color like '#fff' or '#ffffff' to an (r, g, b) tuple."""
    s = (hex_color or '#ffffff').lstrip('#')
    if len(s) == 3:
        s = ''.join([c * 2 for c in s])
    try:
        return tuple(int(s[i:i+2], 16) for i in range(0, 6, 2))  # type: ignore[return-value]
    except Exception:
        return (255, 255, 255)


def _paste_logo_center(
    qr_img: Image.Image,
    logo_img: Image.Image,
    ratio: float = 0.22,
    rounded: bool = True,
    bg_rgb: tuple[int, int, int] = (255, 255, 255),
    pad_alpha: int = 255,
) -> Image.Image:
    """Paste the logo at the center of qr_img.
    ratio is the logo width / qr width.

    bg_rgb is used for the padding background so transparent regions blend with the QR background color.
    """
    qr_w, qr_h = qr_img.size
    target_w = int(qr_w * max(0.05, min(0.35, ratio)))
    aspect = logo_img.width / max(1, logo_img.height)
    target_h = int(target_w / aspect)
    
    # Resize with high quality resampling
    logo_resized = logo_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    # Ensure logo has alpha channel for transparency
    if logo_resized.mode != 'RGBA':
        logo_resized = logo_resized.convert('RGBA')

    # Create rounded mask for better integration
    if rounded:
        mask = Image.new('L', (target_w, target_h), 0)
        draw = ImageDraw.Draw(mask)
        radius = min(target_w, target_h) // 8  # Smaller radius for better look
        draw.rounded_rectangle([0, 0, target_w, target_h], radius=radius, fill=255)
        
        # Apply mask to existing alpha channel
        alpha = logo_resized.split()[-1]  # Get existing alpha
        # Combine existing alpha with rounded mask
        combined_alpha = Image.new('L', (target_w, target_h), 0)
        for x in range(target_w):
            for y in range(target_h):
                mask_val = mask.getpixel((x, y))
                alpha_val = alpha.getpixel((x, y))
                # Use minimum of mask and existing alpha
                combined_alpha.putpixel((x, y), min(mask_val, alpha_val))
        
        logo_resized.putalpha(combined_alpha)

    # Create a subtle background pad with better blending
    pad = max(6, target_w // 10)  # Slightly larger padding
    bg_size = (target_w + pad * 2, target_h + pad * 2)
    
    # Create background with gradient for better integration
    bg = Image.new('RGBA', bg_size, (0, 0, 0, 0))  # Start transparent
    
    # Create a soft circular gradient background
    center_x, center_y = bg_size[0] // 2, bg_size[1] // 2
    max_radius = min(bg_size) // 2
    
    for x in range(bg_size[0]):
        for y in range(bg_size[1]):
            distance = ((x - center_x) ** 2 + (y - center_y) ** 2) ** 0.5
            if distance <= max_radius:
                # Create soft gradient from center
                alpha_val = int(255 * (1 - (distance / max_radius) ** 2))
                alpha_val = max(0, min(255, alpha_val))
                bg.putpixel((x, y), (bg_rgb[0], bg_rgb[1], bg_rgb[2], alpha_val))
    
    # Paste logo on the gradient background
    bg.paste(logo_resized, (pad, pad), logo_resized)

    # Paste centered
    x = (qr_w - bg.width) // 2
    y = (qr_h - bg.height) // 2
    out = qr_img.convert('RGBA')
    out.paste(bg, (x, y), bg)
    
    # Convert back to RGB if needed to avoid transparency issues
    if out.mode == 'RGBA':
        # Create white background and composite
        white_bg = Image.new('RGB', out.size, bg_rgb)
        white_bg.paste(out, mask=out.split()[-1])  # Use alpha as mask
        return white_bg
    
    return out


def generate_qr_png_data_url(payload: str, opts: QROptions) -> str:
    qr = qrcode.QRCode(
        version=None,
        error_correction=map_ec_level(opts.errorCorrection or 'M'),
        box_size=10,
        border=max(0, int(opts.quietZone or 0) // 4)  # approximate quiet zone mapping
    )
    qr.add_data(payload)
    qr.make(fit=True)

    img = qr.make_image(fill_color=opts.color or '#000000', back_color=opts.bgColor or '#ffffff').convert('RGBA')

    # Resize to requested width while keeping square aspect
    width = int(opts.width or 256)
    img = img.resize((width, width), Image.NEAREST)

    # Embed logo if provided
    if opts.logoUrl:
        logo_img = _load_logo_image(opts.logoUrl)
        if logo_img is not None:
            bg_rgb = _hex_to_rgb(opts.bgColor or '#ffffff')
            img = _paste_logo_center(img, logo_img, bg_rgb=bg_rgb)

    buffer = BytesIO()
    img.save(buffer, format='PNG')
    b64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    return f"data:image/png;base64,{b64}"


@app.post('/api/qr/generate', response_model=GenerateResponse)
async def generate(req: GenerateRequest):
    payload = data_to_payload(req.type, req.data)
    image_data_url = generate_qr_png_data_url(payload, req.options or QROptions())
    return GenerateResponse(image=image_data_url, imageUrl=image_data_url)


@app.post('/api/qr/dynamic', response_model=DynamicResponse)
async def create_dynamic(req: DynamicRequest):
    # No persistence; just echo a pseudo id/short url and include image preview
    payload = data_to_payload(req.type, req.data)
    image_data_url = generate_qr_png_data_url(payload, req.options or QROptions())
    import random, string
    rid = 'dyn-' + ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    short = 'https://short.local/' + ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
    return DynamicResponse(id=rid, shortUrl=short, imageUrl=image_data_url)


@app.get('/api/health')
async def health():
    return {"status": "ok"}


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
