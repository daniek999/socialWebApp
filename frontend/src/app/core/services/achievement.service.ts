import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { IAchievementListResponse, IAchievementSingleResponse } from '../../models/achievement';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class AchievementService {

    private readonly ACHIEVEMENT_BASE_URL = `${environment.apiUrl}/achievements`;

    constructor(private http: HttpClient) { };

    /** * MARK: [Helpers]
        * 
        * 1. Used to get the token to bring authorization.
        * 2. Manage errors of the requests.
    */
    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            ...(token && { Authorization: `Bearer ${token}` })
        });
    };
    private handleError(error: any) {
        console.error('Error en ProfileService:', error);
        return throwError(() => error.error?.message || 'Error desconocido del servidor.');
    };

    /** * MARK: [Handlers] 
     * 
    */
    getUserAchievements(idUser: string): Observable<IAchievementSingleResponse> {
        const url = `${this.ACHIEVEMENT_BASE_URL}/${idUser}`;
        const headers = this.getAuthHeaders();

        return this.http
            .get<IAchievementSingleResponse>(url, {headers})
            .pipe(catchError(err => this.handleError(err)));
    };
    getGlobalAchievements(): Observable<IAchievementListResponse> {
        const url = `${this.ACHIEVEMENT_BASE_URL}/global`;
        const headers = this.getAuthHeaders();

        return this.http
            .get<IAchievementListResponse>(url, {headers})
            .pipe(catchError(err => this.handleError(err)));
    };

};