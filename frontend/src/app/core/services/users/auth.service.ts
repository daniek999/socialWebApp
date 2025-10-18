import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http : HttpClient) { }

    private user_url_base = 'http://localhost:4000/api/users';


    register(data: any): Observable<any> {
        return this.http.post(`${this.user_url_base}/register`, data);
    }

    login(data: any): Observable<any> {
        return this.http.post(`${this.user_url_base}/login`, data);
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

    getUsername(): string | null {
        const data = this.getUserData();
        return data?.username || null; // depende de cómo tu backend lo mande
    }

}
