import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'topAppBar',
  standalone: true,
  imports: [],
  templateUrl: './top-web-bar.component.html',
  styleUrl: './top-web-bar.component.css'
})
export class TopWebBarComponent implements OnInit {


    
    constructor(
        private _userService: UserService,
        private _authService: AuthService,
        private router: Router
    ) { }

    
    ngOnInit() {
        
    }
    verifyAdminRole() {
    }

    // [Auth Functions]
    logout() {
        this._authService.logout();
        this.router.navigate(['/login']);
    }

    // [Navigation Functions]
    goToProfile() {
        this.router.navigate(['/profile']);
    }
    goToHome() {
        this.router.navigate(['/home']);
    }
    goToCommunity() {
        this.router.navigate(['/list-profile'])
    }
    goToAdminPanel() {
        this.router.navigate(['/admin'])
    }
}
