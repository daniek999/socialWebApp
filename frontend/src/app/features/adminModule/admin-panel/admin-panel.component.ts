import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { IUser } from '../../../models/user';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { TopWebBarComponent } from "../../../shared/top-web-bar/top-web-bar.component";

@Component({
    selector: 'app-admin-panel',
    standalone: true,
    imports: [NgClass, DatePipe, NgIf, NgFor, TopWebBarComponent],
    templateUrl: './admin-panel.component.html',
    styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent implements OnInit {

    constructor(
        private _userService: UserService,
    ) { }

    //#region [Variables]
    successMessage: string = '';
    errorMessage: string = '';
    loadingUsers: boolean = false;

    usersData: IUser[] = [];
    userDataUnique: IUser | null = null;
    usersCount: number = 0;
    //#endregion

    //#region [On Init Methods]
    ngOnInit(): void {
        this.loadUsers();
    }
    loadUsers(): void {
        this.loadingUsers = true;
        this._userService.getAllUsers().subscribe({
            next: (res) => {
                this.setUsers(res.data);
                this.loadingUsers = false;
            },
            error: (error) => {
                this.setError(error);
                this.loadingUsers = false;
            }
        });
    }
    //#endregion

    //#region [Function Methods]
    sortBy(type: string) {
        switch (type) {
            case 'recent':
                this.usersData.sort((a, b) =>
                    new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
                );
                break;
            case 'old':
                this.usersData.sort((a, b) =>
                    new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
                );
                break;
            case 'email':
                this.usersData.sort((a, b) => a.email.localeCompare(b.email));
                break;
        }
    }
    viewUser(user: IUser) {
        this._userService.getUserById(user._id!).subscribe({
            next: (res) => {
                this.setUser(res.data);
                this.setSuccess("Usuario cargado.");
                console.log(res.data)
            },
            error: (error) => this.setError(error),
        });
    }
    editUser(user: IUser) {
        console.log('Editar usuario (no implementado aún):', user);
    }
    deleteUser(user: IUser) {
        if (!confirm(`¿Eliminar a ${user.username}?`)) return;

        this._userService.deleteUser(user._id!).subscribe({
            next: () => {
                this.setSuccess(`Usuario "${user.username}" eliminado.`);
                this.loadUsers();
                console.log(`Usuario "${user.username}" eliminado.`)
                console.log(user);
            },
            error: (error) => this.setError(error),
        });
    }
    //#endregion

    //#region [Setting Data]
    private setUsers(users: IUser[]): void {
        this.usersData = users;
        this.usersCount = users.length;
    }
    private setUser(user: IUser): void {
        this.userDataUnique = user;
    }
    private setSuccess(message: string): void {
        this.successMessage = message;
        setTimeout(() => this.successMessage = '', 3000);
    }
    private setError(message: string) {
        this.errorMessage = message;
        setTimeout(() => this.errorMessage = '', 5000);
    }
    //#endregion
}
