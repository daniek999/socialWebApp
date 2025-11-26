import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-TopBar',
  standalone: true,
  imports: [],
  templateUrl: './top-web-bar.component.html',
  styleUrl: './top-web-bar.component.css'
})
export class TopWebBarComponent {

    constructor(
        private _userService: UserService,
        private _authService: AuthService,
        private router: Router
    ) { }

    // [Auth Functions]
    logout() {
        this._authService.logout();
        this.router.navigate(['/login']);
    }

}
