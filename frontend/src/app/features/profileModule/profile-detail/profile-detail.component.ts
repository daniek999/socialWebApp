import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../../../core/services/profile.service';
import { TopWebBarComponent } from "../../../shared/top-web-bar/top-web-bar.component";
import { BottomWebBarComponent } from "../../../shared/bottom-web-bar/bottom-web-bar.component";
import { IProfilePopulated } from '../../../models/profile';

@Component({
    selector: 'app-profile-detail',
    standalone: true,
    imports: [FormsModule, HttpClientModule, NgIf, NgClass, TopWebBarComponent, BottomWebBarComponent],
    templateUrl: './profile-detail.component.html',
    styleUrl: './profile-detail.component.css'
})
export class ProfileDetailComponent implements OnInit {

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private profileService: ProfileService,
    ) {}

    /* ============================
    // MARK: [Params]
    ============================ */
    private apiUrl = 'http://localhost:4000';
    profile: IProfilePopulated | null = null;
    // Estados de proceso
    isOwnProfile: boolean = false;
    successMessage: string = '';
    errorMessage: string = '';

    /* ============================
    // MARK: [Component Functions]
    ============================ */
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
            this.profileService.getSelfProfile().subscribe({
                next: (data) => this.setProfile(data),
                error: (error) => this.setError(error.error?.message)
            });
        }
        console.log(this.isOwnProfile);
    }
    // [Getters]
    // Obtener username de forma segura
    getUsername(): string {
        return this.profile?.idUser?.username || 'Usuario';
    }
    // Obtener email de forma segura
    getEmail(): string {
        return this.profile?.idUser?.email || 'email@ejemplo.com';
    }
    // Obtener nombre completo
    getFullName(): string {
        if (!this.profile) return 'Sin nombre';
        const firstName = this.profile.name || '';
        const lastName = this.profile.surname || '';
        const fullName = `${firstName} ${lastName}`.trim();
        return fullName || 'Sin nombre';
    }
    getPhotoUrl(): string {
        if (this.profile?.photo) {
            return `http://localhost:4000${this.profile.photo}`;
        }
        return 'assets/img/default_user_photo.png';
    }
    getCVUrl(): string | null {
        if (this.profile?.curriculumvitae) {
            return `${this.apiUrl}${this.profile.curriculumvitae}`;
        }
        return null;
    }
    hasCurriculum(): boolean {
        return !!this.profile?.curriculumvitae;
    }

    // [Actions]
    downloadCV() {
        const cvUrl = this.getCVUrl();
        if (cvUrl) {
            window.open(cvUrl, '_blank');
        }
    }

    // [Navigation]
    goToEditProfile() {
        this.router.navigate(['/edit-profile'])
    }
    goToCommunity() {
        this.router.navigate(['/list-profile'])
    }

    // [Private Methods]
    private setProfile(profile: IProfilePopulated) {
        this.profile = profile;
        console.log('Profile cargado:', profile);
    }
    private setError(message: string) {
        this.errorMessage = message;
        setTimeout(() => {
            this.errorMessage = '';
        }, 5000);
    }
    
}
