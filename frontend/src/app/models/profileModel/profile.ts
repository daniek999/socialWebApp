export class Profile {
    _id?: string;
    idUser: {
        _id: string;
        username: string;
        email: string;
        role: string;
        isVerified: boolean;
    };
    name: string;
    surname: string;
    profession: string;
    interests: string[];
    hobbies: string[];
    visible: boolean;
    photo: string;
    curriculumvitae: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;

    constructor(
        idUser: { _id: string; username: string; email: string; role: string; isVerified: boolean },
        name: string,
        surname: string,
        profession: string,
        interests: string[] = [],
        hobbies: string[] = [],
        visible: boolean = false,
        photo: string,
        curriculumvitae: string,
        _id?: string,
        createdAt?: string,
        updatedAt?: string,
        __v?: number
    ) {
        this._id = _id;
        this.idUser = idUser;
        this.name = name;
        this.surname = surname;
        this.profession = profession;
        this.interests = interests;
        this.hobbies = hobbies;
        this.visible = visible;
        this.photo = photo;
        this.curriculumvitae = curriculumvitae;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.__v = __v;
    }
}
