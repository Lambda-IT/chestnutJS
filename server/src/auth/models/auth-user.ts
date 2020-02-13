import { prop, pre, Typegoose, ModelType, InstanceType, index } from 'typegoose';
import { createSalt, computeHash } from '../password-service';
import { customType, hidden, readonly } from '../../decorators';
import { PropertyType } from '../../shared/contracts';

export enum ChestnutPermissions {
    read = 'read',
    write = 'write',
}

@pre<AuthUser>('save', function(next) {
    if (this.isNew) {
        this.salt = createSalt();
        this.failedLoginAttemps = 0;
        this.locked = false;
        this.deleted = false;
        this.activated = true;
        this.lastLoginAttempt = new Date('01-01-1970');
    }
    if (this.password.length > 0) {
        this.passwordHash = computeHash(this.password, this.salt);
        this.password = '';
    }
    next();
})
export class AuthUser extends Typegoose {
    @prop({ required: true })
    firstname: string;

    @prop({ required: true })
    lastname: string;

    @prop({ required: true })
    email: string;

    @prop({ required: true })
    language: string;

    @prop({ required: true, default: 'chestnut' })
    type: string;

    @prop({ required: true, default: 'chestnut' })
    tenant: string;

    @customType(PropertyType.password)
    @prop({})
    password: string;

    @readonly()
    @prop({})
    passwordHash: string;

    @hidden()
    @prop({})
    salt: string;

    @prop({ required: true, enum: ChestnutPermissions })
    permissions: ChestnutPermissions;

    @prop({ default: 0, index: true })
    failedLoginAttemps: number;

    @prop({ default: false })
    locked: boolean;

    @prop({ default: false })
    deleted: boolean;

    @prop({ default: true })
    activated: boolean;

    @readonly()
    @prop({ index: true })
    lastLoginAttempt: Date;
}
