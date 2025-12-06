import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf, NgForOf, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../../../core/services/profile.service';
import { TopWebBarComponent } from "../../../shared/top-web-bar/top-web-bar.component";
import { BottomWebBarComponent } from "../../../shared/bottom-web-bar/bottom-web-bar.component";
import { IProfilePopulated } from '../../../models/profile';
import { NavBarComponent } from "../../../shared/nav-bar/nav-bar.component";
import { IAchievementPopulated } from '../../../models/achievement';
import { AchievementService } from '../../../core/services/achievement.service';
import { ViewTitleComponent } from "../../../shared/view-title/view-title.component";
import { environment } from '../../../../environments/environment.development';

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
        NgForOf,
        DatePipe,
        ViewTitleComponent
    ],
    templateUrl: './myself.component.html',
    styleUrl: './myself.component.css'
})
export class MyselfComponent implements OnInit {

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private profileService: ProfileService,
        private achievementService: AchievementService
    ) { }

    //#region | VARIABLES   |
    // Profile Vars
    profile: IProfilePopulated | null = null;
    loadingProfile: boolean = false;
    // Achievement Vars
    achievement: IAchievementPopulated[] = [];
    loadingAchievement: boolean = false;
    // Estados de proceso
    isOwnProfile: boolean = false;
    successMessage: string = '';
    errorMessage: string = '';
    //#endregion

    //#region | INIT        |
    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            // Perfil ajeno
            this.loadOtherProfile(id);
        } else {
            // Perfil propio
            this.loadSelfProfile();
        }
    };
    loadSelfProfile(): void {
        this.isOwnProfile = true;
        this.loadingProfile = true;
        
        this.profileService.getSelfProfile().subscribe({
            next: (response) => {
                this.setProfile(response.data);
                this.loadUserAchievements(response.data.idUser._id);
                this.loadingProfile = false;
            },
            error: (error) => {
                this.setError(error.error?.message ?? 'Error al cargar tu perfil.');
                this.loadingProfile = false;
            }
        });
    };
    loadOtherProfile(id: string): void {
        this.isOwnProfile = false;
        this.loadingProfile = true;

        this.profileService.getOtherProfile(id).subscribe({
            next: (response) => {
                this.setProfile(response.data);
                this.loadUserAchievements(response.data.idUser._id);
                this.loadingProfile = false;
            },
            error: (error) => {
                this.setError(error.error?.message ?? 'Error al cargar el perfil.');
                this.loadingProfile = false;    
            }
        });
    };
    loadUserAchievements(idUser: string): void {
        this.loadingAchievement = true;
        this.achievementService.getUserAchievements(idUser).subscribe({
            next: (response) => {
                this.setAchievement(response.data);
                this.loadingAchievement = false;
            },
            error: (error) => {
                this.setError(error);
                this.loadingAchievement = false;
            }
        });
    };
    //#endregion
    
    //#region | ACTIONS     |
    openCV() {
        const cvUrl = this.getCVUrl();
        if (cvUrl) {
            window.open(cvUrl, '_blank');
        }
    };
    //#endregion

    //#region | GETTERS     |
    getUserRole(): string {
        if (!this.profile) return '';
        return this.profile.idUser.role === 'user'
            ? 'Usuario'
            : 'Administrador';
    };
    getUserCreatedAt(): string {
        const dateStr = this.profile?.idUser?.createdAt;
        if (!dateStr) return '';

        const date = new Date(dateStr);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };
    getPhotoUrl(): string {
        return this.profile?.photo
            ? this.profile.photo
            : 'assets/img/default_user_photo.png';
    };
    getCVUrl(): string | null {
        return this.profile?.curriculumvitae || null;
    };
    hasCurriculum(): boolean {
        return !!this.profile?.curriculumvitae;
    };
    //#endregion

    //#region | SETTERS     |
    private setProfile(profile: IProfilePopulated) {
        this.profile = profile;
    };
    private setAchievement(achievement: IAchievementPopulated[]) {
        this.achievement = achievement;
    };
    private setError(message: string) {
        this.errorMessage = message;
        setTimeout(() => this.errorMessage = '', 3000);
    };
    //#endregion

    //#region | NAVIGATION  |
    goToEditProfile() {
        this.router.navigate(['/edit-profile']);
    };
    goToCommunity() {
        this.router.navigate(['/list-profile']);
    };
    //#endregion

};