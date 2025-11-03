import { Routes } from '@angular/router';
import { LoginComponent } from './features/authModule/login/login.component';
import { RegisterComponent } from './features/authModule/register/register.component';
import { HomeComponent } from './features/mainModule/home/home.component';
import { authGuard } from './core/guards/auth.guard';
import { PostCreateComponent } from './features/postModule/post-create/post-create.component';
import { PostUpdateComponent } from './features/postModule/post-update/post-update.component';
import { ProfileDetailComponent } from './features/profileModule/profile-detail/profile-detail.component';
import { ProfileEditComponent } from './features/profileModule/profile-edit/profile-edit.component';
import { ProfileListComponent } from './features/profileModule/profile-list/profile-list.component';

export const routes: Routes = [
    // User/Auth
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // Main
    { path: 'home', component: HomeComponent, canActivate: [authGuard] },

    // Profiles
    { path: 'profile', component: ProfileDetailComponent, canActivate: [authGuard] },
    { path: 'edit-profile', component: ProfileEditComponent, canActivate: [authGuard] },
    { path: 'list-profile', component: ProfileListComponent, canActivate: [authGuard] },
    // list-profile (Para Panel Administrador o Publico ['en revision'])

    // Posts
    { path: 'create-post', component: PostCreateComponent, canActivate: [authGuard] },
    { path: 'update-post', component: PostUpdateComponent, canActivate: [authGuard] },
    // delete falta
    // list falta (Para Panel Administrador)

    // Default redirects
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];
