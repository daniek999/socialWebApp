import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { TopWebBarComponent } from '../../../shared/top-web-bar/top-web-bar.component';
import { BottomWebBarComponent } from '../../../shared/bottom-web-bar/bottom-web-bar.component';
import { IAcceptedRequest, IPendingRequest, ISentRequest } from '../../../models/friendship';
import { FriendshipService } from '../../../core/services/friendship.service';
import { NavBarComponent } from '../../../shared/nav-bar/nav-bar.component';

@Component({
    selector: 'app-connections',
    standalone: true,
    imports: [TopWebBarComponent, BottomWebBarComponent, NgIf, NgFor, NavBarComponent],
    templateUrl: './connections.component.html',
    styleUrl: './connections.component.css'
})
export class ConnectionsComponent implements OnInit {

    constructor(
        private router: Router,
        private friendshipService: FriendshipService
    ) { }

    //#region [Variables]
    successMessage: string = '';
    errorMessage: string = '';
    // Accepted Requests (Confirmed)
    acceptedRequests: IAcceptedRequest[] = [];
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
                console.log(this.acceptedRequests);
                
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
            },
            error: (error) => {
                this.setError('Error al cargar solicitudes pendientes');
                this.pendingLoading = false;
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
            },
            error: (error) => {
                this.setError('Error al cargar solicitudes enviadas');
                this.sentLoading = false;
            }
        });
    };
    //#endregion

    //#region [Action Methods - Friendship]
    acceptRequest(friendshipId: string): void {
        this.friendshipService.acceptFriendRequest(friendshipId).subscribe({
            next: (response) => {
                this.setSuccess(response.message);
                this.loadFriends();
                this.loadPendingRequests();
            },
            error: (error) => {
                this.setError(error.message);
            }
        });
    }
    rejectRequest(friendshipId: string): void {
        this.friendshipService.rejectFriendRequest(friendshipId).subscribe({
            next: (response) => {
                this.setSuccess(response.message);
                this.loadPendingRequests();
            },
            error: (error) => {
                this.setError(error.message);
            }
        });
    }
    cancelSentRequest(friendshipId: string): void {
        this.friendshipService.cancelFriendRequest(friendshipId).subscribe({
            next: (response) => {
                this.setSuccess(response.message);
                this.loadSentRequests();
            },
            error: (error) => {
                this.setError(error.message);
            }
        });
    }
    removeFriend(friendshipId: string): void {
        if (confirm('¿Estás seguro de eliminar esta amistad?')) {
            this.friendshipService.removeFriend(friendshipId).subscribe({
                next: (response) => {
                    this.setSuccess(response.message);
                    this.loadFriends();
                },
                error: (error) => {
                    this.setError(error.message);
                }
            });
        }
    }
    sendFriendRequest(userId: string): void {
        this.friendshipService.sendFriendRequest(userId).subscribe({
            next: (response) => {
                this.setSuccess(response.message);
                this.loadSentRequests();
            },
            error: (error) => {
                this.setError(error.message);
            }
        });
    }
    //#endregion

    //#region [Getters]
    // 'Aceptado'
    getFriendFullName(friend: IAcceptedRequest): string | null {
        return this.setNameFromProfile(friend.profile?.name, friend.profile?.surname);
    };
    getFriendPhoto(friend: IAcceptedRequest): string {
        return this.setPhotoFromProfile(friend.profile?.photo);
    };
    // 'Pendiente - Recibido'
    getPendingFullName(request: IPendingRequest): string | null {
        return this.setNameFromProfile(request.profile?.name, request.profile?.surname);
    };
    getPendingPhoto(request: IPendingRequest): string {
        return this.setPhotoFromProfile(request.profile?.photo);
    };
    // 'Pendiente - Enviado'
    getSentFullName(request: ISentRequest): string | null {
        return this.setNameFromProfile(request.profile?.name, request.profile?.surname);
    };
    getSentPhoto(request: ISentRequest): string {
        return this.setPhotoFromProfile(request.profile?.photo);
    };
    //#endregion

    //#region [Setters]
    private setNameFromProfile(name?: string, surname?: string): string | null {
        if (name && surname) {
            return name + ' ' + surname;
        }
        return null;
    }
    private setPhotoFromProfile(photo?: string): string {
        return photo ? `http://localhost:4000${photo}` : 'assets/img/default_user_photo.png';
    }
    private setSuccess(message: string): void {
        this.successMessage = message;
        setTimeout(() => {
            this.successMessage = '';
        }, 3000);
    };
    private setError(message: string) {
        this.errorMessage = message;
        setTimeout(() => {
            this.errorMessage = '';
        }, 3000);
    };
    //#endregion

    //#region [Navigation]
    goToSelectedProfile(id: string) {
        this.router.navigate(['/profile', id]);
    };
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
