import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { Profile } from '../../../models/profileModel/profile';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ProfileService } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { TopWebBarComponent } from "../../../shared/top-web-bar/top-web-bar.component";
import { BottomWebBarComponent } from "../../../shared/bottom-web-bar/bottom-web-bar.component";

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
    profile: Profile | null = null;
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
    // Función para obtener la URL completa de la foto
    getPhotoUrl(): string {
        if (this.profile?.photo) {
            return `${this.apiUrl}${this.profile.photo}`;
        }
        return 'assets/img/default_user_photo.png';
    }
    // Función para obtener la URL completa del CV
    getCVUrl(): string | null {
        if (this.profile?.curriculumvitae) {
            return `${this.apiUrl}${this.profile.curriculumvitae}`;
        }
        return null;
    }
    // Función para descargar el CV
    downloadCV() {
        const cvUrl = this.getCVUrl();
        if (cvUrl) {
            window.open(cvUrl, '_blank');
        }
    }
    // Verificar si hay CV disponible
    hasCurriculum(): boolean {
        return !!this.profile?.curriculumvitae;
    }

    // [Navigation]
    goToEditProfile() {
        this.router.navigate(['/edit-profile'])
    }
    goToCommunity() {
        this.router.navigate(['/list-profile'])
    }

    // [Setting Data]
    private setProfile(profile: Profile) {
        this.profile = profile;
    }
    private setError(message: string) {
        this.errorMessage = message;
    }
    
}
