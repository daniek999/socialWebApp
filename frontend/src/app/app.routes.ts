import { Routes } from '@angular/router';
import { LoginComponent } from './features/authModule/login/login.component';
import { RegisterComponent } from './features/authModule/register/register.component';
import { HomeComponent } from './features/mainModule/home/home.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login'}
];
