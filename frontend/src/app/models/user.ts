export interface IUser {
    _id: string;
    username: string;
    email: string;
    role: string;
    isVerified: boolean;
    createdAt?: string;
    updatedAt?: string;
}