import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/users/auth.service';
import { Router } from '@angular/router';
import { PostsService } from '../../../core/services/posts/posts.service';
import { DatePipe, NgFor } from '@angular/common';
import { Post } from '../../../models/postModel/post';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DatePipe, NgFor],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
    
    posts: Post[] = [];

    constructor(
        private auth: AuthService,
        private router: Router,
        private postService: PostsService
    ) {}
    
    // Load Main Data
    ngOnInit() {
        this.postService.getPosts()
            .subscribe(
            {
                next: (data) => this.posts = data,
                error: (err) => console.error(err)
            }
        );
    }
    // User Actions
    logout() {
        this.auth.logout();
        this.router.navigate(['/login']);
    }
    viewProfile() {
        this.router.navigate(['/profile']);
    }


}
