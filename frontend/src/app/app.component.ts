import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './features/authModule/login/login.component';
import { RegisterComponent } from './features/authModule/register/register.component';
import { HomeComponent } from './features/mainModule/home/home.component';
import { PostCreateComponent } from './features/postModule/post-create/post-create.component';
import { PostUpdateComponent } from './features/postModule/post-update/post-update.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'frontend';
}
