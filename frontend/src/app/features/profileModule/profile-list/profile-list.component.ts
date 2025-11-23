import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ProfileService } from '../../../core/services/profile.service';
import { TopWebBarComponent } from "../../../shared/top-web-bar/top-web-bar.component";
import { IProfilePopulated } from '../../../models/profile';
import { BottomWebBarComponent } from "../../../shared/bottom-web-bar/bottom-web-bar.component";
import { IFriendWithProfile, IPendingRequest, ISentRequest } from '../../../models/friendship';
import { FriendshipService } from '../../../core/services/friendship.service';

@Component({
    selector: 'app-profile-list',
    standalone: true,
    imports: [NgIf, NgFor, TopWebBarComponent, BottomWebBarComponent, NgClass],
    templateUrl: './profile-list.component.html',
    styleUrl: './profile-list.component.css'
})
export class ProfileListComponent implements OnInit {

    constructor(
        private router: Router,
        private profileService: ProfileService,
        private friendshipService: FriendshipService
    ) { }

    //#region [Variables]
    successMessage: string = '';
    errorMessage: string = '';
    // Friends (Accepted)
    friends: IFriendWithProfile[] = [];
    loadingFriends: boolean = false;
    friendsCount: number = 0;
    // Pending Requests (Received)
    pendingRequests: IPendingRequest[] = [];
    loadingPending: boolean = false;
    pendingCount: number = 0;
    // Pending Requests (Sended)
    sentRequests: ISentRequest[] = [];
    loadingSent: boolean = false;
    sentCount: number = 0;
    // Profile Data
    profiles: IProfilePopulated[] = [];
    loadingProfiles: boolean = false;
    //#endregion


    //#region [On Init Methods]
    ngOnInit() {
        this.loadProfiles();
        this.loadFriends();
        this.loadPendingRequests();
        this.loadSentRequests();
    }
    loadProfiles():void  {
        this.loadingProfiles = true;
        this.profileService.getAllProfiles().subscribe({
            next: (data) => {
                this.setProfiles(data);
                this.loadingProfiles = false;
            },
            error: (error) => this.setError(error.error?.message ?? 'Error al cargar perfiles'),
        });
    }
    loadFriends(): void {
        this.loadingFriends = true;
        this.loadingPending = true;

        this.friendshipService.getFriends().subscribe({
            next: (response) => {
                this.friends = response.friends;
                this.friendsCount = response.count;
                this.loadingFriends = false;
            },
            error: (error) => {
                console.error('Error al cargar amigos:', error.message);
                this.loadingFriends = false;
            }
        });

        this.friendshipService.getPendingRequest().subscribe({
            next: (res) => {
                this.pendingRequests = res.requests;
                this.pendingCount = res.count
                this.loadingPending = false;
            },
            error: (error) => {
                console.error('Error al cargar pendientes:', error.message);
                this.loadingPending = false;
            }
        })

    }
    loadPendingRequests(): void {
        this.loadingPending = true;

        this.friendshipService.getPendingRequest().subscribe({
            next: (response) => {
                this.pendingRequests = response.requests;
                this.pendingCount = response.count;
                this.loadingPending = false;
                console.log('Pendientes cargados:', response.count);
            },
            error: (error) => {
                this.setError('Error al cargar solicitudes pendientes');
                this.loadingPending = false;
                console.error('Error al cargar pendientes:', error.message);
            }
        });
    };
    loadSentRequests(): void {
        this.loadingSent = true;

        this.friendshipService.getSentRequest().subscribe({
            next: (response) => {
                this.sentRequests = response.sentRequests;
                this.sentCount = response.count;
                this.loadingSent = false;
                console.log('Solicitudes enviadas cargadas:', response.count);
            },
            error: (error) => {
                this.setError('Error al cargar solicitudes enviadas');
                this.loadingSent = false;
                console.error('Error al cargar enviadas:', error.message);
            }
        });
    };
    //#endregion

    //#region [Action Methods - Friendship]
    acceptRequest(friendshipId: string): void {
        this.friendshipService.acceptFriendRequest(friendshipId).subscribe({
            next: (response) => {
                this.setSuccess('Solicitud aceptada correctamente');
                // Recargar datos
                this.loadFriends();
                this.loadPendingRequests();
                console.log('✅ Solicitud aceptada:', response.message);
            },
            error: (error) => {
                this.setError('Error al aceptar solicitud');
                console.error('❌ Error al aceptar:', error.message);
            }
        });
    }
    rejectRequest(friendshipId: string): void {
        this.friendshipService.rejectFriendRequest(friendshipId).subscribe({
            next: (response) => {
                this.setSuccess('Solicitud rechazada');
                // Recargar pendientes
                this.loadPendingRequests();
                console.log('✅ Solicitud rechazada:', response.message);
            },
            error: (error) => {
                this.setError('Error al rechazar solicitud');
                console.error('❌ Error al rechazar:', error.message);
            }
        });
    }
    cancelSentRequest(friendshipId: string): void {
        this.friendshipService.cancelFriendRequest(friendshipId).subscribe({
            next: (response) => {
                this.setSuccess('Solicitud cancelada');
                // Recargar enviadas
                this.loadSentRequests();
                console.log('✅ Solicitud cancelada:', response.message);
            },
            error: (error) => {
                this.setError('Error al cancelar solicitud');
                console.error('❌ Error al cancelar:', error.message);
            }
        });
    }
    removeFriend(friendshipId: string): void {
        if (confirm('¿Estás seguro de eliminar esta amistad?')) {
            this.friendshipService.removeFriend(friendshipId).subscribe({
                next: (response) => {
                    this.setSuccess('Amistad eliminada');
                    // Recargar amigos
                    this.loadFriends();
                    console.log('✅ Amistad eliminada:', response.message);
                },
                error: (error) => {
                    this.setError('Error al eliminar amistad');
                    console.error('❌ Error al eliminar:', error.message);
                }
            });
        }
    }
    sendFriendRequest(userId: string): void {
        this.friendshipService.sendFriendRequest(userId).subscribe({
            next: (response) => {
                this.setSuccess('Solicitud enviada correctamente');
                // Recargar solicitudes enviadas
                this.loadSentRequests();
                console.log('✅ Solicitud enviada:', response.message);
            },
            error: (error) => {
                this.setError(error.message);
                console.error('❌ Error al enviar:', error.message);
            }
        });
    }
    //#endregion

    //#region [Friendship Getters]
    // 'Aceptado'
    getFriendFullName(friend: IFriendWithProfile): string {
        if (friend.profile?.name && friend.profile?.surname) {
            return `${friend.profile.name} ${friend.profile.surname}`;
        }
        return friend.user.username;
    }
    getFriendPhoto(friend: IFriendWithProfile): string {
        if (friend.profile?.photo) {
            return `http://localhost:4000${friend.profile.photo}`;
        }
        return 'assets/img/default_user_photo.png';
    }
    // 'Pendiente - Recibido'
    getPendingFullName(request: IPendingRequest): string {
        if (request.profile?.name && request.profile?.surname) {
            return `${request.profile.name} ${request.profile.surname}`;
        }
        return request.requester.username;
    }
    getPendingPhoto(request: IPendingRequest): string {
        if (request.profile?.photo) {
            return `http://localhost:4000${request.profile.photo}`;
        }
        return 'assets/img/default_user_photo.png';
    }
    // 'Pendiente - Enviado'
    getSentFullName(request: ISentRequest): string {
        if (request.profile?.name && request.profile?.surname) {
            return `${request.profile.name} ${request.profile.surname}`;
        }
        return request.recipient.username;
    }
    getSentPhoto(request: ISentRequest): string {
        if (request.profile?.photo) {
            return `http://localhost:4000${request.profile.photo}`;
        }
        return 'assets/img/default_user_photo.png';
    }
    //#endregion


    //#region [Profile Getters]
    getPhotoUrl(profile: IProfilePopulated): string {
        if (profile.photo) {
            return `http://localhost:4000${profile.photo}`;
        }
        return 'assets/img/default_user_photo.png';
    }
    //#endregion


    //#region [Navigation]
    goToSelectedProfile(id: string) {
        this.router.navigate(['/profile', id]);
    }
    //#endregion


    //#region [Setting Data]
    private setProfiles(profiles: IProfilePopulated[]): void {
        this.profiles = profiles;
    }
    private setSuccess(message: string): void {
        this.successMessage = message;
        setTimeout(() => {
            this.successMessage = '';
        }, 3000);
    }
    private setError(message: string) {
        this.errorMessage = message;
        setTimeout(() => {
            this.errorMessage = '';
        }, 5000);
    }
    //#endregion

    
    //#region [Helpers]
    // Friendship
    isFriendsListFill(): boolean {
        return !this.loadingFriends && this.friends && this.friends.length > 0;
    }
    isFriendsListEmpty(): boolean {
        return !this.loadingFriends && (!this.friends || this.friends.length === 0);
    }
    isLoadingFriendsData(): boolean{
        return this.loadingFriends;
    }
    // Profiles
    isProfilesListFill(): boolean {
        return !this.loadingProfiles && this.profiles && this.profiles.length > 0;
    }
    isProfilesListEmpty(): boolean {
        return !this.loadingProfiles && (!this.profiles || this.profiles.length === 0);
    }
    isLoadingProfilesData(): boolean{
        return this.loadingProfiles;
    }
    // Verificators
    hasPendingRequests(): boolean {
        return this.pendingRequests && this.pendingRequests.length > 0;
    }
    hasSentRequests(): boolean {
        return this.sentRequests && this.sentRequests.length > 0;
    }
    //#endregion
}
