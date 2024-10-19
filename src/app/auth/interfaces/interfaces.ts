export interface AuthResponse {
    ok: boolean;
    uid?: string;
    name?: string;
    token?: string;
    msg?: string;
}

export interface Usuario {
    uid: string;
    name: string;
}

export interface Activities {
    idActivity: number;
    description: string;
    idUser: number;
    idCategory: number;
    isCompleted: boolean;
}

export interface Categories {
    idCategory: number;
    nameCategory: string;
}

export interface Times {
    idTime: number;
    timeWork: number;
    date: string | null;
    idActivity: number;
}