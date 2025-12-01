import { Component, OnInit } from '@angular/core';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { TopWebBarComponent } from '../../../shared/top-web-bar/top-web-bar.component';
import { BottomWebBarComponent } from '../../../shared/bottom-web-bar/bottom-web-bar.component';
import { NavBarComponent } from '../../../shared/nav-bar/nav-bar.component';
import { UserService } from '../../../core/services/user.service';
import { IBannedUser, ISuspendedUser, IUser } from '../../../models/user';

@Component({
    selector: 'app-user-management',
    standalone: true,
    imports: [
        NgClass, 
        DatePipe, 
        NgIf, 
        NgFor, 
        TopWebBarComponent, 
        BottomWebBarComponent, 
        NavBarComponent
    ],
    templateUrl: './user-management.component.html',
    styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {

    constructor(
        private _userService: UserService,
    ) { }

    //#region - [VARIABLES]
    // States
    successMessage: string = '';
    errorMessage: string = '';
    loadingUsers: boolean = false;
    // For Unique Users (GetById)
    userDataUnique: IUser | null = null;
    // For Active Users 
    usersData: IUser[] = [];
    usersCount: number = 0;
    // For Suspended Users 
    suspendedUsersData: ISuspendedUser[] = [];
    suspendedUsersCount: number = 0;
    // For Banned Users 
    bannedUsersData: IBannedUser[] = [];
    bannedUsersCount: number = 0;
    //#endregion

    //#region - [INIT - METHODS]
    ngOnInit(): void {
        this.loadUsers();
        this.loadSuspendedUsers();
        this.loadBannedUsers();
    };
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
    };
    loadSuspendedUsers(): void {
        // Its only a test must be modified later.
        this._userService.getSuspendedUsers().subscribe({
            next: (res) => {
                console.log(res.data);
                this.setSuspendedUsers(res.data);
            },
            error: (error) => {
                this.setError(error);
            }
        });
    };
    loadBannedUsers(): void {
        // Its only a test must be modified later.
        this._userService.getBannedUsers().subscribe({
            next: (res) => {
                console.log(res.data);
                this.setBannedUsers(res.data);
            },
            error: (error) => {
                this.setError(error);
            }
        });
    };
    //#endregion

    //#region - [ACTIONS - METHODS]
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
            case 'username':
                this.usersData.sort((a, b) => a.username.localeCompare(b.username));
                break;
        }
    };
    viewUser(user: IUser) {
        this._userService.getUserById(user._id!).subscribe({
            next: (res) => {
                this.setUser(res.data);
                this.setSuccess("Usuario cargado.");
            },
            error: (error) => this.setError(error),
        });
    };
    editUser(user: IUser) {
        console.log('Editar usuario (no implementado aún):', user);
    };
    deleteUser(user: IUser) {
        if (!confirm(`¿Eliminar a ${user.username}?`)) return;

        this._userService.deleteUser(user._id!).subscribe({
            next: () => {
                this.setSuccess(`Usuario "${user.username}" eliminado.`);
                this.loadUsers();
                console.log(user);
            },
            error: (error) => this.setError(error),
        });
    };
    deactivateUser(user: IUser) {
        this._userService.deactivateUser(user._id!).subscribe({
            next: () => {
                this.loadUsers();
                this.setSuccess(`Estado del usuario "${user.username}" cambiado.`);
            },
            error: (err) => {
                this.setError(err);
            }
        });
    };
    //#endregion

    //#region - [SETTERS]
    private setUser(user: IUser): void {
        this.userDataUnique = user;
    };
    private setUsers(users: IUser[]): void {
        this.usersData = users;
        this.usersCount = users.length;
    };
    private setSuspendedUsers(users: ISuspendedUser[]): void {
        this.suspendedUsersData = users;
        this.suspendedUsersCount = users.filter(s => s.status === "Activo").length;
    };
    private setBannedUsers(users: IBannedUser[]): void {
        this.bannedUsersData = users;
        this.bannedUsersCount = users.filter(s => s.status === "Activo").length;
    };
    private setSuccess(message: string): void {
        this.successMessage = message;
        setTimeout(() => this.successMessage = '', 3000);
    };
    private setError(message: string) {
        this.errorMessage = message;
        setTimeout(() => this.errorMessage = '', 5000);
    };
    //#endregion

};
