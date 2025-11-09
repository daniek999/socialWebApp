import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Profile } from '../../../models/profileModel/profile';
import { ProfileService } from '../../../core/services/profile.service';
import { TopWebBarComponent } from "../../../shared/top-web-bar/top-web-bar.component";
import { BottomWebBarComponent } from "../../../shared/bottom-web-bar/bottom-web-bar.component";

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
    profile: Profile = {
        idUser: { _id: '', username: '', email: '', role: '', isVerified: false },
        name: '',
        surname: '',
        profession: '',
        interests: [],
        hobbies: [],
        visible: false,
        photo: '',
        curriculumvitae: ''
    };
    // Estados de proceso
    loading = true;
    successMessage = '';
    errorMessage = '';
    // Archivos seleccionados
    selectedPhoto: File | null = null;
    selectedCV: File | null = null;

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
                this.loading = false;
            },
            error: (err) => {
                this.errorMessage = 'Error: ' + err;
                this.loading = false;
            }
        });
    }
    onUpdateProfile() {
        // Process params
        this.loading = true;
        this.errorMessage = '';
        this.successMessage = '';

        // Catch the form data from the 'Front'
        const formData = new FormData();
        formData.append('name', this.profile.name);
        formData.append('surname', this.profile.surname);
        formData.append('profession', this.profile.profession);
        formData.append('visible', this.profile.visible.toString());
        formData.append('interests', (this.profile.interests || []).join(','));
        formData.append('hobbies', (this.profile.hobbies || []).join(','));
        if (this.selectedPhoto) {
            formData.append('photo', this.selectedPhoto);
        }
        if (this.selectedCV) {
            formData.append('curriculumvitae', this.selectedCV);
        }

        // Send to data to the 'Backend'
        this.profileService.updateProfile(formData).subscribe({
            next: (res) => {
                this.successMessage = 'Perfil actualizado correctamente';
                this.loading = false;
            },
            error: (err) => {
                this.errorMessage = err.error?.message || 'Error al actualizar el perfil.';
                this.loading = false;
                console.error('Error al actualizar perfil:', err);
            }
        });
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
    // MARK: [Helper Functions]
    ============================ */
    updateInterests(value: string) {
        this.profile.interests = value.split(',').map(i => i.trim());
    }
    updateHobbies(value: string) {
        this.profile.hobbies = value.split(',').map(i => i.trim());
    }

    /* ============================
    // MARK: [ Nav. Functions]
    ============================ */
    goToProfile() {
        this.router.navigate(['/profile']);
    }

}
