import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../core/services/profile.service';
import { TopWebBarComponent } from "../../../shared/top-web-bar/top-web-bar.component";
import { BottomWebBarComponent } from "../../../shared/bottom-web-bar/bottom-web-bar.component";
import { IProfilePopulated } from '../../../models/profile';
import { environment } from '../../../../environments/environment.development';

@Component({
    selector: 'app-profile-edit',
    standalone: true,
    imports: [
        CommonModule, 
        FormsModule, 
        TopWebBarComponent, 
        BottomWebBarComponent
    ],
    templateUrl: './profile-edit.component.html',
    styleUrl: './profile-edit.component.css'
})
export class ProfileEditComponent implements OnInit {

    constructor(
        private router: Router,
        private profileService: ProfileService,
    ) { }

    //#region | VARIABLES   |
    profile: IProfilePopulated | null = null;
    editForm = {
        name: '',
        surname: '',
        profession: '',
        situation: 'Estudiante',
        description: '',
        about: '',
        skills: '' as string,        // será string separado por comas
        interests: '' as string,     // será string separado por comas
        birthday: '',
        visible: false
    };
    loading = true;
    successMessage = '';
    errorMessage = '';
    selectedPhoto: File | null = null;
    selectedCV: File | null = null;
    situationOptions = [
        'Estudiante',
        'Buscando',
        'Practicante',
        'Empleado'
    ];
    //#endregion

    //#region | INIT        |
    ngOnInit(): void {
        this.loadProfile();
    };
    loadProfile() {
        this.profileService.getSelfProfile().subscribe({
            next: (response) => {
                this.profile = response.data;

                let birthdayFixed = '';
                if (response.data.birthday) {
                    const date = new Date(response.data.birthday);
                    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
                    birthdayFixed = date.toISOString().substring(0, 10);
                }

                this.editForm = {
                    name: response.data.name || '',
                    surname: response.data.surname || '',
                    profession: response.data.profession || '',
                    situation: response.data.situation || 'Estudiante',
                    description: response.data.description || '',
                    about: response.data.about || '',
                    skills: (response.data.skills || []).join(', '),
                    interests: (response.data.interests || []).join(', '),

                    // ✔ Aquí aplicas la fecha corregida
                    birthday: birthdayFixed,

                    visible: response.data.visible
                };

                this.loading = false;
            },
            error: (err) => {
                this.errorMessage = 'Error: ' + err;
                this.loading = false;
            }
        });
    };
    //#endregion

    //#region | ACTIONS     |
    onUpdateProfile() {
        this.setLoading(true);

        const formData = new FormData();

        formData.append('name', this.editForm.name);
        formData.append('surname', this.editForm.surname);
        formData.append('profession', this.editForm.profession);
        formData.append('situation', this.editForm.situation);
        formData.append('description', this.editForm.description);
        formData.append('about', this.editForm.about);
        formData.append('visible', this.editForm.visible.toString());

        const birthday = new Date(this.editForm.birthday);
        birthday.setMinutes(birthday.getMinutes() + birthday.getTimezoneOffset());
        formData.append('birthday', birthday.toISOString());

        formData.append('skills', this.editForm.skills);
        formData.append('interests', this.editForm.interests);

        if (this.selectedPhoto) formData.append('photo', this.selectedPhoto);
        if (this.selectedCV) formData.append('curriculumvitae', this.selectedCV);

        this.profileService.updateProfile(formData).subscribe({
            next: (response) => {
                this.setProfile(response.data);
                this.setSuccess('Perfil actualizado correctamente');
                this.setLoading(false);
            },
            error: (err) => {
                this.setError(err.error?.message || 'Error al actualizar el perfil');
                this.setLoading(false);
                console.error('Error al actualizar perfil:', err);
            }
        });
    };
    //#endregion

    //#region | GETTERS     |
    getPhotoUrl(): string {
        return this.profile?.photo
            ? this.profile.photo
            : 'assets/img/default_user_photo.png';
    };
    getCVUrl(): string | null {
        return this.profile?.curriculumvitae || null;
    };
    hasPhoto(): boolean {
        return !!this.profile?.photo;
    };
    hasCV(): boolean {
        return !!this.profile?.curriculumvitae;
    };
    getUsername(): string {
        return this.profile?.idUser?.username || 'Usuario';
    };
    //#endregion

    //#region | SETTERS     |
    private setProfile(profile: IProfilePopulated): void {
        this.profile = profile;
    };
    private setEditFormFromProfile(profile: IProfilePopulated): void {
        this.editForm = {
            name: profile.name || '',
            surname: profile.surname || '',
            profession: profile.profession || '',
            situation: profile.situation || 'Estudiante',
            description: profile.description || '',
            about: profile.about || '',
            skills: (profile.skills || []).join(', '),
            interests: (profile.interests || []).join(', '),
            birthday: profile.birthday ? profile.birthday.substring(0, 10) : '',
            visible: profile.visible
        };
    };
    private setSuccess(message: string): void {
        this.successMessage = message;
        setTimeout(() => this.successMessage = '', 3000);
    };
    private setError(message: string): void {
        this.errorMessage = message;
        setTimeout(() => this.errorMessage = '', 3000);
    };
    private setSelectedPhoto(file: File | null): void {
        this.selectedPhoto = file;
    };
    private setSelectedCV(file: File | null): void {
        this.selectedCV = file;
    };
    private setLoading(state: boolean): void {
    this.loading = state;
    };
    //#endregion

    //#region | HELPERS     |
    onPhotoSelected(event: any) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.errorMessage = 'Por favor selecciona una imagen válida';
            this.selectedPhoto = null;
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            this.errorMessage = `La imagen supera el límite de 2MB`;
            this.selectedPhoto = null;
            return;
        }
        this.selectedPhoto = file;
        this.errorMessage = '';
    };
    onCVSelected(event: any) {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            this.errorMessage = 'Por favor selecciona un archivo PDF';
            this.selectedCV = null;
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            this.errorMessage = `El PDF supera el límite de 2MB`;
            this.selectedCV = null;
            return;
        }

        this.selectedCV = file;
        this.errorMessage = '';
    };
    //#endregion

    //#region | NAVIGATION  |
    goToProfile() {
        this.router.navigate(['/profile']);
    };
    //#endregion

};