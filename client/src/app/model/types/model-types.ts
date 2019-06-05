import * as t from 'io-ts';

export interface FilterMetadataModel {
    name: string;
    values: string | boolean[];
    viewComponent: ViewComponent;
    hasOperator: boolean;
}

export interface FilterItem {
    field: string;
    operator: string;
    value: string | boolean;
    isString: boolean;
    hasGraphQLOperator: boolean;
}

export enum ViewComponent {
    stringInput = 'StringInput',
    select = 'Select',
    number = 'Number',
    date = 'Date',
}

export const initialFile = { fileId: '', inProgress: false };

export class FileUploadModel {
    inProgress: boolean;
    fileId: string;
}

export const SaveFileResponse = t.type({
    fileId: t.string,
});
export interface SaveFileResponse {
    fileId: string;
}

export const LoadFileResponse = t.type({
    fileId: t.string,
});
export interface LoadFileResponse {
    fileId: string;
}
