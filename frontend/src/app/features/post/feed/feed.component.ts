import { Component, OnInit } from '@angular/core';
import { PostService } from '../../../core/services/post.service';
import { TopWebBarComponent } from "../../../shared/top-web-bar/top-web-bar.component";
import { Post } from '../../../models/post';
import { BottomWebBarComponent } from "../../../shared/bottom-web-bar/bottom-web-bar.component";
import { NavBarComponent } from "../../../shared/nav-bar/nav-bar.component";


@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [TopWebBarComponent, BottomWebBarComponent, NavBarComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent implements OnInit {

    posts: Post[] = [];
    username: string = '';
    errorMessage: string = '';
    successMessage: string = '';

    constructor(
        private postService: PostService,
    ) { }

    /* ============================
    // MARK: [FUNCTIONS]
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

    /* ============================
    // MARK: [SETTERS]
    ============================ */
    private setError(message: string) {
        this.errorMessage = message; 
    }

}
