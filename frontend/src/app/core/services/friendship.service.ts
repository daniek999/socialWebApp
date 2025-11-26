import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IFriendshipPopulated, IAcceptedRequest, IPendingRequest, IRelationshipStatus, ISentRequest } from '../../models/friendship';
import { catchError, Observable, throwError } from 'rxjs';

interface SendFriendRequestResponse {
    message: string;
    friendship: IFriendshipPopulated;
}
interface AcceptFriendRequestResponse {
    message: string;
    friendshipSolicitude: IFriendshipPopulated;
}
interface SimpleMessageResponse {
    message: string;
}
interface GetFriendsResponse {
    count: number;
    friends: IAcceptedRequest[];
}
interface GetPendingRequestsResponse {
    count: number;
    requests: IPendingRequest[];
}
interface GetSentRequestsResponse {
    count: number;
    sentRequests: ISentRequest[];
}

@Injectable({
    providedIn: 'root'
})
export class FriendshipService {

    private readonly FRIENDSHIP_BASE_URL = 'http://localhost:4000/api/friendships';

    constructor(
        private http: HttpClient,
    ) { }

    /** * MARK: [Helpers]
        * 
        * 1. Used to get the token to bring authorization.
        * 2. Manage errors of the requests.
    */
    private getAuthHeader(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
        });
    };
    private handleError(error: any): Observable<never> {
        console.error('Error en [FriendshipService]:', error);
        const errorMessage = error.error?.message || error.message || 'Error desconocido';
        return throwError(() => new Error(errorMessage));
    };

    /** * MARK: [Handlers]
        * 
        * With a total of 9 handlers, which are divided into 2 types:
        * 1. Actions routes.
        * 2. Query routes.
    */
    sendFriendRequest(recipientId: string): Observable<SendFriendRequestResponse> {
        const headers = this.getAuthHeader();
        const url = `${this.FRIENDSHIP_BASE_URL}/request`;
        const body = { recipientId }

        return this.http.post<SendFriendRequestResponse>(url, body, { headers }).pipe(catchError(this.handleError));
    };
    acceptFriendRequest(friendshipId: string): Observable<AcceptFriendRequestResponse> {
        const headers = this.getAuthHeader();
        const url = `${this.FRIENDSHIP_BASE_URL}/${friendshipId}/accept`;

        return this.http.patch<AcceptFriendRequestResponse>(url, {}, { headers }).pipe(catchError(this.handleError));
    };
    rejectFriendRequest(friendshipId: string): Observable<SimpleMessageResponse> {
        const headers = this.getAuthHeader();
        const url = `${this.FRIENDSHIP_BASE_URL}/${friendshipId}/reject`;

        return this.http.delete<SimpleMessageResponse>(url, { headers }).pipe(catchError(this.handleError));
    };
    cancelFriendRequest(friendshipId: string): Observable<SimpleMessageResponse> {
        const headers = this.getAuthHeader();
        const url = `${this.FRIENDSHIP_BASE_URL}/${friendshipId}/cancel`;

        return this.http.delete<SimpleMessageResponse>(url, { headers }).pipe(catchError(this.handleError));
    };
    removeFriend(friendshipId: string): Observable<SimpleMessageResponse> {
        const headers = this.getAuthHeader();
        const url = `${this.FRIENDSHIP_BASE_URL}/${friendshipId}`;

        return this.http.delete<SimpleMessageResponse>(url, { headers }).pipe(catchError(this.handleError));
    };
    getFriends(): Observable<GetFriendsResponse> {
        const headers = this.getAuthHeader();
        const url = `${this.FRIENDSHIP_BASE_URL}/friends`;

        return this.http.get<GetFriendsResponse>(url, { headers }).pipe(catchError(this.handleError));
    };
    getPendingRequest(): Observable<GetPendingRequestsResponse> {
        const headers = this.getAuthHeader();
        const url = `${this.FRIENDSHIP_BASE_URL}/pending`;

        return this.http.get<GetPendingRequestsResponse>(url, { headers }).pipe(catchError(this.handleError));
    };
    getSentRequest(): Observable<GetSentRequestsResponse> {
        const headers = this.getAuthHeader();
        const url = `${this.FRIENDSHIP_BASE_URL}/sent`;

        return this.http.get<GetSentRequestsResponse>(url, { headers }).pipe(catchError(this.handleError));
    };
    getRelationshipStatus(userId: string): Observable<IRelationshipStatus> {
        const headers = this.getAuthHeader();
        const url = `${this.FRIENDSHIP_BASE_URL}/status/${userId}`;

        return this.http.get<IRelationshipStatus>(url, { headers }).pipe(catchError(this.handleError));
    };

}
