import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ReactiveFormsModule, 
        CommonModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

    constructor(
        private fb: FormBuilder,
        private auth: AuthService,
        private router: Router,
        private actRoute: ActivatedRoute
    ) { }

    //#region | VARIABLES   |
    errorMsg: string | null = null;
    successMsg: string | null = null;
    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
    });
    //#endregion

    //#region | INIT        |
    ngOnInit() {
        this.actRoute.queryParams.subscribe(params => {
            if (params['verified'] === 'true') {
                this.successMsg = 'Cuenta verificada. Ya puedes iniciar sesión.';
            }
        });
    };
    //#endregion

    //#region | ACTIONS     |
    onSubmit() {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }
        this.errorMsg = null;
        this.auth.login(this.loginForm.value).subscribe({
            next: (res) => 
                {
                this.auth.setToken(res.token);
                this.router.navigate(['/home']);
            },
            error: (err) => 
                this.onError(err.error?.message || 'Error')
        });
    };
    onError(message: string) {
        this.errorMsg = message
    };
    //#endregion

    //#region | NAVIGATION  |
    toRegister() {
        this.router.navigate(['/register'])
    };
    //#endregion

};