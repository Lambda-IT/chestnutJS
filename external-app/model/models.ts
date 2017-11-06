import { prop, Ref, Typegoose, ModelType, InstanceType } from 'typegoose';

export class User extends Typegoose {
    @prop() name?: string;

    @prop({ required: true })
    age: number;
}

export class Todo extends Typegoose {
    @prop() description: string;

    @prop() completed: boolean;

    @prop({ ref: User, required: true })
    user: Ref<User>;
}
