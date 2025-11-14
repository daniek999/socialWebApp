import { IUser } from "./user";

// 1. Creating the Interface
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

// 2. Extending the interface when in the backend 'profile' is populated with idUser.
export interface IProfilePopulated extends Omit<IProfileBase, 'idUser'> {
    idUser: IUser;
}

// 3. We mix it using 'type' for each case.
export type IProfile = IProfileBase | IProfilePopulated;

