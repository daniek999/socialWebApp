import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { IUser, IUserListResponse, IUserSingleResponse } from '../../models/user';

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
        console.error('Error en ProfilesService:', error);
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
    deleteUser(idUser: String) {
        const headers = this.getAuthHeaders();
        const url = `${this.USER_BASE_URL}/${idUser}`;
    
        return this.http
            .delete(url, {headers})
            .pipe(catchError(this.handleError));
    };

}
