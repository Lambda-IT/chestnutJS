import { prop, arrayProp, Ref, Typegoose } from 'typegoose';
import { PropertyType } from '../../src/shared/contracts';
import { customType, hidden } from '../../src/decorators';
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

    @customType(PropertyType.html)
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

    @prop() completed: boolean;

    @prop()
    createdAt?: Date;

    @prop({ ref: User, required: true })
    user: Ref<User>;
}

export class Texte extends Typegoose {
    @prop() description: string;

    @prop() name: TranslatedName;
}

export class FileUpload extends Typegoose {
    @prop()
    titel: string;

    @customType(PropertyType.file)
    @prop()
    fileId: string;
}
