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
