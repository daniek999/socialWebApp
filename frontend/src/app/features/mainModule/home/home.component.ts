import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/users/auth.service';
import { Router } from '@angular/router';
import { PostsService } from '../../../core/services/posts/posts.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Post } from '../../../models/postModel/post';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [DatePipe, NgFor, NgIf],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

    posts: Post[] = [];
    username: string = '';
    errorMessage: string | null = null;

    constructor(
        private auth: AuthService,
        private router: Router,
        private postService: PostsService,
    ) { }

    // Added Functions
    ngOnInit() {
        this.loadPosts()
    }
    loadPosts() {
        this.postService.getPosts().subscribe({
            next: (data) => {
                this.posts = data;
            },
            error: (err) => {
                this.setError(err.error?.message);
            }
        });
    }
    logout() {
        this.auth.logout();
        this.router.navigate(['/login']);
    }

    // Navigation Functions
    goToProfile() {
        this.router.navigate(['/profile']);
    }
    goToHome() {
        this.router.navigate(['/home']);
    }
    goToCommunity() {
        this.router.navigate(['/list-profile'])
    }

    // CUANDO DE A AGREGAR COMENTARIO, TIENE QUE RECARGAR LA PAGINA.

    // Set Visual Functions
    private setError(message: string) {
        this.errorMessage = message; 
    }

}