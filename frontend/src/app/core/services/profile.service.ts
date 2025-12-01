import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { IProfileListResponse, IProfileSingleResponse } from '../../models/profile';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private readonly PROFILE_BASE_URL = 'http://localhost:4000/api/profiles';

    constructor(private http: HttpClient) { }

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
    getAllProfiles(): Observable<IProfileListResponse> {
        return this.http
            .get<IProfileListResponse>(`${this.PROFILE_BASE_URL}/`, {
                headers: this.getAuthHeaders()
            })
            .pipe(catchError(err => this.handleError(err)));
    };
    getSelfProfile(): Observable<IProfileSingleResponse> {
        return this.http
            .get<IProfileSingleResponse>(`${this.PROFILE_BASE_URL}/self`, {
                headers: this.getAuthHeaders()
            })
            .pipe(catchError(err => this.handleError(err)));
    };
    getOtherProfile(idUser: string): Observable<IProfileSingleResponse> {
        return this.http
            .get<IProfileSingleResponse>(`${this.PROFILE_BASE_URL}/${idUser}`, {
                headers: this.getAuthHeaders()
            })
            .pipe(catchError(err => this.handleError(err)));
    };
    updateProfile(formData: FormData): Observable<IProfileSingleResponse> {
        return this.http
            .put<IProfileSingleResponse>(
                `${this.PROFILE_BASE_URL}/self-update`,
                formData,
                { headers: this.getAuthHeaders() }
            );
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

};