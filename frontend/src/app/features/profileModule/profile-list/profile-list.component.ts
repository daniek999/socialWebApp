import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Profile } from '../../../models/profileModel/profile';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ProfileService } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { TopWebBarComponent } from "../../../shared/top-web-bar/top-web-bar.component";

@Component({
    selector: 'app-profile-list',
    standalone: true,
    imports: [NgIf, NgFor, TopWebBarComponent, NgClass],
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
        private profileService: ProfileService
    ) { }

    /* ============================
    // MARK: [Component Functions]
    ============================ */
    ngOnInit() {
        this.loadProfiles();
    }
    loadProfiles() {
        this.profileService.getAllProfiles().subscribe({
            next: (data) => this.setProfiles(data),
            error: (error) => this.setError(error.error?.message ?? 'Error al cargar perfiles'),
        });
    }

    // [Navigation]
    goToSelectedProfile(id: string) {
        this.router.navigate(['/profile', id]);
    }

    // [Setting Data]
    private setProfiles(profiles: Profile[]): void {
        for (let index = 0; index < profiles.length; index++) {
            const element = profiles[index];
        }
        this.profiles = profiles;
        console.log(this.profiles)
    }
    private setError(message: string) {
        this.errorMessage = message;
    }

}
