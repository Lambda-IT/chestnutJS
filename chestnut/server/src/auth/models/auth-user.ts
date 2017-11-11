import { prop, Ref, Typegoose, ModelType, InstanceType } from 'typegoose';

export enum ChestnutPermissions {
    read = 'read',
    write = 'write',
}

export class AuthUser extends Typegoose {
    @prop({ required: true })
    firstname: string;

    @prop({ required: true })
    lastname: string;

    @prop({ required: true, unique: true })
    email: string;

    @prop({ required: true })
    language: string;

    @prop({ required: true })
    passwordHash: string;

    @prop({ required: true })
    salt: string;

    @prop({ required: true, enum: ChestnutPermissions })
    permissions: ChestnutPermissions;

    @prop({ default: 0 })
    failedLoginAttemps: number;

    @prop({ default: false })
    locked: boolean;

    @prop({ default: false })
    deleted: boolean;

    @prop({ default: true })
    activated: boolean;

    @prop() lastLoginAttempt: Date;
}
