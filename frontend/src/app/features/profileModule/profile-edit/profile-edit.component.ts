import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfilesService } from '../../../core/services/profiles/profiles.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Profile } from '../../../models/profileModel/profile';

@Component({
    selector: 'app-profile-edit',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './profile-edit.component.html',
    styleUrl: './profile-edit.component.css'
})
export class ProfileEditComponent implements OnInit {

    constructor(
        private router: Router,
        private profileService: ProfilesService,
    ) { }

    // Params
    profile: Profile = new Profile({ _id: '', username: '' }, '', '', '', [], [], false);
    loading = true;
    successMsg = '';
    errorMsg = '';

    // OnInit Fun
    ngOnInit(): void {
        this.profileService.getUserProfile().subscribe({
        next: (res) => {
            this.profile = res;
            this.loading = false;
        },
        error: (err) => {
            console.error('Error al obtener perfil:', err);
            this.errorMsg = 'Error al cargar el perfil';
            this.loading = false;
        }
        });
    }

    // Component Funs
    onUpdateProfile() {
        const updatedData = {
            name: this.profile.name,
            surname: this.profile.surname,
            profession: this.profile.profession,
            interests: this.profile.interests?.length ? this.profile.interests : [],
            hobbies: this.profile.hobbies?.length ? this.profile.hobbies : [],
            visible: this.profile.visible,
        };

        this.profileService.putUserProfile(updatedData).subscribe({
        next: (res) => {
            // Mensaje de Exito
            this.successMsg = 'Perfil actualizado correctamente';
            // Eliminar a posterior el console.log
            console.log('Perfil actualizado:', res);
            // Controla un tiempo de Respuesta.
            setTimeout(() => this.goToProfile(), 1200);
        },
        error: (err) => {
            // Mensaje de Error
            this.errorMsg = 'Error al actualizar el perfil.';
            console.error('Error al actualizar perfil:', err);
        }
        });
    }
    updateInterests(value: string) {
        this.profile.interests = value.split(',').map(i => i.trim());
    }
    updateHobbies(value: string) {
        this.profile.hobbies = value.split(',').map(i => i.trim());
    }


    // Navigation Funs
    goToProfile() {
        this.router.navigate(['/profile']);
    }

}
