// Interface for the data sent as a result.
export interface IUser {
    _id: string;
    username: string;
    email: string;
    role: string;
    isVerified: boolean;
    status: string;
    createdAt?: string;
    updatedAt?: string;
};
export interface ISuspendedUser {
    _id: string;
    idUser: IUser;
    reason: string;
    status: "En Curso" | "Revocada" | "Expirada";
    suspendedBy: IUser;
    suspendedTime: number | null;
    suspendedAt: string;
    suspendedUntil: string;
    revokedAt: string | null;
    revokedBy: IUser | null;
    revokeReason: string | null;
    createdAt: string;
    updatedAt: string;
    __v: number;
};
export interface IBannedUser {
    _id: string;
    idUser: IUser;
    reason: string;
    status: "Vigente" | "Revocado";
    bannedBy: IUser;
    revokedAt: string | null;
    revokedBy: IUser | null;
    revokeReason: string | null;
    createdAt: string;
    updatedAt: string;
    __v: number;
};

// Handler response interfaces.
export interface IUserSingleResponse {
    success: boolean;
    message: string;
    data: IUser;
};
export interface IUserListResponse {
    success: boolean;
    message: string;
    data: IUser[];
};
export interface ISuspendedUserListResponse {
    success: boolean;
    message: string;
    data: ISuspendedUser[];
};
export interface IBannedUserListResponse {
    success: boolean;
    message: string;
    data: IBannedUser[];
};
export interface IActionResponse {
    success: boolean;
    message: string;
};
