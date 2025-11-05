import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/users/auth.service';
import { Profile } from '../../../models/profileModel/profile';
import { ProfilesService } from '../../../core/services/profiles/profiles.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-profile-list',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './profile-list.component.html',
  styleUrl: './profile-list.component.css'
})
export class ProfileListComponent implements OnInit {

    profiles: Profile[] = [];
    username: string = '';
    successMessage: string | null = null;
    errorMessage: string | null = null;

    constructor(
        private router: Router,
        private authService: AuthService,
        private profileService: ProfilesService
    ) {}

    // Added Functions
    ngOnInit() {
        this.loadProfiles();
    }
    loadProfiles() {
        this.profileService.getAllProfiles().subscribe({
           next: (data) => {
               this.profiles = data
           },
           error: (err) =>  {
                this.setError(err.error?.message);
           },
        });
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
    goToSelectedProfile(id: string) {
        this.router.navigate(['/profile', id]);
    }
    
    // Set Visual Functions
    private setError(message: string) {
        this.errorMessage = message; 
    }

}
