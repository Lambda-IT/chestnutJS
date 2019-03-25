import { prop, arrayProp, Ref, Typegoose } from 'typegoose';
import { hidden, editor, readonly, PropertyType } from '../../..';

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

    @prop() completed: boolean;

    @prop()
    createdAt?: Date;

    @prop({ ref: User, required: true })
    user: Ref<User>;
}
