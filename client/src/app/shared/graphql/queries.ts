import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { FilterItem } from '../../model/types';
import { PropertyDefinition } from '../../model/state/model.reducer';

export const composeByIdQuery = (id: string, modelName, properties: PropertyDefinition[]): DocumentNode => {
    const props = properties.reduce((acc, cur) => {
        return (
            acc +
            (cur.properties.length > 0
                ? `${cur.name} {${cur.properties.map(prop => `${prop.name},`)}},`
                : `${cur.name},`)
        );
    }, '');

    return gql`
          query get${capitalize(modelName)}ById {
              ${modelName}ById(_id: "${id}"){
                  ${props}
              }
          }`;
};

export const composeManyQuery = (modelName: string, properties: string[]): DocumentNode =>
    gql`
        query  get${modelName}Many {
            ${modelName}Many {
                ${[...properties]}
            }
        }`;

export const composeFilteredManyQuery = (
    modelName: string,
    properties: string[],
    filterItems: FilterItem[]
): DocumentNode => {
    return gql`
        ${createQueryForFilterSearch(modelName, properties, filterItems)}
    `;
};

export const createQueryForFilterSearch = (
    modelName: string,
    properties: string[],
    filterItems: FilterItem[]
): string => {
    const filterString = filterItems.reduce((acc, cur) => {
        let currentValue;
        const fieldname = cur.operator === 'contains' ? `${cur.field}_regex` : cur.field;

        if (!cur.hasGraphQLOperator) {
            currentValue = cur.isString ? `${fieldname}: "${cur.value}"` : `${fieldname}: ${cur.value}`;
        } else {
            currentValue = `_operators: {${fieldname} : {${cur.operator}:${cur.value}}}`;
        }
        return [...acc, currentValue];
    }, []);

    return `
        query get${modelName}Many {
            ${modelName}Many(filter : {${filterString.join(',')}}) {
            ${[...properties]}
            }
        }
    `;
};

export const composeCountQuery = (modelName: string): DocumentNode =>
    gql`
    query get${modelName}Count {
        ${modelName}Count
    }`;

export const composeCreateMutation = (modelName: string): DocumentNode =>
    gql`
        mutation create${capitalize(modelName)}($input: CreateOne${capitalize(modelName)}Input!) {
            ${modelName}Create(record: $input) { recordId }
        }`;

export const composeUpdateMutation = (modelName: string, p): DocumentNode => {
    const q = `mutation Somename ($myData: UpdateById${capitalize(modelName)}Input!) {
              ${modelName}UpdateById(record: $myData) {
                recordId
               }
            }`;

    return gql`
        ${q}
    `;
};

const capitalize = (input: string) =>
    input &&
    input
        .charAt(0)
        .toUpperCase()
        .concat(input.slice(1));
