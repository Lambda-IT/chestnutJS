import { prop, Ref, Typegoose, ModelType, InstanceType } from 'typegoose';

export class AuthClient extends Typegoose {
    @prop({ required: true, unique: true })
    clientId: string;

    @prop({ required: true })
    clientSecret: string;
}
