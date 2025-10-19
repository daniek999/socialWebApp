import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { Profile } from '../../../models/profileModel/profile';

@Injectable({
    providedIn: 'root'
})
export class ProfilesService {

    private readonly profile_url_base = 'http://localhost:4000/api/profiles';

    constructor(
        private http: HttpClient
    ) { }

    // MARK: Fun. Extra
    // 1. Obtiene el bearer
    private getAuthHeaders() {
        const token = localStorage.getItem('token');
        if (!token) {
            return {};
        }
        return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
    }

    // MARK: Fun. Backend
    // 1. Obtener perfil de usuario autenticado
    getUserProfile(): Observable<Profile> {
        const url = `${this.profile_url_base}/myprofile`;

        return this.http.get<Profile>(url, this.getAuthHeaders());
    }

    // 2. Obtener todos los perfiles
    getAllProfiles(): Observable<Profile[]> {
        const url = `${this.profile_url_base}/profiles`;

        return this.http.get<Profile[]>(url, this.getAuthHeaders());
    }

    // 3. Crear perfil de usuario (Ocurre 1 vez)
    createProfile(): Observable<Profile> {
        const url = `${this.profile_url_base}/create`;

        return this.http.post<Profile>(url, {}, this.getAuthHeaders());
    }

    // 4. Actualizar perfil de usuario

    
}
