    import { HttpClient } from '@angular/common/http';
    import { Injectable } from '@angular/core';
    import { Router } from '@angular/router';
    import { jwtDecode } from 'jwt-decode';
    import { Observable } from 'rxjs';

    @Injectable({
        providedIn: 'root'
    })
    export class AuthService {

        private readonly AUTH_BASE_URL = 'http://localhost:4000/api/auth';

        constructor(
            private http: HttpClient,
            private router: Router
        ) { }

        // NOTA: AGREGAR MANEJADOR DE ERRORES PARA QUE NO SE VEA FEO EL CONSOLE.LOG

        /** * MARK: [Handlers]
            * 
        */
        register(data: any): Observable<any> {
            return this.http.post(`${this.AUTH_BASE_URL}/register`, data);
        };
        login(data: any): Observable<any> {
            return this.http.post(`${this.AUTH_BASE_URL}/login`, data);
        };
        logout() {
            localStorage.removeItem('token');
        };

        /** * MARK: [Extras]
            * 
        */
        setToken(token: string) {
            localStorage.setItem('token', token);
        };
        getToken() {
            return localStorage.getItem('token');
        };
        isLogged() {
            return !!this.getToken();
        };
        getUserRole(): string | null {
            const token = this.getToken();
            if (!token) return null;

            try {
                const decoded: any = jwtDecode(token);
                return decoded.role || null;
            } catch (err) {
                return null;
            }
        }
        isAdmin(): boolean {
            return this.getUserRole() === 'admin';
        }
    }
