import { IUser } from "./user";

export interface IProfileBase {
    _id?: string;
    idUser: IUser | string;
    name?: string;
    surname?: string;
    profession?: string;
    employmentStatus?: 'Estudiante' | 'Buscando' | 'Practicante' | 'Empleado';
    about?: string;
    photo?: string;
    curriculumvitae?: string;
    visible: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

// Interface para cuando idUser SÍ está populated
export interface IProfilePopulated extends Omit<IProfileBase, 'idUser'> {
    idUser: IUser; // Objeto completo
}

// Union type para ambos casos
export type IProfile = IProfileBase | IProfilePopulated;