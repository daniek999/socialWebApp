import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
    selector: 'navigationBar',
    standalone: true,
    imports: [
        NgIf,
        RouterLink,
        RouterLinkActive
    ],
    templateUrl: './nav-bar.component.html',
    styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {

    constructor(
        private _authService: AuthService,
        private router: Router
    ) { }

    //#region | VARIABLES   |
    isAdmin: boolean = false;
    //#endregion

    //#region | INIT        |
    ngOnInit(): void {
        this.isAdmin = this._authService.isAdmin();
    };
    //#endregion

    //#region | ACTIONS     |
    logout() {
        this._authService.logout();
        this.router.navigate(['/login']);
    };
    //#endregion

};