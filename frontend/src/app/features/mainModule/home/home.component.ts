import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Post } from '../../../models/postModel/post';
import { PostService } from '../../../core/services/post.service';
import { TopWebBarComponent } from "../../../shared/top-web-bar/top-web-bar.component";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [DatePipe, NgFor, NgIf, TopWebBarComponent, NgClass],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

    posts: Post[] = [];
    username: string = '';
    errorMessage: string | null = null;

    constructor(
        private postService: PostService,
    ) { }

    /* ============================
    // MARK: [Component Functions]
    ============================ */
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

    // [Setting Data]
    private setError(message: string) {
        this.errorMessage = message; 
    }

}