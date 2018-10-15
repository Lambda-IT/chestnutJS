import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';

export const composeByIdQuery = (id: string, modelName, properties: string[]): DocumentNode =>
    gql`
        query get${capitalize(modelName)}ById {
            ${modelName}ById(_id: "${id}"){
                ${[...properties]}
            }
        }`;

export const composeManyQuery = (modelName: string, properties: string[]): DocumentNode =>
    gql`
        query get${modelName}Many {
            ${modelName}Many {
                ${[...properties]}
            }
        }`;

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

export const composeUpdateMutation = (modelName: string): DocumentNode =>
    gql`
        mutation update${capitalize(modelName)}($input: UpdateById${capitalize(modelName)}Input!) {
            ${modelName}UpdateById(record: $input) { recordId }
        }`;

const capitalize = (input: string) =>
    input &&
    input
        .charAt(0)
        .toUpperCase()
        .concat(input.slice(1));
