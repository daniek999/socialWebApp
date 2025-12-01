// Interfaces for the data sent as a result.
export interface IAchievementBase {
    _id: string;
    code: string;
    name: string;
    description: string;
    icon: string;
    points: number;
    createdAt: string;
    updatedAt: string;
};
export interface IAchievementPopulated {
    _id: string;
    idUser: string;
    idAchievement: IAchievementBase;
    notified: false;
    createdAt: string;
    updatedAt: string;
};
export interface IGlobalAchievement extends IAchievementBase {
    totalUsersGotIt: number;
    percentage: number;
};

// Handler response interfaces.
export interface IAchievementSingleResponse {
    success: boolean;
    message: string;
    data: IAchievementPopulated[];
    
};
export interface IAchievementListResponse {
    success: boolean;
    message: string;
    data: IGlobalAchievement[];
};