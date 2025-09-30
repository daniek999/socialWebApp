import { Component, OnInit } from '@angular/core';
import { PostsService } from '../../../core/services/posts/posts.service';

@Component({
    selector: 'app-post-create',
    standalone: true,
    imports: [],
    templateUrl: './post-create.component.html',
    styleUrl: './post-create.component.css'
})
export class PostCreateComponent implements OnInit {
    posts: any[] = [];

    constructor(private postService: PostsService) { }

    ngOnInit() {
        this.postService.getPosts().subscribe(data => {
            this.posts = data;
        });
    }
}
