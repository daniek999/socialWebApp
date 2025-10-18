import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/users/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

    constructor(
        private fb: FormBuilder,
        private auth: AuthService,
        private router: Router,
    ) { }

    // 1. req. Data
    form = this.fb.group({
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required]
    });

    // 2. onSubmit Button
    submit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        // Validar que coincidan las contraseñas
        if (this.form.value.password !== this.form.value.confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        this.auth.register(this.form.value).subscribe({
            next: (res) => {
                alert('Registro exitoso');
                this.router.navigate(['/login']);
            },
            error: (err) => alert(err.error?.message || 'Error en el registro')
        });
    }

    toLogin() {
        this.router.navigate(['/login'])
    }

}
