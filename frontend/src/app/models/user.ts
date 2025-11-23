export interface IUser {
    _id: string;
    username: string;
    email: string;
    role: string;
    isVerified: boolean;
    // Agregar Estado ._. tmb en el backend
    createdAt?: string;
    updatedAt?: string;
}

export interface IUserListResponse {
    success: boolean;
    message: string;
    data: IUser[];
}
export interface IUserSingleResponse {
    success: boolean;
    message: string;
    data: IUser;
}
