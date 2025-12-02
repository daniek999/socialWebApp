import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { IActionResponse, IBannedUserListResponse, ISuspendedUserListResponse, IUser, IUserListResponse, IUserSingleResponse } from '../../models/user';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private readonly USER_BASE_URL = 'http://localhost:4000/api/users';

    constructor(
        private http: HttpClient
    ) { }

    /** * MARK: [Helpers]
        * 
        * 1. Used to get the token to bring authorization.
        * 2. Manage errors of the requests.
    */
    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
        });
    };
    private handleError(error: any) {
        console.error('Error en UserService:', error);
        return throwError(() => error.error?.message || 'Error desconocido del servidor.');
    };

    /** * MARK: [Handlers]
        * ================
        * getAllUsers(): Obtiene todos los usuarios
        * getUserById(): Obtiene a un usuario por su ID
        * deleteUser(): Eliminar a un usuario por su ID
    */
    getAllUsers(): Observable<IUserListResponse> {
        const headers = this.getAuthHeaders();
        const url = `${this.USER_BASE_URL}/`;

        return this.http
            .get<IUserListResponse>(url, { headers })
            .pipe(catchError(this.handleError));
    };
    getUserById(idUser: String): Observable<IUserSingleResponse> {
        const headers = this.getAuthHeaders();
        const url = `${this.USER_BASE_URL}/${idUser}`;

        return this.http
            .get<IUserSingleResponse>(url, {headers})
            .pipe(catchError(this.handleError));
    };
    getSuspendedUsers(): Observable<ISuspendedUserListResponse> {
        const headers = this.getAuthHeaders();
        const url = `${this.USER_BASE_URL}/suspended`;

        return this.http
            .get<ISuspendedUserListResponse>(url, { headers })
            .pipe(catchError(this.handleError));

    };
    getBannedUsers(): Observable<IBannedUserListResponse> {
        const headers = this.getAuthHeaders();
        const url = `${this.USER_BASE_URL}/banned`;

        return this.http
            .get<IBannedUserListResponse>(url, { headers })
            .pipe(catchError(this.handleError));

    };
    suspendUser(idUser: string, payload: { reason: string; suspendedTime: number }): Observable<IActionResponse> {
        const headers = this.getAuthHeaders();
        const url = `${this.USER_BASE_URL}/suspend/${idUser}`;

        return this.http
            .post<IActionResponse>(url, payload, { headers })
            .pipe(catchError(this.handleError));
    };
    revokeSuspension(idSuspension: string, payload: { revokeReason: string }): Observable<IActionResponse> {
        const headers = this.getAuthHeaders();
        const url = `${this.USER_BASE_URL}/suspend/revoke/${idSuspension}`;

        return this.http
            .patch<IActionResponse>(url, payload, { headers })
            .pipe(catchError(this.handleError));
    };
    banUser(idUser: string, payload: { reason: string }): Observable<IActionResponse> {
        const headers = this.getAuthHeaders();
        const url = `${this.USER_BASE_URL}/ban/${idUser}`;

        return this.http
            .post<IActionResponse>(url, payload, { headers })
            .pipe(catchError(this.handleError));
    };
    revokeBan(idUser: string, payload: { revokeReason: string }): Observable<IActionResponse> {
        const headers = this.getAuthHeaders();
        const url = `${this.USER_BASE_URL}/ban/revoke/${idUser}`;

        return this.http
            .patch<IActionResponse>(url, payload, { headers })
            .pipe(catchError(this.handleError));
    };

};