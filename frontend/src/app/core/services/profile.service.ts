import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { IProfile, IProfilePopulated } from '../../models/profile';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    private readonly PROFILE_BASE_URL = 'http://localhost:4000/api/profiles';

    constructor(
        private http: HttpClient
    ) { }

    /** * MARK: [Helpers]
        * 
        * 1. Used to get the token to bring authorization.
        * 2. Centralized HTTP error handling.
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
        * 
    */
    getAllProfiles(): Observable<IProfilePopulated[]> {
        return this.http
            .get<IProfilePopulated[]>(`${this.PROFILE_BASE_URL}/`, { headers: this.getAuthHeaders() })
            .pipe(catchError(this.handleError));
    };
    getSelfProfile(): Observable<IProfilePopulated> {
        return this.http
            .get<IProfilePopulated>(`${this.PROFILE_BASE_URL}/self`, { headers: this.getAuthHeaders() })
            .pipe(catchError(this.handleError));
    };
    getOtherProfiles(idUser: string): Observable<IProfilePopulated> {
        return this.http
            .get<IProfilePopulated>(`${this.PROFILE_BASE_URL}/${idUser}`, { headers: this.getAuthHeaders() })
            .pipe(catchError(this.handleError));
    };
    updateProfile(formData: FormData): Observable<IProfilePopulated> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
        });
        return this.http.put<IProfilePopulated>(`${this.PROFILE_BASE_URL}/self-update`, formData, {
        headers: headers
        });
    };
    getPhotoUrl(photoPath: string): string {
        if (photoPath && photoPath.startsWith('/uploads')) {
        return `http://localhost:4000${photoPath}`;
        }
        return photoPath || 'assets/img/default_user_photo.png';
    };
    getCVUrl(cvPath: string): string | null {
        if (cvPath && cvPath.startsWith('/uploads')) {
        return `http://localhost:4000${cvPath}`;
        }
        return null;
    };

}
