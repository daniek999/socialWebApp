import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../core/services/profile.service';
import { TopWebBarComponent } from "../../../shared/top-web-bar/top-web-bar.component";
import { BottomWebBarComponent } from "../../../shared/bottom-web-bar/bottom-web-bar.component";
import { IProfilePopulated } from '../../../models/profile';

@Component({
    selector: 'app-profile-edit',
    standalone: true,
    imports: [CommonModule, FormsModule, TopWebBarComponent, BottomWebBarComponent],
    templateUrl: './profile-edit.component.html',
    styleUrl: './profile-edit.component.css'
})
export class ProfileEditComponent implements OnInit {

    constructor(
        private router: Router,
        private profileService: ProfileService,
    ) { }

    /* ============================
    // MARK: [Params]
    ============================ */
    profile: IProfilePopulated | null = null;
    // Form data editable
    editForm = {
        name: '',
        surname: '',
        profession: '',
        employmentStatus: 'Estudiante' as 'Estudiante' | 'Buscando' | 'Practicante' | 'Empleado',
        about: '',
        visible: false
    };
    // Estados de proceso
    loading = true;
    successMessage = '';
    errorMessage = '';
    // Archivos seleccionados
    selectedPhoto: File | null = null;
    selectedCV: File | null = null;
    // Opciones para el select
    employmentStatusOptions: Array<'Estudiante' | 'Buscando' | 'Practicante' | 'Empleado'> = [
        'Estudiante',
        'Buscando',
        'Practicante',
        'Empleado'
    ];

    /* ============================
    // MARK: [Component Functions]
    ============================ */
    ngOnInit(): void {
        this.loadProfile()
    }
    loadProfile() {
        this.profileService.getSelfProfile().subscribe({
            next: (res) => {
                this.profile = res;

                this.editForm = {
                    name: res.name || '',
                    surname: res.surname || '',
                    profession: res.profession || '',
                    employmentStatus: res.employmentStatus || 'Estudiante',
                    about: res.about || '',
                    visible: res.visible
                };
                this.loading = false;
            },
            error: (err) => {
                this.errorMessage = 'Error: ' + err;
                this.loading = false;
            }
        });
    }
    onUpdateProfile() {
        // Basic Validations
        // if (!this.editForm.name?.trim()) {
        //     this.errorMessage = 'El nombre es obligatorio';
        //     return;
        // }

        // Preparing formData
        const formData = new FormData();
        formData.append('name', this.editForm.name);
        formData.append('surname', this.editForm.surname);
        formData.append('profession', this.editForm.profession);
        formData.append('employmentStatus', this.editForm.employmentStatus);
        formData.append('about', this.editForm.about);
        formData.append('visible', this.editForm.visible.toString());

        // Add files if they were selected
        if (this.selectedPhoto) {
            formData.append('photo', this.selectedPhoto);
        }
        if (this.selectedCV) {
            formData.append('curriculumvitae', this.selectedCV);
        }

        // Send to backend
        this.profileService.updateProfile(formData).subscribe({
            next: (res) => {
                this.profile = res;
                this.successMessage = 'Perfil actualizado correctamente';
                this.loading = false;
                setTimeout(() => {
                    this.successMessage = '';
                }, 3000);
            },
            error: (err) => {
                this.errorMessage = err.error?.message || 'Error al actualizar el perfil';
                this.loading = false;
                console.error('Error al actualizar perfil:', err);
            }
        });
    }


    // [Getters]
    getPhotoUrl(): string {
        if (this.profile?.photo) {
            return `http://localhost:4000${this.profile.photo}`;
        }
        return 'assets/img/default_user_photo.png';
    }
    getCVUrl(): string | null {
        if (this.profile?.curriculumvitae) {
            return `http://localhost:4000${this.profile.curriculumvitae}`;
        }
        return null;
    }
    hasPhoto(): boolean {
        return !!this.profile?.photo;
    }
    hasCV(): boolean {
        return !!this.profile?.curriculumvitae;
    }
    getUsername(): string {
        return this.profile?.idUser?.username || 'Usuario';
    }


    /* ============================
    // MARK: [File Handlers]
    ============================ */
    onPhotoSelected(event: any) {
        const file = event.target.files[0];
        if (!file) return;

        // Validación básica frontend (UX)
        if (!file.type.startsWith('image/')) {
            this.errorMessage = 'Por favor selecciona una imagen válida';
            this.selectedPhoto = null;
            return;
        }

        // Info visual del tamaño (sin bloquear)
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        if (file.size > 2 * 1024 * 1024) {
            this.errorMessage = `La imagen pesa ${sizeMB}MB. El límite es 2MB.`;
            this.selectedPhoto = null;
            return;
        }

        this.selectedPhoto = file;
        this.errorMessage = '';
    }
    onCVSelected(event: any) {
        const file = event.target.files[0];
        if (!file) return;

        // Validación básica frontend (UX)
        if (file.type !== 'application/pdf') {
            this.errorMessage = 'Por favor selecciona un archivo PDF';
            this.selectedCV = null;
            return;
        }

        // Info visual del tamaño (sin bloquear)
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        if (file.size > 2 * 1024 * 1024) {
            this.errorMessage = `El PDF pesa ${sizeMB}MB. El límite es 2MB.`;
            this.selectedCV = null;
            return;
        }

        this.selectedCV = file;
        this.errorMessage = '';
    }


    /* ============================
    // MARK: [ Nav. Functions]
    ============================ */
    goToProfile() {
        this.router.navigate(['/profile']);
    }
}
