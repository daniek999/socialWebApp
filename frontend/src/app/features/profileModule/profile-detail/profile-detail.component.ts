import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { Profile } from '../../../models/profileModel/profile';
import { ProfilesService } from '../../../core/services/profiles/profiles.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
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
    isOwnProfile: boolean = false;
    errorMessage: string | null = null;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService,
        private profileService: ProfilesService,
    ) {}

    // Added Functions
    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');

        if (id) {
            // Viendo otro perfil
            this.isOwnProfile = false;
            this.profileService.getOtherProfiles(id).subscribe({
                next: (data) => this.setProfile(data),
                error: (error) => this.setError(error.error?.message)
            });
        } else {
            // Viendo tu propio perfil
            this.isOwnProfile = true;
            this.profileService.getUserProfile().subscribe({
                next: (data) => this.setProfile(data),
                error: (error) => this.setError(error.error?.message)
            });
        }
    }
    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    // Navigation Functions
    goToHome() {
        this.router.navigate(['/home']);
    }
    goToProfile() {
        this.router.navigate(['/profile']);
    }
    goToCommunity() {
        this.router.navigate(['/list-profile'])
    }
    goToEditProfile() {
        this.router.navigate(['/edit-profile'])
    }


    // Set Visual Functions
    private setProfile(profile: Profile) {
        this.profile = profile;
        this.username = profile.idUser.username;
    }
    private setError(message: string) {
        this.errorMessage = message;
    }
    
}
