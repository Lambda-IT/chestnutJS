export enum PropertyType {
    string = 'String',
    html = 'html',
    boolean = 'Boolean',
    date = 'Date',
    objectID = 'ObjectID',
    dateTime = 'dateTime',
    number = 'Number',
    array = 'Array',
    embedded = 'Embedded',
    mixed = 'Mixed',
    file = 'File',
}

export interface PropertyDescription {
    name: string;
    properties: PropertyDescription[];
    type: PropertyType;
    required?: boolean;
    unique?: boolean;
    default?: any;
    reference?: string;
    enumValues?: string[];
    regExp?: string;
    hidden?: boolean;
    readonly?: boolean;
    index: boolean;
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
