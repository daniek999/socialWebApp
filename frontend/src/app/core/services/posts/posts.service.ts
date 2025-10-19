import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../../../models/postModel/post';


@Injectable({
    providedIn: 'root'
})
export class PostsService {

    private readonly post_url_base = 'http://localhost:4000/api/posts';

    constructor(private http: HttpClient) { }

    // 
    getPosts(): Observable<Post[]> {
        const url = `${this.post_url_base}/publications`;
        return this.http.get<Post[]>(url);
    }

    // 
    createPost(post: any): Observable<any> {
        const url = `${this.post_url_base}/create`
        return this.http.post(url, post);
    }
}
