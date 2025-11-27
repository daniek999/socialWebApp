import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf, NgForOf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../../../core/services/profile.service';
import { TopWebBarComponent } from "../../../shared/top-web-bar/top-web-bar.component";
import { BottomWebBarComponent } from "../../../shared/bottom-web-bar/bottom-web-bar.component";
import { IProfilePopulated } from '../../../models/profile';
import { NavBarComponent } from "../../../shared/nav-bar/nav-bar.component";

@Component({
    selector: 'app-myself',
    standalone: true,
    imports: [
        FormsModule, 
        HttpClientModule, 
        NgIf, 
        NgClass, 
        TopWebBarComponent, 
        BottomWebBarComponent, 
        NavBarComponent, 
        NgForOf
    ],
    templateUrl: './myself.component.html',
    styleUrl: './myself.component.css'
})
export class MyselfComponent implements OnInit {

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private profileService: ProfileService,
    ) { }

    // MARK: [VARIABLES]
    profile: IProfilePopulated | null = null;
    loadingProfile: boolean = false;
    // Estados de proceso
    isOwnProfile: boolean = false;
    successMessage: string = '';
    errorMessage: string = '';

    // MARK: [INIT - METHODS]
    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            // Perfil ajeno
            this.loadOtherProfile(id);
        } else {
            // Perfil propio
            this.loadSelfProfile();
        }
    }
    loadSelfProfile(): void {
        this.isOwnProfile = true;
        this.profileService.getSelfProfile().subscribe({
            next: (response) => this.setProfile(response.data),
            error: (error) => this.setError(error.error?.message ?? 'Error al cargar tu perfil')
        });
    }
    loadOtherProfile(id: string): void {
        this.isOwnProfile = false;
        this.profileService.getOtherProfile(id).subscribe({
            next: (response) => this.setProfile(response.data),
            error: (error) => this.setError(error.error?.message ?? 'Error al cargar el perfil')
        });
    }
    
    // MARK: [GETTERS]
    getUserRole(): string {
        if (!this.profile) return '';
        return this.profile.idUser.role === 'user'
            ? 'Usuario'
            : 'Administrador';
    }
    getUserCreatedAt(): string {
        const dateStr = this.profile?.idUser?.createdAt;
        if (!dateStr) return '';

        const date = new Date(dateStr);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }
    getPhotoUrl(): string {
        return this.profile?.photo
            ? `http://localhost:4000${this.profile.photo}`
            : 'assets/img/default_user_photo.png';
    }
    getCVUrl(): string | null {
        return this.profile?.curriculumvitae
            ? `http://localhost:4000${this.profile.curriculumvitae}`
            : null;
    }
    hasCurriculum(): boolean {
        return !!this.profile?.curriculumvitae;
    }
    
    // MARK: [ACTIONS]
    goToEditProfile() {
        this.router.navigate(['/edit-profile']);
    }
    goToCommunity() {
        this.router.navigate(['/list-profile']);
    }
    downloadCV() {
        const cvUrl = this.getCVUrl();
        if (cvUrl) {
            window.open(cvUrl, '_blank');
        }
    }

    // MARK: [SETTERS]
    private setProfile(profile: IProfilePopulated) {
        this.profile = profile;
        console.log('Perfil cargado:', profile);
    }
    private setError(message: string) {
        this.errorMessage = message;
        setTimeout(() => this.errorMessage = '', 5000);
    };
    formatBirthdayShort(dateString?: string): string {
        if (!dateString) return '';

        const date = new Date(dateString);

        // Ajustar timezone igual que antes
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

        const meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        const dia = date.getDate();
        const mes = meses[date.getMonth()];

        return `${dia} de ${mes}`;
    };

}