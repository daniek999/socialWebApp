export class User {
    _id: string;
    username: string;
    email: string;
    password?: string; // opcional -> Verificar su estancia en el front!!!
    createdAt?: string;
    updatedAt?: string;
    __v?: number;

    constructor(
        _id: string,
        username: string,
        email: string,
        password?: string,
        createdAt?: string,
        updatedAt?: string,
        __v?: number
    ) {
        this._id = _id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.__v = __v;
    }
}
