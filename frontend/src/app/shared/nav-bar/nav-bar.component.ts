import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'navigationBar',
  standalone: true,
  imports: [NgIf],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit{
    
    // [Params]
    isAdmin: boolean = false;

    constructor(
        private _authService: AuthService,
        private router: Router
    ) {}
    
    // [OnInit Functions]
    ngOnInit(): void {
        this.isAdmin = this._authService.isAdmin();
    };

    // [Auth Functions]
    logout() {
        this._authService.logout();
        this.router.navigate(['/login']);
    };

    // [Navigation Functions]
    goToProfile() {
        this.router.navigate(['/profile']);
    };
    goToHome() {
        this.router.navigate(['/home']);
    };
    goToConnections() {
        this.router.navigate(['/connections'])
    };
    goToCommunity() {
        this.router.navigate(['/list-profile'])
    };
    goToAdminPanel() {
        this.router.navigate(['/admin'])
    };
}
