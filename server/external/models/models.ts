import { prop, arrayProp, Ref, Typegoose, ModelType, InstanceType } from 'typegoose';
import { hidden, editor, readonly, PropertyType } from '../../..';
import { TranslatedName } from './model-type';

export class Task extends Typegoose {
    @prop() description: string;

    @prop() completed: boolean;
}

export class User extends Typegoose {
    @prop() name?: string;

    @prop({ required: true })
    age: number;

    @prop({ default: 'test' })
    description?: string;

    @editor(PropertyType.html)
    @prop({ default: '<test>hm</test>' })
    webText?: string;

    @hidden()
    @prop()
    createdAt?: Date;

    @prop({ enum: ['completed', 'started'] })
    state?: string;

    @arrayProp({ itemsRef: Task })
    Task: Task[];
}

export class Todo extends Typegoose {
    @prop() description: string;

    @prop({ default: false }) completed: boolean;

    @prop({ ref: User, required: true })
    user: Ref<User>;
}

export class Texte extends Typegoose {
    @prop() description: string;

    @prop() name: TranslatedName;
}
