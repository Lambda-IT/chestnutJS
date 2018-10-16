import { prop, pre, Typegoose, ModelType, InstanceType } from 'typegoose';
import { createSalt, computeHash } from '../password-service';

export enum ChestnutPermissions {
    read = 'read',
    write = 'write',
}

@pre<AuthUser>('save', function(next) {
    if (this.isNew) {
        this.salt = createSalt();
        this.passwordHash = computeHash(this.passwordHash, this.salt);
        this.failedLoginAttemps = 0;
        this.locked = false;
        this.deleted = false;
        this.activated = true;
        this.lastLoginAttempt = new Date('01-01-1970');
    }
    next();
})
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
