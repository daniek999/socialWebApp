import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Post {
    _id: string;
    idUser: {
        _id: string;
        username: string;
    };
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}


@Injectable({
    providedIn: 'root'
})
export class PostsService {

    private API_URL = 'http://localhost:4000/api/posts';

    constructor(private http: HttpClient) { }

    getPosts(): Observable<Post[]> {
        return this.http.get<Post[]>(this.API_URL);
    }

    createPost(post: any): Observable<any> {
        return this.http.post(this.API_URL, post);
    }
}
