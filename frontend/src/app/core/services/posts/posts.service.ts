import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../../../models/postModel/post';


@Injectable({
    providedIn: 'root'
})
export class PostsService {

    private readonly post_url_base = 'http://localhost:4000/api/posts';

    constructor(
        private http: HttpClient
    ) { }

    // MARK: Fun. Extra
    // 1. Obtiene el bearer
    private getAuthHeaders() {
        const token = localStorage.getItem('token');
        if (!token) {
            return {};
        }
        return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
    }

    // 
    getPosts(): Observable<Post[]> {
        const url = `${this.post_url_base}/publications`;
        return this.http.get<Post[]>(url, this.getAuthHeaders());
    }

    // 
    createPost(post: any): Observable<any> {
        const url = `${this.post_url_base}/create-post`
        return this.http.post(url, post);
    }
}
