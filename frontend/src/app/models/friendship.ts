import { IProfile } from "./profile";
import { IUser } from "./user";

// Interfaces for the data sent as a result.
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

// Handler response interfaces.
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


// We combine both interfaces into one.
export type IFriendship = IFriendshipBase | IFriendshipPopulated;