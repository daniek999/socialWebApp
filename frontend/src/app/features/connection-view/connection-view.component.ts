import { Component, OnInit } from '@angular/core';
import { TopWebBarComponent } from "../../shared/top-web-bar/top-web-bar.component";
import { BottomWebBarComponent } from "../../shared/bottom-web-bar/bottom-web-bar.component";
import { Router } from '@angular/router';
import { FriendshipService } from '../../core/services/friendship.service';
import { NgFor, NgIf } from '@angular/common';
import { IFriendWithProfile, IPendingRequest, ISentRequest } from '../../models/friendship';
import { NavBarComponent } from "../../shared/nav-bar/nav-bar.component";

@Component({
    selector: 'app-connection-view',
    standalone: true,
    imports: [TopWebBarComponent, BottomWebBarComponent, NgIf, NgFor, NavBarComponent],
    templateUrl: './connection-view.component.html',
    styleUrl: './connection-view.component.css'
})
export class ConnectionViewComponent implements OnInit {

    constructor(
        private router: Router,
        private friendshipService: FriendshipService
    ) { }

    //#region [Variables]
    successMessage: string = '';
    errorMessage: string = '';
    // Accepted Requests (Confirmed)
    acceptedRequests: IFriendWithProfile[] = [];
    acceptedLoading: boolean = false;
    acceptedCount: number = 0;
    // Pending Requests (Received)
    pendingRequests: IPendingRequest[] = [];
    pendingLoading: boolean = false;
    pendingCount: number = 0;
    // Pending Requests (Sended)
    sentRequests: ISentRequest[] = [];
    sentLoading: boolean = false;
    sentCount: number = 0;
    //#endregion

    //#region [On Init Methods]
    ngOnInit() {
        this.loadFriends();
        this.loadPendingRequests();
        this.loadSentRequests();
    };
    loadFriends(): void {
        this.acceptedLoading = true;
        this.pendingLoading = true;
        this.friendshipService.getFriends().subscribe({
            next: (response) => {
                this.acceptedRequests = response.friends;
                this.acceptedCount = response.count;
                this.acceptedLoading = false;
            },
            error: (error) => {
                console.error('Error al cargar amigos:', error.message);
                this.acceptedLoading = false;
            }
        });
        this.friendshipService.getPendingRequest().subscribe({
            next: (res) => {
                this.pendingRequests = res.requests;
                this.pendingCount = res.count
                this.pendingLoading = false;
            },
            error: (error) => {
                console.error('Error al cargar pendientes:', error.message);
                this.pendingLoading = false;
            }
        })
    };
    loadPendingRequests(): void {
        this.pendingLoading = true;
        this.friendshipService.getPendingRequest().subscribe({
            next: (response) => {
                this.pendingRequests = response.requests;
                this.pendingCount = response.count;
                this.pendingLoading = false;
                console.log('Pendientes cargados:', response.count);
            },
            error: (error) => {
                this.setError('Error al cargar solicitudes pendientes');
                this.pendingLoading = false;
                console.error('Error al cargar pendientes:', error.message);
            }
        });
    };
    loadSentRequests(): void {
        this.sentLoading = true;
        this.friendshipService.getSentRequest().subscribe({
            next: (response) => {
                this.sentRequests = response.sentRequests;
                this.sentCount = response.count;
                this.sentLoading = false;
                console.log('Solicitudes enviadas cargadas:', response.count);
            },
            error: (error) => {
                this.setError('Error al cargar solicitudes enviadas');
                this.sentLoading = false;
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
                console.log('Solicitud aceptada:', response.message);
            },
            error: (error) => {
                this.setError('Error al aceptar solicitud');
                console.error('Error al aceptar:', error.message);
            }
        });
    }
    rejectRequest(friendshipId: string): void {
        this.friendshipService.rejectFriendRequest(friendshipId).subscribe({
            next: (response) => {
                this.setSuccess('Solicitud rechazada');
                // Recargar pendientes
                this.loadPendingRequests();
                console.log('Solicitud rechazada:', response.message);
            },
            error: (error) => {
                this.setError('Error al rechazar solicitud');
                console.error('Error al rechazar:', error.message);
            }
        });
    }
    cancelSentRequest(friendshipId: string): void {
        this.friendshipService.cancelFriendRequest(friendshipId).subscribe({
            next: (response) => {
                this.setSuccess('Solicitud cancelada');
                // Recargar enviadas
                this.loadSentRequests();
                console.log('Solicitud cancelada:', response.message);
            },
            error: (error) => {
                this.setError('Error al cancelar solicitud');
                console.error('Error al cancelar:', error.message);
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
                    console.log('Amistad eliminada:', response.message);
                },
                error: (error) => {
                    this.setError('Error al eliminar amistad');
                    console.error('Error al eliminar:', error.message);
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
                console.log('Solicitud enviada:', response.message);
            },
            error: (error) => {
                this.setError(error.message);
                console.error('Error al enviar:', error.message);
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

    //#region [Navigation]
    goToSelectedProfile(id: string) {
        this.router.navigate(['/profile', id]);
    }
    //#endregion

    //#region [Setting Data]
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
    isFriendsListEmpty(): boolean {
        const noAccepted = !this.acceptedRequests || this.acceptedRequests.length === 0;
        const noPending = !this.pendingRequests || this.pendingRequests.length === 0;
        const noSent = !this.sentRequests || this.sentRequests.length === 0;

        return !this.isLoadingFriendsData() && noAccepted && noPending && noSent;
    };
    isLoadingFriendsData(): boolean {
        return this.acceptedLoading || this.pendingLoading || this.sentLoading;
    };
    // Verificators
    hasAcceptedRequests(): boolean {
        return !this.acceptedLoading && this.acceptedRequests && this.acceptedRequests.length > 0;
    };
    hasPendingRequests(): boolean {
        return this.pendingRequests && this.pendingRequests.length > 0;
    };
    hasSentRequests(): boolean {
        return this.sentRequests && this.sentRequests.length > 0;
    };
    //#endregion

}