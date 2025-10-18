import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/users/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

    constructor(
        private fb: FormBuilder,
        private auth: AuthService,
        private router: Router,
    ) { }

    // 1. Vars
    errorMessage: string | null = null;
    
    // 2. Def. login form with its validations
    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
    });

    // 3. Comp. Functions
    onSubmit() {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }
        this.errorMessage = null;
        this.auth.login(this.loginForm.value).subscribe({
            next: (res) => 
                {
                this.auth.setToken(res.token);
                this.router.navigate(['/home']);
            },
            error: (err) => 
                this.onError(err.error?.message || 'Error')
        });
    }

    onError(message: string) {
        this.errorMessage = message
    }

    toRegister() {
        this.router.navigate(['/register'])
    }

}
