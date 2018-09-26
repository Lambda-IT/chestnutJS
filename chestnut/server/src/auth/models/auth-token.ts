import { prop, Typegoose } from 'typegoose';
import { excludeFromModel } from '../../decorators/exclude-from-model';

export enum TokenType {
    refresh = 'refresh',
    access = 'access',
}

@excludeFromModel()
export class AuthToken extends Typegoose {

    // @index({ userId: 1, type: 1 }, { unique: true }) not in a release!!!

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
