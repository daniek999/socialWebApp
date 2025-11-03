import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { Profile } from '../../../models/profileModel/profile';
import { ProfilesService } from '../../../core/services/profiles/profiles.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/users/auth.service';

@Component({
    selector: 'app-profile-detail',
    standalone: true,
    imports: [FormsModule, HttpClientModule, NgIf, NgClass],
    templateUrl: './profile-detail.component.html',
    styleUrl: './profile-detail.component.css'
})
export class ProfileDetailComponent implements OnInit {

    profile: Profile | null = null;
    username: string = '';
    mail: string = ''; // Agregar dps desde el back
    errorMessage: string | null = null;

    constructor(
        private router: Router,
        private authService: AuthService,
        private profileService: ProfilesService
    ) {}

    // MARK: Main Funs()
    ngOnInit() {
        this.loadProfile();
    }
    loadProfile() {
        this.profileService.getUserProfile().subscribe({
            next: (data) => {
                this.setProfile(data);
            },
            error: (error) => {
                this.setError(error.error?.message);
            }
        });
    }
    goToHome() {
        this.router.navigate(['/home']);
    }
    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }


    // MARK: Extra Funs()
    private setProfile(profile: Profile) {
        this.profile = profile;
        this.username = profile.idUser.username;
    }
    private setError(message: string) {
        this.errorMessage = message;
    }
    
}
