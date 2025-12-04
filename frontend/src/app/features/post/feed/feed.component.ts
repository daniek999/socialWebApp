import { Component, OnInit } from '@angular/core';
import { PostService } from '../../../core/services/post.service';
import { TopWebBarComponent } from "../../../shared/top-web-bar/top-web-bar.component";
import { Post } from '../../../models/post';
import { BottomWebBarComponent } from "../../../shared/bottom-web-bar/bottom-web-bar.component";
import { NavBarComponent } from "../../../shared/nav-bar/nav-bar.component";
import { ViewTitleComponent } from "../../../shared/view-title/view-title.component";

@Component({
    selector: 'app-feed',
    standalone: true,
    imports: [
        TopWebBarComponent,
        BottomWebBarComponent,
        NavBarComponent,
        ViewTitleComponent
    ],
    templateUrl: './feed.component.html',
    styleUrl: './feed.component.css'
})
export class FeedComponent implements OnInit {

    constructor(
        private postService: PostService,
    ) { }

    //#region | VARIABLES   |
    posts: Post[] = [];
    username: string = '';
    errorMessage: string = '';
    successMessage: string = '';
    //#endregion

    //#region | INIT        |
    ngOnInit() {
        this.loadPosts()
    };
    loadPosts() {
        this.postService.getPosts().subscribe({
            next: (data) => {
                this.posts = data;
            },
            error: (err) => {
                this.setError(err.error?.message);
            }
        });
    };
    //#endregion

    //#region | SETTERS     |
    private setError(message: string) {
        this.errorMessage = message;
    };
    //#endregion

};