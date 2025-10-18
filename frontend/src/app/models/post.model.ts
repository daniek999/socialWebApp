export class Post {
    _id?: string;
    idUser: {
        _id: string;
        username: string;
    };
    title: string;
    content: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;

    constructor(
        idUser: { _id: string; username: string },
        title: string,
        content: string,
        _id?: string,
        createdAt?: string,
        updatedAt?: string,
        __v?: number
    ) {
        this._id = _id;
        this.idUser = idUser;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.__v = __v;
    }

    
    get shortContent(): string {
        return this.content.length > 100
        ? this.content.substring(0, 100) + '...'
        : this.content;
    }

    get formattedDate(): string {
        return this.createdAt
        ? new Date(this.createdAt).toLocaleDateString('es-ES')
        : '';
    }
}
