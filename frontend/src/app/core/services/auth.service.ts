import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http : HttpClient) { }

    private base = 'http://localhost:4000/api/auth';


    register(data: any): Observable<any> {
        return this.http.post(`${this.base}/register`, data);
    }

    login(data: any): Observable<any> {
        return this.http.post(`${this.base}/login`, data);
    }

    setToken(token: string) {
        localStorage.setItem('token', token);
    }

    getToken() {
        return localStorage.getItem('token');
    }

    logout() {
        localStorage.removeItem('token');
    }

    isLogged() {
        return !!this.getToken();
    }

    // 👉 NUEVO: obtener datos del usuario desde el token
    getUserData(): any | null {
        const token = this.getToken();
        if (!token) return null;

        try {
            return jwtDecode<any>(token);
        } catch (e) {
            console.error('Error decodificando token:', e);
            return null;
        }
    }

    // 👉 NUEVO: obtener solo el username
    getUsername(): string | null {
        const data = this.getUserData();
        return data?.username || null; // depende de cómo tu backend lo mande
    }

}
