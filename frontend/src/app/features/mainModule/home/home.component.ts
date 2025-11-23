import { Component, OnInit } from '@angular/core';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { PostService } from '../../../core/services/post.service';
import { TopWebBarComponent } from "../../../shared/top-web-bar/top-web-bar.component";
import { Post } from '../../../models/post';
import { BottomWebBarComponent } from "../../../shared/bottom-web-bar/bottom-web-bar.component";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [DatePipe, NgFor, NgIf, TopWebBarComponent, BottomWebBarComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

    posts: Post[] = [];
    username: string = '';
    errorMessage: string = '';
    successMessage: string = '';

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