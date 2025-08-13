import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthComponent } from './components/auth/auth.component';
import { QRGeneratorComponent } from './components/qr-generator/qr-generator.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { QRDetailComponent } from './components/qr-detail/qr-detail.component';
import { BatchUploadComponent } from './components/batch-upload/batch-upload.component';
import { FileRedirectComponent } from './components/file-redirect/file-redirect.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'QR Code Generator & Manager'
  },
  {
    path: 'auth',
    component: AuthComponent,
    title: 'Login | QR App'
  },
  {
    path: 'generate',
    component: QRGeneratorComponent,
    canActivate: [authGuard],
    title: 'Generate QR Code | QR App'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    title: 'Dashboard | QR App'
  },
  {
    path: 'qr/:id',
    component: QRDetailComponent,
    canActivate: [authGuard],
    title: 'Edit QR Code | QR App'
  },
  {
    path: 'batch',
    component: BatchUploadComponent,
    canActivate: [authGuard],
    title: 'Batch Upload | QR App'
  },
  {
    path: 'file-redirect',
    component: FileRedirectComponent,
    canActivate: [authGuard],
    title: 'File Redirect | QR App'
  },
  {
    path: '**',
    redirectTo: ''
  }
];