import { IProfile } from "./profile";
import { IUser } from "./user";

export interface IFriendshipBase {
    _id: string;
    requester: string;
    recipient: string;
    status: 'Pendiente' | 'Aceptado' | 'Rechazado';
    createdAt: string;
    updatedAt: string;
};

export interface IFriendshipPopulated {
    _id: string;
    requester: IUser;
    recipient: IUser;
    status: 'Pendiente' | 'Aceptado' | 'Rechazado';
    createdAt: string;
    updatedAt: string;
};

// Interfaces of json responses.
export interface IAcceptedRequest {
    friendshipId: string;
    user: {
        id: string;
        username: string;
        email: string;
    };
    profile: IProfile | null;
    since: string;
};

export interface IPendingRequest {
    friendshipId: string;
    requester: {
        id: string;
        username: string;
        email: string;
    };
    profile: IProfile | null;
    requestedAt: string;
};

export interface ISentRequest {
    friendshipId: string;
    recipient: {
        id: string;
        username: string;
        email: string;
    };
    profile: IProfile | null;
    sentAt: string;
};

export interface IRelationshipStatus {
    status: 'Pendiente' | 'Aceptado' | 'Rechazado' | null;
    isRequester?: boolean;  // Solo presente si status !== null
    friendshipId?: string;  // Solo presente si status !== null
    createdAt?: string;     // Solo presente si status !== null
    updatedAt?: string;     // Solo presente si status !== null
    message?: string;       // Solo presente si status === null
};


// We mix it using 'type' for each case.
export type IFriendship = IFriendshipBase | IFriendshipPopulated;