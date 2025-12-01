import { IUser } from "./user";

// Interfaces for the data sent as a result.
export interface IProfileBase {
    _id?: string;
    idUser: IUser;
    name?: string;
    surname?: string;
    birthday?: string;
    interests?: string[];
    profession?: string;
    situation?: 'Estudiante' | 'Buscando' | 'Practicante' | 'Empleado';
    description?: string;
    about?: string;
    skills?: string[];
    photo?: string;
    curriculumvitae?: string;
    visible: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
};
export interface IProfilePopulated extends Omit<IProfileBase, 'idUser'> {
    idUser: IUser;
};

// Handler response interfaces.
export interface IProfileSingleResponse {
    success: boolean;
    message: string;
    data: IProfile;
};
export interface IProfileListResponse {
    success: boolean;
    message: string;
    data: IProfile[];
};

// We combine both interfaces into one.
export type IProfile = IProfileBase | IProfilePopulated;

