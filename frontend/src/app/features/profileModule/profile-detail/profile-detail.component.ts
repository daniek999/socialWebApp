import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-detail',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './profile-detail.component.html',
  styleUrl: './profile-detail.component.css'
})
export class ProfileDetailComponent implements OnInit {
    
    userImage: string | null = null;
    userHandle: string = '';
    userDescription: string = '';

    constructor(
        private http: HttpClient,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.loadRandomPerson();
    }

    loadRandomPerson() {
        this.http.get<any>('https://randomuser.me/api/')
            .subscribe(
                res => {
                    const user = res.results[0];
                    this.userImage = user.picture.large;
                    this.userHandle = user.login.username;
                    this.userDescription = `${user.name.first} ${user.name.last}`;
                },
                err => console.error('Error al cargar persona aleatoria', err)
            );
    }

    onImageChange(event: any) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => this.userImage = e.target.result;
            reader.readAsDataURL(file);
        }
    }

    onSubmit() {
        console.log('Usuario:', this.userHandle);
        console.log('Descripción:', this.userDescription);
        console.log('Imagen:', this.userImage);
        alert('¡Perfil actualizado con éxito');
    }

    toHome() {
        this.router.navigate(['/home']);
    }
}
