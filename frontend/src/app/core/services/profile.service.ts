import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Profile } from '../../models/profileModel/profile';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    private readonly BASE_URL = 'http://localhost:4000/api/profiles';
    private readonly API_URL = 'http://localhost:4000';

    constructor(private http: HttpClient) { }

    /* ============================
    // MARK: [Extras]
    ============================ */
    // Genera cabeceras con token de autorización
    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
        });
    }
    // Manejo centralizado de errores HTTP
    private handleError(error: any) {
        console.error('Error en ProfilesService:', error);
        return throwError(() => error.error?.message || 'Error desconocido del servidor.');
    }

    /* ============================
    // MARK: [Functions]
    ============================ */
    // Obtener todos los perfiles visibles
    getAllProfiles(): Observable<Profile[]> {
        return this.http
            .get<Profile[]>(`${this.BASE_URL}/`, { headers: this.getAuthHeaders() })
            .pipe(catchError(this.handleError));
    }
    // Obtener perfil propio
    getSelfProfile(): Observable<Profile> {
        return this.http
            .get<Profile>(`${this.BASE_URL}/self`, { headers: this.getAuthHeaders() })
            .pipe(catchError(this.handleError));
    }
    // Obtener perfil de otro usuario
    getOtherProfiles(idUser: string): Observable<Profile> {
        return this.http
            .get<Profile>(`${this.BASE_URL}/${idUser}`, { headers: this.getAuthHeaders() })
            .pipe(catchError(this.handleError));
    }
    // Actualizar perfil propio
    updateProfile(formData: FormData): Observable<Profile> {
        const token = localStorage.getItem('token');
        // NO agregues Content-Type, se agrega automáticamente para multipart
        const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
        });

        return this.http.put<Profile>(`${this.BASE_URL}/self-update`, formData, {
        headers: headers
        });
    }
    // Obtener URL completa de la foto
    getPhotoUrl(photoPath: string): string {
        if (photoPath && photoPath.startsWith('/uploads')) {
        return `${this.API_URL}${photoPath}`;
        }
        return photoPath || 'assets/img/default_user_photo.png';
    }
    // Obtener URL completa del CV
    getCVUrl(cvPath: string): string | null {
        if (cvPath && cvPath.startsWith('/uploads')) {
        return `${this.API_URL}${cvPath}`;
        }
        return null;
    }

}
