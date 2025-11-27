import { Routes } from '@angular/router';
// Guards
import { authGuard } from './core/guards/auth.guard';
// Components
import { UserManagementComponent } from './features/admin/user-management/user-management.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { FeedComponent } from './features/post/feed/feed.component';
import { CommunityComponent } from './features/profile/community/community.component';
import { MyselfComponent } from './features/profile/myself/myself.component';
import { ProfileEditComponent } from './features/profile/profile-edit/profile-edit.component';
import { ConnectionsComponent } from './features/friendship/connections/connections.component';

export const routes: Routes = [
    // __________[ Auth ]__________
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    // __________[ Post ]__________
    { path: 'home', component: FeedComponent, canActivate: [authGuard] },
    // __________[ Profile ]__________
    { path: 'profile', component: MyselfComponent, canActivate: [authGuard] },
    { path: 'profile/:id', component: MyselfComponent, canActivate: [authGuard] },
    { path: 'edit-profile', component: ProfileEditComponent, canActivate: [authGuard] },
    { path: 'list-profile', component: CommunityComponent, canActivate: [authGuard] },
    // __________[ Friendship ]__________
    { path: 'connections', component: ConnectionsComponent, canActivate: [authGuard]},
    // __________[ Admin ]__________
    { path: 'admin', component: UserManagementComponent, canActivate: [authGuard]},
    // __________[ Default Routes ]__________
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];
