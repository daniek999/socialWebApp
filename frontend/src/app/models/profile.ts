import { IUser } from "./user";

export interface IProfileBase {
    _id?: string;
    // Puede venir poblado o solo ID
    idUser: IUser;
    // Datos básicos
    name?: string;
    surname?: string;
    birthday?: string;
    interests?: string[];
    // Datos profesionales
    profession?: string;
    situation?: 'Estudiante' | 'Buscando' | 'Practicante' | 'Empleado';
    description?: string;
    about?: string;
    skills?: string[];
    // Media
    photo?: string;
    curriculumvitae?: string;
    // Configuración visual
    visible: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
};

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

// Caso cuando backend hace populate de idUser
export interface IProfilePopulated extends Omit<IProfileBase, 'idUser'> {
    idUser: IUser;
};

// Tipo general que soporta ambos
export type IProfile = IProfileBase | IProfilePopulated;

