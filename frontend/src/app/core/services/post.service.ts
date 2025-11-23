import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../../models/post';

@Injectable({
    providedIn: 'root'
})
export class PostService {

    private readonly POST_BASE_URL = 'http://localhost:4000/api/posts';

    constructor(
        private http: HttpClient
    ) { }

    /** * MARK: [Helpers]
        * 
        * 1. Used to get the token to bring authorization.
    */
    private getAuthHeaders() {
        const token = localStorage.getItem('token');
        if (!token) {
            return {};
        }
        return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
    };

    /** * MARK: [Handlers]
        * 
    */
    getPosts(): Observable<Post[]> {
        const url = `${this.POST_BASE_URL}/publications`;
        return this.http.get<Post[]>(url, this.getAuthHeaders());
    };
    createPost(post: any): Observable<any> {
        const url = `${this.POST_BASE_URL}/create-post`
        return this.http.post(url, post);
    };

}
