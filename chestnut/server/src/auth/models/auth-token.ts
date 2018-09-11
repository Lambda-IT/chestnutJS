import { prop, Typegoose } from 'typegoose';

export enum TokenType {
    refresh = 'refresh',
    access = 'access',
}

export class AuthToken extends Typegoose {
    @prop({ required: true })
    userId: string;

    @prop({ required: true })
    token: string;

    @prop({ required: true })
    expires: Date;

    @prop({ required: true, default: 'access', enum: TokenType })
    type: TokenType;

    @prop({ required: true })
    clientId: string;
}
