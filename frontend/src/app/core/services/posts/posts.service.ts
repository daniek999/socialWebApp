import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../../../models/post.model';


@Injectable({
    providedIn: 'root'
})
export class PostsService {

    private readonly post_url_base = 'http://localhost:4000/api/posts';

    constructor(private http: HttpClient) { }

    // 
    getPosts(): Observable<Post[]> {
        return this.http.get<Post[]>(`${this.post_url_base}/publications`);
    }

    // 
    createPost(post: any): Observable<any> {
        return this.http.post(`${this.post_url_base}/create`, post);
    }
}
