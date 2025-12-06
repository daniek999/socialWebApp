import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { TopWebBarComponent } from "../../../shared/top-web-bar/top-web-bar.component";
import { BottomWebBarComponent } from "../../../shared/bottom-web-bar/bottom-web-bar.component";
import { NavBarComponent } from "../../../shared/nav-bar/nav-bar.component";
import { ProfileService } from '../../../core/services/profile.service';
import { IProfile, IProfilePopulated } from '../../../models/profile';
import { FriendshipService } from '../../../core/services/friendship.service';
import { ViewTitleComponent } from "../../../shared/view-title/view-title.component";

@Component({
    selector: 'app-community',
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        TopWebBarComponent,
        BottomWebBarComponent,
        NavBarComponent,
        ViewTitleComponent
    ],
    templateUrl: './community.component.html',
    styleUrl: './community.component.css'
})
export class CommunityComponent implements OnInit {

    constructor(
        private router: Router,
        private profileService: ProfileService,
        private friendshipService: FriendshipService
    ) { }

    //#region | VARIABLES   |
    profiles: IProfilePopulated[] = [];
    loadingProfiles: boolean = false;
    successMessage: string = '';
    errorMessage: string = '';
    //#endregion

    //#region | INIT        |
    ngOnInit() {
        this.loadProfiles();
    };
    loadProfiles(): void {
        this.loadingProfiles = true;
        this.profileService.getAllProfiles().subscribe({ 
            next: (res) => { 
                this.setProfiles(res.data); 
                this.loadingProfiles = false; 
            }, 
            error: (error) => { 
                this.setError(error.error?.message ?? 'Error al cargar perfiles') 
            } 
        });
    };
    //#endregion

    //#region | ACTIONS     |
    sendFriendRequest(userId: string): void {
        this.friendshipService.sendFriendRequest(userId).subscribe({
            next: (response) => {
                this.setSuccess(response.message);
            },
            error: (error) => {
                this.setError(error.message);
            }
        });
    };
    //#endregion

    //#region | GETTERS     |
    getPhotoUrl(profile: IProfilePopulated): string {
        return profile?.photo
            ? profile.photo
            : 'assets/img/default_user_photo.png';
    };
    //#endregion

    //#region | SETTERS     |
    private setProfiles(profiles: IProfile[]): void { 
        this.profiles = profiles; 
    };
    private setSuccess(message: string): void {
        this.successMessage = message;
        setTimeout(() => this.successMessage = '', 3000);
    };
    private setError(message: string) {
        this.errorMessage = message;
        setTimeout(() => this.errorMessage = '', 3000);
    };
    //#endregion

    //#region | HELPERS     |
    isProfilesListFill(): boolean {
        return !this.loadingProfiles && this.profiles && this.profiles.length > 0;
    };
    isProfilesListEmpty(): boolean {
        return !this.loadingProfiles && (!this.profiles || this.profiles.length === 0);
    };
    isLoadingProfilesData(): boolean {
        return this.loadingProfiles;
    };
    //#endregion

    //#region | NAVIGATION  |
    goToSelectedProfile(id: string) {
        this.router.navigate(['/profile', id]);
    };
    //#endregion

};