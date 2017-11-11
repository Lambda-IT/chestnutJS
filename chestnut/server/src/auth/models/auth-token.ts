import { prop, Ref, Typegoose, ModelType, InstanceType } from 'typegoose';

export enum TokenType {
    refresh = 'refresh',
    access = 'access',
}

export class AuthToken extends Typegoose {
    @prop({ required: true, unique: true })
    userId: string;

    @prop({ required: true })
    token: string;

    @prop({ required: true })
    expires: Date;

    @prop({ required: true, default: 'access', enum: TokenType })
    type: TokenType;
}
