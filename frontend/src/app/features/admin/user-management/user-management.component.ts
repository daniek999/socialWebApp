import { Component, OnInit } from '@angular/core';
import { DatePipe, NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TopWebBarComponent } from '../../../shared/top-web-bar/top-web-bar.component';
import { BottomWebBarComponent } from '../../../shared/bottom-web-bar/bottom-web-bar.component';
import { NavBarComponent } from '../../../shared/nav-bar/nav-bar.component';
import { UserService } from '../../../core/services/user.service';
import { IBannedUser, ISuspendedUser, IUser } from '../../../models/user';
import { ViewTitleComponent } from "../../../shared/view-title/view-title.component";

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
        NavBarComponent,
        FormsModule,
        NgSwitch,
        NgSwitchCase,
        ViewTitleComponent
    ],
    templateUrl: './user-management.component.html',
    styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {

    constructor(
        private _userService: UserService,
    ) { }

    //#region | VARIABLES   |
    // Forms
    suspendUserForm = { suspendedTime: 1, reason: '' };
    revokeSuspendForm = { reason: '' };
    banUserForm = { reason: '' };
    revokeBanForm = { reason: '' };

    // Selected users
    selectedUserToSuspend: IUser | null = null;
    selectedUserToRevokeSuspend: IUser | null = null;
    selectedUserToBan: IUser | null = null;
    selectedUserToRevokeBan: IUser | null = null;

    // Filters & sorting
    selectedSort: string = 'old';
    selectedFilter: 'all' | 'suspended' | 'banned' = 'all';

    // Messages
    successMessage = '';
    errorMessage = '';

    // Unique User Data
    userDataUnique: IUser | null = null;

    // Statistics
    generalUsersCount = 0;
    activeUsersCount = 0;
    suspendedUsersCount = 0;
    bannedUsersCount = 0;

    // General/Active Users Data 
    loadingUsers = false;
    usersData: IUser[] = [];

    // Suspended Users Data
    loadingSuspendedUsers = false;
    suspendedUsersData: ISuspendedUser[] = [];

    // Banned Users Data
    loadingBannedUsers = false;
    bannedUsersData: IBannedUser[] = [];
    //#endregion

    //#region | INIT        |
    ngOnInit(): void {
        this.loadUsers();
        this.loadSuspendedUsers();
        this.loadBannedUsers();
    };
    private loadUsers(): void {
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
    private loadSuspendedUsers(): void {
        this._userService.getSuspendedUsers().subscribe({
            next: (res) => this.setSuspendedUsers(res.data),
            error: (error) => this.setError(error),
        });
    };
    private loadBannedUsers(): void {
        this._userService.getBannedUsers().subscribe({
            next: (res) => this.setBannedUsers(res.data),
            error: (error) => this.setError(error),
        });
    };
    //#endregion

    //#region | ACTIONS     |
    // -------- Sorting --------
    onFilterChange(option: 'all' | 'suspended' | 'banned') {
        this.selectedFilter = option;
    };
    setSort(type: string) {
        this.selectedSort = type;
        this.sortBy(type);
    };
    private sortBy(type: string) {
        const dateSort = (a: IUser, b: IUser) =>
            new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime();

        switch (type) {
            case 'recent': this.usersData.sort((a, b) => -dateSort(a, b)); break;
            case 'old': this.usersData.sort(dateSort); break;
            case 'usernameASC': this.usersData.sort((a, b) => a.username.localeCompare(b.username)); break;
            case 'usernameDSC': this.usersData.sort((a, b) => b.username.localeCompare(a.username)); break;
        }
    };
    // -------- View Details --------
    viewUser(user: IUser) {
        this._userService.getUserById(user._id!).subscribe({
            next: (res) => {
                this.setUser(res.data);
                this.setSuccess(res.message);
            },
            error: (error) => this.setError(error.message)
        });
    };
    // -------- Suspend User --------
    openSuspendModal(user: IUser) {
        this.selectedUserToSuspend = user;
        this.suspendUserForm = { suspendedTime: 5, reason: 'Has sido suspendido.' };
    };
    confirmSuspend(idUser: string) {
        if (!this.selectedUserToSuspend) return;

        const { suspendedTime, reason } = this.suspendUserForm;

        if (!reason.trim()) return this.setError('La razón es obligatoria');

        // if (![1, 5, 10].includes(Number(suspendedTime)))
        //     return this.setError('Duración inválida');

        this._userService.suspendUser(idUser, { reason, suspendedTime }).subscribe({
            next: (res) => {
                this.setSuccess(res.message);
                this.loadUsers();
                this.loadSuspendedUsers();
            },
            error: (error) => this.setError(error)
        });
    };
    // -------- Revoke Suspension --------
    openRevokeSuspensionModal(user: IUser) {
        this.selectedUserToRevokeSuspend = user;
        this.revokeSuspendForm.reason = 'Tu suspensión ha sido revocada.';
    };
    confirmRevokeSuspension(idUser: string) {
        this._userService.revokeSuspension(idUser, {
            revokeReason: this.revokeSuspendForm.reason
        }).subscribe({
            next: (res) => {
                this.setSuccess(res.message);
                this.loadUsers();
                this.loadSuspendedUsers();
            },
            error: (error) => this.setError(error)
        });
    };
    // -------- Ban User --------
    openBanModal(user: IUser) {
        this.selectedUserToBan = user;
        this.banUserForm.reason = 'Has sido baneado.';
    };
    confirmBan(idUser: string) {
        this._userService.banUser(idUser, {
            reason: this.banUserForm.reason
        }).subscribe({
            next: (res) => {
                this.setSuccess(res.message);
                this.loadUsers();
                this.loadBannedUsers();
            },
            error: (error) => this.setError(error)
        });
    };
    // -------- Revoke Ban --------
    openRevokeBanModal(user: IUser) {
        this.selectedUserToRevokeBan = user;
        this.revokeBanForm.reason = 'Tu baneo ha sido revocado.';
    };
    confirmRevokeBan(idUser: string) {
        this._userService.revokeBan(idUser, {
            revokeReason: this.revokeBanForm.reason
        }).subscribe({
            next: (res) => {
                this.setSuccess(res.message);
                this.loadUsers();
                this.loadBannedUsers();
            },
            error: (error) => this.setError(error)
        });
    };
    //#endregion

    //#region | SETTERS     |
    // Arrays
    private setUser(user: IUser) {
        this.userDataUnique = user;
    };
    // Lists
    private setUsers(users: IUser[]) {
        this.usersData = users;
        this.generalUsersCount = users.length;
        this.activeUsersCount = users.filter(s => s.status === "Activo").length;
        this.suspendedUsersCount = users.filter(s => s.status === "Suspendido").length;
        this.bannedUsersCount = users.filter(s => s.status === "Baneado").length;
    };
    private setSuspendedUsers(users: ISuspendedUser[]) {
        this.suspendedUsersData = users;
    };
    private setBannedUsers(users: IBannedUser[]) {
        this.bannedUsersData = users;
    };
    // States
    private setSuccess(message: string) {
        this.successMessage = message;
        setTimeout(() => this.successMessage = '', 3000);
    };
    private setError(message: string) {
        this.errorMessage = message;
        setTimeout(() => this.errorMessage = '', 3000);
    };
    //#endregion

};