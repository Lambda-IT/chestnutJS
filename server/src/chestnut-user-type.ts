import { ChestnutPermissions } from './auth/models/auth-user';

export type ChestnutUser = {
    firstname: string;
    lastname: string;
    email: string;
    language: string;
    password: string;
    permissions: ChestnutPermissions;
};
