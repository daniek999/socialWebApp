import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Profile } from '../../../models/profileModel/profile';
import { ProfilesService } from '../../../core/services/profiles/profiles.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-profile-detail',
    standalone: true,
    imports: [FormsModule, HttpClientModule, NgIf],
    templateUrl: './profile-detail.component.html',
    styleUrl: './profile-detail.component.css'
})
export class ProfileDetailComponent implements OnInit {

    profile: Profile | null = null;
    username: string = '';
    errorMessage: string | null = null;

    constructor(
        private router: Router,
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


    // MARK: Extra Funs()
    private setProfile(profile: Profile) {
        this.profile = profile;
        this.username = profile.idUser.username;
    }
    private setError(message: string) {
        this.errorMessage = message;
    }
    
}
