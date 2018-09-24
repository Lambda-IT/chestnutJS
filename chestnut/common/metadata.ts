export enum PropertyType {
    string = 'String',
    html = 'html',
    boolean = 'Boolean',
    date = 'Date',
    objectID = 'ObjectID',
    dateTime = 'dateTime',
    number = 'Number',
    array = 'Array',
}

export interface PropertyDescription {
    name: string;
    type: PropertyType;
    required?: boolean;
    unique?: boolean;
    default?: any;
    reference?: string;
    enumValues?: string[];
    regExp?: string;
    hidden?: boolean;
}

export interface ModelDescription {
    name: string;
    listColumns?: string[];
    sort?: string;
    properties: PropertyDescription[];
}

export interface MetadataDto {
    models: ModelDescription[];
}
