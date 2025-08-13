# QR Code Generator & Manager

A comprehensive Angular 20 application for generating, customizing, and managing QR codes with advanced features.

## Features

- **QR Types**: URL, Text, Email, SMS, Wi-Fi, vCard, Social Media, Payment (UPI/PayPal), File Redirect
- **Advanced Customization**: Colors, gradients, eye shapes, dot styles, logos, frame text, quiet zones
- **Dynamic QR Codes**: Editable content with analytics tracking
- **Batch Processing**: CSV upload for bulk QR generation
- **Azure Blob Storage**: Integrated file uploads via backend-signed SAS URLs
- **Analytics Dashboard**: Scan tracking with charts and insights
- **Responsive Design**: Built with Tailwind CSS and Angular Material

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   - Update `src/environments/environment.ts` with your API base URL
   - Update `src/environments/environment.prod.ts` for production

3. **Install Tailwind**:
   ```bash
   npx tailwindcss init -p
   ```

4. **Run Development Server**:
   ```bash
   ng serve
   ```

5. **Run E2E Tests**:
   ```bash
   npx cypress open
   ```

## Backend API Endpoints

The app expects these endpoints to be available:

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

### QR Management
- `POST /qr/generate` - Generate static QR code
- `POST /qr/dynamic` - Create dynamic QR code
- `GET /user/qrcodes` - Get user's QR codes
- `GET /qr/:id` - Get specific QR code
- `PATCH /qr/:id` - Update QR code
- `DELETE /qr/:id` - Delete QR code
- `POST /qr/batch` - Batch QR generation

### Analytics
- `GET /qr/analytics/:id` - Get QR analytics

### File Upload
- `POST /upload/sign` - Get signed upload URL for Azure Blob

## Project Structure

```
src/
├── app/
│   ├── components/          # Feature components
│   ├── core/               # Core services, guards, interceptors
│   ├── shared/             # Shared components and utilities
│   └── environments/       # Environment configurations
├── cypress/                # E2E tests
└── styles/                # Global styles
```

## Technologies

- Angular 20 (Standalone Components)
- Angular Material
- Tailwind CSS
- Chart.js
- QRCode.js
- Cypress (E2E Testing)
- jsPDF (PDF generation)

## License

MIT
