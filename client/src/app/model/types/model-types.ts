export interface FilterMetadataModel {
    name: string;
    values: string | boolean[];
    viewComponent: ViewComponent;
}

export interface FilterItem {
    field: string;
    operator: string;
    value: string | boolean;
    isString: boolean;
}

export enum ViewComponent {
    stringInput = 'StringInput',
    select = 'Select',
    number = 'Number',
    date = 'Date',
}
