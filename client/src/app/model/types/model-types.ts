export interface FilterMetadataModel {
    name: string;
    values: string | boolean[];
    isString: boolean;
}

export interface FilterItem {
    field: string;
    operator: string;
    value: string | boolean;
    isString: boolean;
}
