import { prop } from 'typegoose';

export class TranslatedName {
    @prop()
    de: string;
    @prop()
    fr: string;
}
