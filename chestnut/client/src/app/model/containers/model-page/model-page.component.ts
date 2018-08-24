import { Component } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, of } from 'rxjs';

// const metadataModel = <ModelDescription[]>[
//     {
//         name: 'authUser',
//         properties: [
//             {
//                 name: 'firstname',
//                 type: 'String',
//                 required: true,
//                 enumValues: [],
//                 regExp: null,
//             },
//             {
//                 name: 'lastname',
//                 type: 'String',
//                 required: true,
//                 enumValues: [],
//                 regExp: null,
//             },
//             {
//                 name: 'email',
//                 type: 'String',
//                 required: true,
//                 enumValues: [],
//                 regExp: null,
//             },
//             {
//                 name: 'language',
//                 type: 'String',
//                 required: true,
//                 enumValues: [],
//                 regExp: null,
//             },
//             {
//                 name: 'passwordHash',
//                 type: 'String',
//                 required: true,
//                 enumValues: [],
//                 regExp: null,
//             },
//             {
//                 name: 'salt',
//                 type: 'String',
//                 required: true,
//                 enumValues: [],
//                 regExp: null,
//             },
//             {
//                 name: 'permissions',
//                 type: 'String',
//                 required: true,
//                 enumValues: ['read', 'write'],
//                 regExp: null,
//             },
//             {
//                 name: 'failedLoginAttemps',
//                 type: 'Number',
//                 default: 0,
//             },
//             {
//                 name: 'locked',
//                 type: 'Boolean',
//                 default: false,
//             },
//             {
//                 name: 'deleted',
//                 type: 'Boolean',
//                 default: false,
//             },
//             {
//                 name: 'activated',
//                 type: 'Boolean',
//                 default: true,
//             },
//             {
//                 name: 'lastLoginAttempt',
//                 type: 'Date',
//             },
//             {
//                 name: '_id',
//                 type: 'ObjectID',
//                 reference: null,
//             },
//         ],
//     },
//     {
//         name: 'authClient',
//         properties: [
//             {
//                 name: 'clientId',
//                 type: 'String',
//                 required: true,
//                 enumValues: [],
//                 regExp: null,
//             },
//             {
//                 name: 'clientSecret',
//                 type: 'String',
//                 required: true,
//                 enumValues: [],
//                 regExp: null,
//             },
//             {
//                 name: '_id',
//                 type: 'ObjectID',
//                 reference: null,
//             },
//         ],
//     },
//     {
//         name: 'authToken',
//         properties: [
//             {
//                 name: 'userId',
//                 type: 'String',
//                 required: true,
//                 enumValues: [],
//                 regExp: null,
//             },
//             {
//                 name: 'token',
//                 type: 'String',
//                 required: true,
//                 enumValues: [],
//                 regExp: null,
//             },
//             {
//                 name: 'expires',
//                 type: 'Date',
//                 required: true,
//             },
//             {
//                 name: 'type',
//                 type: 'String',
//                 default: 'access',
//                 required: true,
//                 enumValues: ['refresh', 'access'],
//                 regExp: null,
//             },
//             {
//                 name: '_id',
//                 type: 'ObjectID',
//                 reference: null,
//             },
//         ],
//     },
//     {
//         name: 'task',
//         properties: [
//             {
//                 name: 'description',
//                 type: 'String',
//                 enumValues: [],
//                 regExp: null,
//             },
//             {
//                 name: 'completed',
//                 type: 'Boolean',
//             },
//             {
//                 name: '_id',
//                 type: 'ObjectID',
//                 reference: null,
//             },
//         ],
//     },
//     {
//         name: 'user',
//         properties: [
//             {
//                 name: 'name',
//                 type: 'String',
//                 enumValues: [],
//                 regExp: null,
//             },
//             {
//                 name: 'age',
//                 type: 'Number',
//                 required: true,
//             },
//             {
//                 name: 'description',
//                 type: 'String',
//                 default: 'test',
//                 enumValues: [],
//                 regExp: null,
//             },
//             {
//                 name: 'webText',
//                 type: 'String',
//                 default: '<test>hm</test>',
//                 enumValues: [],
//                 regExp: null,
//             },
//             {
//                 name: 'createdAt',
//                 type: 'Date',
//             },
//             {
//                 name: 'state',
//                 type: 'String',
//                 enumValues: ['completed', 'started'],
//                 regExp: null,
//             },
//             {
//                 name: 'Task',
//                 type: 'Array',
//             },
//             {
//                 name: '_id',
//                 type: 'ObjectID',
//                 reference: null,
//             },
//         ],
//     },
//     {
//         name: 'todo',
//         properties: [
//             {
//                 name: 'description',
//                 type: 'String',
//                 enumValues: [],
//                 regExp: null,
//             },
//             {
//                 name: 'completed',
//                 type: 'Boolean',
//             },
//             {
//                 name: 'user',
//                 type: 'ObjectID',
//                 reference: 'User',
//             },
//             {
//                 name: '_id',
//                 type: 'ObjectID',
//                 reference: null,
//             },
//         ],
//     },
// ];

// interface FormlyFieldConfigMap {
//     [key: string]: FormlyFieldConfig[];
// }

@Component({
    selector: 'app-model-page',
    templateUrl: './model-page.component.html',
    styleUrls: ['./model-page.component.scss'],
})
export class ModelPageComponent {
    fieldMap$: Observable<FormlyFieldConfig[]>;
    model$: Observable<any>;

    constructor() {
        // this.fieldMap$ = of(
        //     metadataModel.reduce(
        //         (acc, model) => {
        //             return { ...acc, [model.name]: transformMetadataToForm(model) };
        //         },
        //         {} as FormlyFieldConfigMap
        //     )['todo']
        // );
        // this.model$ = of({
        //     _id: '5b59de4ca8bc8f278478c4d2',
        //     description: 'Aendlich',
        //     completed: false,
        //     user: null,
        // });
    }
}
