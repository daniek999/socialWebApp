import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ProfileService } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { TopWebBarComponent } from "../../../shared/top-web-bar/top-web-bar.component";
import { IProfilePopulated } from '../../../models/profile';

@Component({
    selector: 'app-profile-list',
    standalone: true,
    imports: [NgIf, NgFor, TopWebBarComponent, NgClass],
    templateUrl: './profile-list.component.html',
    styleUrl: './profile-list.component.css'
})
export class ProfileListComponent implements OnInit {

    constructor(
        private router: Router,
        private profileService: ProfileService
    ) { }
    
    /* ============================
    // MARK: [Params]
    ============================ */
    profiles: IProfilePopulated[] = [];
    loading: boolean = true;
    successMessage: string | null = null;
    errorMessage: string | null = null;


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

    // [Getters]
    getUsername(profile: IProfilePopulated): string {
        return profile.idUser?.username || 'Usuario';
    }
    getFullName(profile: IProfilePopulated): string {
        const firstName = profile.name || '';
        const lastName = profile.surname || '';
        const fullName = `${firstName} ${lastName}`.trim();
        return fullName || 'Sin nombre';
    }
    getPhotoUrl(profile: IProfilePopulated): string {
        if (profile.photo) {
            return `http://localhost:4000${profile.photo}`;
        }
        return 'assets/img/default_user_photo.png';
    }

    // [Navigation]
    goToSelectedProfile(id: string) {
        this.router.navigate(['/profile', id]);
    }

    // [Setting Data]
    private setProfiles(profiles: IProfilePopulated[]): void {
        this.profiles = profiles;
        console.log('Perfiles cargados:', this.profiles.length);
    }

    private setError(message: string) {
        this.errorMessage = message;
        setTimeout(() => {
            this.errorMessage = null;
        }, 5000);
    }
}
