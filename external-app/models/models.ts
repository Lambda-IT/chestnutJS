import { prop, arrayProp, Ref, Typegoose, ModelType, InstanceType } from 'typegoose';

export class Task extends Typegoose {
    @prop()
    description: string;

    @prop()
    completed: boolean;
}

export class User extends Typegoose {
    @prop()
    name?: string;

    @prop({ required: true })
    age: number;

    @prop({ default: 'test' })
    description?: string;

    @prop({ default: '<test>hm</test>' })
    webText?: string;

    @prop()
    createdAt?: Date;

    @prop({ enum: ['completed', 'started'] })
    state?: string;

    @arrayProp({ itemsRef: Task })
    Task: Task[];
}

export class Todo extends Typegoose {
    @prop()
    description: string;

    @prop()
    completed: boolean;

    @prop({ ref: User, required: true })
    user: Ref<User>;
}
