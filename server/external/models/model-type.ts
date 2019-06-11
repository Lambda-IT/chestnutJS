import { prop } from 'typegoose';
import { customType } from '../../src/decorators';
import { PropertyType } from '../../src/shared/contracts/metadata';

export class TranslatedName {
    @prop()
    de: string;
    @prop()
    fr: string;
}
