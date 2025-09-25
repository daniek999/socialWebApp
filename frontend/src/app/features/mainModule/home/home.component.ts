import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
    
    constructor(
        private auth: AuthService,
        private router: Router,
    ) {}
    
    // 1. Component Variables
    username: string | null = null;


    ngOnInit() {
        this.username = this.auth.getUsername();
    }
    logout() {
        this.auth.logout();
        this.router.navigate(['/login']);
    }

}
