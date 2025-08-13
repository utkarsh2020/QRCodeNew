# 1. Introduction

The goal of this project is to develop a web application, which allows users to generate, customize, and manage QR codes for various use cases (e.g., URLs, contact details, payments, text, etc.). The application will feature a modern, responsive frontend built with Angular, a robust backend powered by Node.js, and Python for advanced QR code generation or processing tasks. The system will support dynamic QR code generation, customization (e.g., colors, logos, styles), analytics tracking, and downloadable QR codes in multiple formats.
1.1 Objectives
Create a user-friendly interface for generating static and dynamic QR codes.
Support multiple QR code types (URL, vCard, text, email, SMS, Wi-Fi, etc.).
Allow customization of QR code appearance (colors, logos, shapes, etc.).
Provide options to download QR code in PNG, SVG, or PDF formats.
Implement user accounts for managing dynamic QR codes and tracking scan analytics.
Ensure scalability, performance, and security for both frontend and backend.
1.2 Scope
Frontend: A single-page application (SPA) built with Angular for generating and customizing QR codes.
Backend: A Node.js server with Express.js for handling API requests, user management, and analytics.
Python Integration: Python scripts for advanced QR code generation or processing, integrated via API endpoints or microservices.
Features: QR code generation, customization, dynamic QR code management, analytics, and user authentication.
Deployment: Scalable deployment using cloud services (Azure).
2. System Architecture
The application follows client-server architecture with a modular design, leveraging Angular for the frontend, Node.js for the backend, and Python for specific QR code processing tasks. The system is divided into three main layers:
Frontend (Angular):
A responsive SPA for user interaction, QR code generation, and customization.
Communicates with the backend via RESTful APIs.
Handles form inputs, real-time QR code previews, and download functionality.
Backend (Node.js with Express.js):
Manages API endpoints for QR code generation, user authentication, and analytics.
Interfaces with a database for user data and dynamic QR code metadata.
Integrates with Python scripts for advanced QR code processing.
Python Microservice:
Handles complex QR code generation tasks (e.g., styled QR codes with logos).
Provides APIs for the Node.js backend to generate or process QR codes.
Database:
Stores user accounts, dynamic QR code metadata, and scan analytics.
Options: MongoDB (NoSQL) for flexibility or MS SQL (SQL) for structured data.
External Services:
Cloud storage (e.g., Azure) for storing QR code images.
Authentication providers (e.g., Azure -based authentication).
Analytics tracking for dynamic QR codes.
2.1 High-Level Architecture Diagram
[User] <--> [Angular Frontend (SPA)]
                     |
                     | RESTful APIs (HTTP/JSON)
                     v
[Node.js Backend (Express.js)] <--> [Python Microservice (Flask/FastAPI)]
                     |                           |
                     v                           v
[Database (MongoDB/PostgreSQL)] <--> [Cloud Storage (Azure)]
3. Functional Requirements
3.1 QR Code Generation
Static QR Codes: Generate QR codes for fixed data (e.g., URLs, text, vCard, Wi-Fi credentials).
Dynamic QR Codes: Allow users to create QR codes with editable content (stored in the database) and track scan analytics.
Supported QR Code Types:
URL
vCard (contact details)
Text
Email
SMS
Wi-Fi
Social media links
Payment links (e.g., UPI, PayPal)
File uploads (PDF, images)
3.2 QR Code Customization
Customize QR code appearance:
Colors (foreground, background)
Dot styles (square, rounded, dots)
Logo/image embedding
Frame styles and text
Real-time preview of customized QR codes.
3.3 Download and Export
Download QR codes in PNG, SVG, or PDF formats.
Option to embed QR codes in printable designs (e.g., flyers, business cards).
3.4 User Accounts and Management
User registration and login (email/password, OAuth with Google/Facebook).
Dashboard to manage created QR codes (view, edit, delete).
Support for dynamic QR codes with editable content.
3.5 Analytics
Track scan counts, locations, and devices for dynamic QR codes.
Display analytics in the user dashboard with charts (e.g., scan trends).
3.6 Additional Features
Batch QR code generation for multiple inputs.
API for developers to integrate QR code generation into other applications.
Responsive design for mobile and desktop users.
4. Non-Functional Requirements
Performance: Generate QR codes in <1 second for typical inputs.
Scalability: Handle up to 10,000 concurrent users with cloud-based infrastructure.
Security:
Secure user authentication with JWT or OAuth.
HTTPS for all API communications.
Input validation to prevent injection attacks.
Usability: Intuitive UI with real-time feedback and responsive design.
Reliability: 99.9% uptime with robust error handling.
Maintainability: Modular codebase with clear documentation.
5. Technology Stack5.1 Frontend (Angular)
Framework: Angular 19+ (standalone components for modularity).
Libraries:
angularx-qrcode or ng-qrcode for client-side QR code generation.

Angular Material for UI components (forms, buttons, dialogs).
Chart.js or NGX-Charts for analytics visualization.
Styling: CSS/SCSS with responsive design (Bootstrap or Tailwind CSS).
Tools: Angular CLI for project setup and development.
5.2 Backend (Node.js)
Framework: Express.js for RESTful API development.
Libraries:
qrcode (npm package) for server-side QR code generation.

jsonwebtoken for authentication.
mongoose (for MongoDB) or sequelize (for PostgreSQL) for database ORM.
Database: MongoDB for flexibility or PostgreSQL for structured data.
Storage: Azure Blob for storing QR code images and user-uploaded logos.
5.3 Python Microservice
Framework: Flask or FastAPI for lightweight API development.
Libraries:
qrcode (Python package) for generating QR codes.
Pillow for image manipulation (e.g., adding logos or styling QR codes).
Purpose: Handle advanced QR code generation tasks (e.g., embedding logos, custom styles).
5.4 Infrastructure
Cloud Platform: Azure for deployment.
Authentication: Firebase Auth or custom JWT implementation.
CI/CD: GitHub Actions for automated testing and deployment.
Monitoring: New Relic or Prometheus for performance monitoring.
6. System Design
6.1 Frontend Design (Angular)
The Angular application will be structured as a single-page application with the following components:
6.1.1 Components
Home Component: Landing page with an introduction and call-to-action to generate QR codes.
QRGeneratorComponent:
Form for inputting QR code data (e.g., URL, text, vCard fields).
Customization options (colors, dot styles, logo upload).
Real-time preview using angularx-qrcode.

DashboardComponent:
Displays user-created QR codes (static and dynamic).
Analytics charts for dynamic QR codes.
AuthComponent: Handles user registration, login, and OAuth flows.
DownloadComponent: Manages QR code downloads in various formats.
6.1.2 Services
QRService: Communicates with the backend to generate QR codes and save dynamic QR code metadata.
AuthService: Manages user authentication (login, logout, token management).
AnalyticsService: Fetches and processes scan analytics data for display.
6.1.3 Example Template (app.component.html)
html
<qrcode [qrdata]="qrData" [width]="256" [errorCorrectionLevel]="'M'" [elementType]="'canvas'"></qrcode>

<form (ngSubmit)="generateQR()">
  <input [(ngModel)]="qrData" placeholder="Enter URL or text" />
  <mat-select [(ngModel)]="dotStyle" name="dotStyle">
    <mat-option value="square">Square</mat-option>
    <mat-option value="rounded">Rounded</mat-option>
  </mat-select>
  <input type="color" [(ngModel)]="color" />
  <button type="submit">Generate QR Code</button>
</form>
<button (click)="downloadQR()">Download QR Code</button>
Ref:

6.1.4 Styling
Use SCSS for modular styling.
Apply responsive design principles with media queries or a framework like Tailwind CSS.
Example CSS for QR code shadow (from GeeksforGeeks):
css
.qrcodeshadow {
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(15px 15px 15px \#e42424);
  opacity: 0.5;
}
6.2 Backend Design (Node.js with Express.js)
The Node.js backend will expose RESTful APIs to handle QR code generation, user management, and analytics.6.2.1 API Endpoints
POST /api/qr/generate:
Input: JSON payload with QR code data (e.g., { "data": "https://example.com", "type": "url", "options": { "color": "\#000000", "width": 256 } }).
Output: Base64-encoded QR code image or URL to stored image.
Calls Python microservice for advanced generation if needed.
POST /api/qr/dynamic:
Input: QR code data, user ID, and metadata for dynamic QR codes.
Output: Dynamic QR code ID and image URL.
GET /api/qr/analytics/:id:
Input: Dynamic QR code ID.
Output: Scan analytics (count, locations, devices).
POST /api/auth/register:
Input: User credentials (email, password).
Output: JWT token.
POST /api/auth/login:
Input: User credentials.
Output: JWT token.
GET /api/user/qrcodes:
Input: User ID (from JWT).
Output: List of user-created QR codes.
6.2.2 Example Node.js Code (index.js)
javascript
const express = require('express');
const QRCode = require('qrcode');
const app = express();
app.use(express.json());
 
app.post('/api/qr/generate', async (req, res) => {
  try {
    const { data, options } = req.body;
    const qrCodeImage = await QRCode.toDataURL(data, options);
    res.json({ image: qrCodeImage });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});
 
app.listen(3000, () => console.log('Server running on port 3000'));
Ref:

6.3 Python Microservice Design
The Python microservice will handle advanced QR code generation tasks, such as embedding logos or applying custom styles.
6.3.1 API Endpoints
POST /generate-qr:
Input: JSON payload with data and styling options (e.g., { "data": "https://example.com", "logo": "logo.png", "color": "\#000000" }).
Output: Base64-encoded QR code image or file URL.
6.3.2 Example Python Code (app.py with Flask)
python
from flask import Flask, request, jsonify
import qrcode
from PIL import Image
import io
import base64
 
app = Flask(__name__)
 
@app.route('/generate-qr', methods=['POST'])
def generate_qr():
    data = request.json['data']
    options = request.json.get('options', {})
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M)
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color=options.get('color', 'black'), back_color='white')
   
    \# Optional: Embed logo
    if 'logo' in options:
        logo = Image.open(options['logo']).resize((50, 50))
        img.paste(logo, (img.size[0]//2-25, img.size[1]//2-25))
   
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    return jsonify({'image': f'data:image/png;base64,{img_str}'})
 
if __name__ == '__main__':
    app.run(port=5000)
6.4 Database Schema
MongoDB (NoSQL)
Users Collection:
_id: ObjectId
email: String
password: String (hashed)
createdAt: Date
QRCodes Collection:
_id: ObjectId
userId: ObjectId (references Users)
type: String (e.g., "url", "vcard")
data: String or Object
isDynamic: Boolean
imageUrl: String (S3 URL)
createdAt: Date
Analytics Collection:
_id: ObjectId
qrCodeId: ObjectId (references QRCodes)
scanTime: Date
location: String
device: String
PostgreSQL (SQL)
Users Table:
id: Primary Key
email: VARCHAR
password: VARCHAR (hashed)
created_at: TIMESTAMP
QR Codes Table:
id: Primary Key
user_id: Foreign Key (Users)
type: VARCHAR
data: JSONB
is_dynamic: BOOLEAN
image_url: VARCHAR
created_at: TIMESTAMP
Analytics Table:
id: Primary Key
qr_code_id: Foreign Key (QRCodes)
scan_time: TIMESTAMP
location: VARCHAR
device: VARCHAR
7. Implementation Plan
7.1 Phase 1: Project Setup
Set up Angular project with ng new qr-code-generator.
Initialize Node.js project with npm init and install Express.js, qrcode, and other dependencies.
Create Python microservice with Flask or FastAPI and qrcode library.
Configure database (MongoDB or MS SQL) and cloud storage (Azure).
7.2 Phase 2: Core QR Code Generation
Implement QR Generator Component in Angular with angularx-qrcode for client-side generation.
Develop /api/qr/generate endpoint in Node.js using qrcode package.
Create Python /generate-qr endpoint for advanced QR code generation.
Test QR code generation for basic types (URL, text).
7.3 Phase 3: Customization and Download
Add customization options (colors, dot styles, logo upload) in QR Generator Component.
Implement download functionality for PNG, SVG, and PDF formats.
Integrate Python microservice for logo embedding and styling.
7.4 Phase 4: User Management and Dynamic QR Codes
Implement user authentication with JWT or Firebase Auth.
Develop Dashboard Component for managing QR codes.
Create /api/qr/dynamic endpoint for dynamic QR codes.
Store dynamic QR code metadata in the database.
7.5 Phase 5: Analytics
Implement scan tracking for dynamic QR codes using a redirect URL (e.g., /qr/:id).
Store analytics data in the database.
Display analytics in Dashboard Component with charts.
7.6 Phase 6: Testing and Deployment
Write unit tests for Angular components and Node.js APIs using Jasmine/Karma and Mocha/Chai.
Perform end-to-end testing with Cypress or Selenium.
Deploy frontend and backend to Azure.
Set up CI/CD pipeline with GitHub Actions.
8. Security Considerations
Input Validation: Sanitize all user inputs to prevent XSS and injection attacks.
Authentication: Use JWT or OAuth for secure user authentication.
HTTPS: Enforce HTTPS for all API communications.
Rate Limiting: Implement rate limiting on API endpoints to prevent abuse.
Data Privacy: Encrypt sensitive user data (e.g., passwords) and comply with GDPR/CCPA.
9. Scalability Considerations
Horizontal Scaling: Use load balancers (e.g., Azure) to distribute traffic across multiple Node.js instances.
Caching: Implement Redis for coaching frequently accessed QR code images.
Database Sharding: Shard MongoDB or use read replicas in PostgreSQL for high read/write loads.
Microservices: Decouple Python QR code generation as a separate service for independent scaling.
10. Future Enhancements
Add support for batch QR code generation via CSV upload.
Implement a developer API for third-party integrations.
Support QR code scanning functionality within the app.
Integrate AI-based suggestions for QR code design (e.g., color schemes).
11. References
Angular QR code generation:
Node.js QR code generation:
Python QR code libraries: Python qrcode documentation
QRCode-Tiger.com for feature inspiration

Here’s a ready-to-use bolt.new prompt that turns your requirements into an implementable spec. You can paste this entire prompt into bolt.new to scaffold the project and generate code.

Project: QR Code Generator and Manager (Angular + Node.js + Python)

Goal
Build a web app to generate, customize, and manage static and dynamic QR codes for multiple data types, with analytics, user accounts, downloads (PNG/SVG/PDF), and a Python microservice for advanced QR styling (logos, shapes). Deploy on Azure.

Tech Stack and Constraints

- Frontend: Angular 19+ (standalone components), Angular Material, angularx-qrcode or ng-qrcode, Chart.js or NGX-Charts, Tailwind or Bootstrap, SCSS.
- Backend: Node.js 20+ with Express.js, qrcode npm package, JWT authentication, Mongoose (MongoDB) or Sequelize (PostgreSQL).
- Python microservice: FastAPI or Flask, qrcode, Pillow.
- Database: Prefer MongoDB; allow swapping to PostgreSQL with Sequelize.
- Storage: Azure Blob Storage for QR images and uploaded logos.
- Auth: JWT (email/password) initially, pluggable OAuth (Google) later.
- CI/CD: GitHub Actions. Monitoring hooks in place (New Relic/Prometheus ready).
- Performance: Generate QR < 1s for typical inputs. Target 10k concurrent users.
- Security: HTTPS everywhere, input validation/sanitization, rate limiting, hashed passwords, JWT, CORS, helmet, GDPR-ready.
- Deployment: Azure App Service / Container Apps; environment via .env.

Core Features

- QR Types: URL, Text, Email, SMS, Wi-Fi, vCard, Social links, Payment (UPI/PayPal), File redirect.
- Static QR: Directly encodes final data.
- Dynamic QR: Encodes an internal redirect URL (/qr/:id) that resolves to current target; track scans (count, device, location).
- Customization: Foreground/background colors, dot styles (square, rounded, dots), frame text, logo embedding, size, error correction.
- Preview: Real-time preview in the UI.
- Downloads: PNG, SVG, PDF.
- User Accounts: Register/login, dashboard to view/edit/delete QR codes; manage dynamic targets and settings.
- Analytics: Scan counts over time, by location/device; charts in dashboard.
- Batch: Batch generation for multiple inputs (CSV later as enhancement).
- API: Public developer API key for server-side QR generation.

High-Level Architecture

- Angular SPA → REST (JSON) → Node.js/Express API
- Node.js ↔ Python microservice (advanced styling)
- Node.js ↔ MongoDB (or PostgreSQL)
- Node.js ↔ Azure Blob Storage (image/logo)
- Dynamic scans via /qr/:id endpoint with analytics logging

Routes and Endpoints
Auth

- POST /api/auth/register
    - body: { email, password }
    - returns: { token, user }
- POST /api/auth/login
    - body: { email, password }
    - returns: { token, user }
- GET /api/auth/me
    - auth: Bearer
    - returns: { user }

QR Generation

- POST /api/qr/generate (static)
    - body: { type, data, options }
    - options: { color, bgColor, width, errorCorrection, dotStyle, frameText, logoUrl }
    - returns: { imageDataUrl | imageUrl }
- POST /api/qr/dynamic
    - auth: Bearer
    - body: { type, data, options, title? }
    - returns: { id, shortUrl, imageUrl }
- GET /api/qr/:id/resolve
    - resolves dynamic target (internal)
- GET /qr/:id
    - public redirect for scanners; logs scan analytics; 302 to current target

QR Management

- GET /api/user/qrcodes
    - auth: Bearer
    - returns: [{ id, type, isDynamic, imageUrl, createdAt, title }]
- GET /api/qr/:id
    - auth: Bearer (owner)
    - returns: details
- PATCH /api/qr/:id
    - auth: Bearer (owner)
    - body: { data?, options?, title? }
- DELETE /api/qr/:id
    - auth: Bearer (owner)

Analytics

- GET /api/qr/analytics/:id
    - auth: Bearer (owner)
    - returns: { totalScans, timeseries: [{date, count}], byDevice: {...}, byGeo: {...} }

Batch (MVP)

- POST /api/qr/batch
    - auth: Bearer
    - body: { items: [{ type, data, options }], dynamic: boolean }
    - returns: [{ id?, imageUrl, errors? }]

Python Microservice

- POST /generate-qr
    - body: { data, options: { color, bgColor, width, errorCorrection, dotStyle, frameText, logoUrl } }
    - returns: { image: data:image/png;base64,... } or { imageUrl }

Data Models
MongoDB (default)

- users
    - _id, email (unique), passwordHash, createdAt
- qrcodes
    - _id, userId, type, data (object/string), isDynamic (bool), options (object), imageUrl, shortCode, createdAt, title
- analytics
    - _id, qrCodeId, scanTime, ip, userAgent, device, location { country, city, lat, lon }

PostgreSQL (alternative) via Sequelize

- Users(id, email, password_hash, created_at)
- QRCodes(id, user_id, type, data JSONB, is_dynamic, options JSONB, image_url, short_code, title, created_at)
- Analytics(id, qr_code_id, scan_time, ip, user_agent, device, country, city, lat, lon)

Frontend (Angular) Structure

- Standalone components:
    - HomeComponent (landing CTA)
    - QRGeneratorComponent
        - form: type, data fields by type (URL/text/vCard/etc.)
        - customization: color, bgColor, dotStyle, frameText, logo upload
        - live preview with angularx-qrcode
        - buttons: Generate, Download (PNG/SVG/PDF), Save as Dynamic
    - DashboardComponent
        - list of user QR codes (cards, filter by static/dynamic)
        - actions: edit, delete, view analytics, download
        - charts: timeseries scans, device, geo
    - AuthComponent (register/login)
    - DownloadComponent (format picker, resolution)
- Services (injectable):
    - AuthService (JWT, interceptors)
    - QRService (CRUD, generate)
    - AnalyticsService
    - StorageService (logo upload to Azure Blob, get SAS URL)
- Routing:
    - /, /auth, /generate, /dashboard, /qr/:id (view/edit)
- UI/UX:
    - Angular Material; Tailwind/SCSS; responsive layout
    - Accessibility basics, form validation, loading states

Sample Angular Template Snippet

- Use angularx-qrcode for preview and form controls for customization
- Provide code-generation for a working QRGeneratorComponent with:
    - [(ngModel)] bindings for qrData, dotStyle, color, bgColor
    - mat-select for dotStyle with options: square, rounded, dots
    - <qrcode [qrdata]="qrData" [width]="size" [colorDark]="color" [colorLight]="bgColor"></qrcode>
    - Download button that renders canvas/svg to file
- Use Angular Material form field wrappers and validators

Backend Implementation Details

- Express app with routers: /auth, /qr, /user, /qr/analytics
- Middleware: helmet, cors, morgan, rate-limit, express.json
- Auth: bcrypt hashing, JWT issue/verify; authGuard middleware
- QR generation:
    - Default server-side via qrcode npm for simple styles and SVG/PNG
    - Route to Python microservice when options.logoUrl or advanced dotStyle present
- Azure Blob:
    - Upload final images and return public URL or SAS-based time-limited URL
- Dynamic scans:
    - GET /qr/:id: look up by shortCode, log analytics (ip, ua -> device via ua-parser-js), geo via free GeoIP API, increment counters, redirect to target
- PDF export:
    - Use pdfkit or pdf-lib to place QR on a simple A4 with optional frameText

Python Microservice Details

- FastAPI (preferred) with Pydantic models
- Generate QR with qrcode and Pillow; composite logo centered; apply dot style approximation (or use segno if needed)
- Return base64 PNG; optionally store to Azure Blob via shared SAS if provided

Acceptance Criteria

- Users can:
    - Register/login; see dashboard
    - Create static and dynamic QR codes for URL/Text at minimum
    - Customize color, bgColor, dotStyle, optional frame text, logo
    - Preview in real-time
    - Download PNG and SVG; PDF basic export
    - For dynamic QR: edit target; scan redirects update analytics
    - View analytics charts: total scans, daily timeseries, basic device/geo breakdown
- Performance: Typical QR generated within 1s
- Security: Passwords hashed, JWT protected routes, input sanitized, rate limited
- Reliability: Graceful error handling; 429 on abuse; 5xx logs
- Code quality: Modular, typed, linted, basic unit tests for services/controllers

Scaffolding and File Structure

- frontend/
    - src/app/
        - components/{home,auth,qr-generator,dashboard,download}/
        - services/{auth.service.ts,qr.service.ts,analytics.service.ts,storage.service.ts}
        - interceptors/auth.interceptor.ts
        - models/{qr.ts,user.ts,analytics.ts}
        - app.routes.ts
- backend/
    - src/
        - index.ts
        - routes/{auth.ts,qr.ts,user.ts,analytics.ts}
        - controllers/{auth.controller.ts,qr.controller.ts,analytics.controller.ts}
        - middleware/{auth.ts,error.ts,rateLimit.ts}
        - services/{qr.service.ts,storage.service.ts,analytics.service.ts}
        - db/{mongoose.ts|sequelize.ts, models/...}
        - utils/{jwt.ts,validators.ts,ua.ts,geo.ts}
- python-service/
    - app.py (FastAPI) or main.py
    - requirements.txt
- infra/
    - dockerfiles/{frontend.Dockerfile,backend.Dockerfile,python.Dockerfile}
    - github-actions/{frontend.yml,backend.yml}
    - azure/ (bicep/arm or instructions)
- .env.example for backend and python-service

Environment Variables

- Backend:
    - PORT, NODE_ENV
    - JWT_SECRET
    - DB_URI (Mongo) or PG_URI (Postgres)
    - AZURE_BLOB_CONNECTION_STRING or SAS credentials
    - PY_SERVICE_URL
- Python:
    - PORT
    - AZURE_BLOB_SAS (optional for direct upload)
- Frontend:
    - API_BASE_URL

Example Requests

- POST /api/qr/generate
{
"type": "url",
"data": "https://example.com",
"options": {
"color": "\#000000",
"bgColor": "\#ffffff",
"width": 256,
"errorCorrection": "M",
"dotStyle": "rounded",
"frameText": "Scan Me",
"logoUrl": "https://.../logo.png"
}
}
- POST /api/qr/dynamic
{
"type": "url",
"data": "https://example.com/landing",
"options": { "color": "\#0f172a", "width": 512 },
"title": "Campaign Summer"
}

Testing

- Frontend: Jasmine/Karma unit tests; Cypress e2e for generate/preview/download/auth flows
- Backend: Jest or Mocha/Chai for controllers/services; supertest for endpoints
- Python: pytest for function tests
- CI: GitHub Actions runs lint/test/build on PR; deploy on main

Future Enhancements (non-blocking)

- CSV upload for batch input
- Developer API keys and usage quotas
- Built-in QR scanner in SPA
- AI-assisted color and style suggestions

Instructions to bolt.new

- Generate a monorepo with frontend (Angular), backend (Node/Express TypeScript), and python-service (FastAPI).
- Implement the routes, services, and components listed above with minimal viable functionality and clean architecture.
- Add environment configs and example .env files.
- Provide Dockerfiles and npm/yarn/pnpm scripts to run all services locally:
    - frontend: 4200
    - backend: 3000
    - python-service: 5000
- Seed scripts:
    - Create admin test user
    - Sample QR codes (static and dynamic)
- Include README with setup steps, environment variables, and Azure deployment notes.

Deliverables

- Running SPA with auth, generator, preview, downloads
- Working backend with static/dynamic QR creation, redirect, analytics logging
- Python service for logo-embedded, styled QR generation
- Azure-ready configuration and CI pipeline templates
