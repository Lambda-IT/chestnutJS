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

// export const composeCreateMutation = (modelName: string, model: any, properties: string[]): DocumentNode =>
//     gql`
//         mutation create${modelName}($model: model!) {
//             ${modelName}Create(record: $model)
//         }`;

export const composeUpdateMutation = (modelName: string): DocumentNode =>
    gql`
        mutation update${capitalize(modelName)}($input: UpdateByIdTodoInput!) {
            ${modelName}UpdateById(record: $input) { recordId }
        }`;

const capitalize = (input: string) =>
    input &&
    input
        .charAt(0)
        .toUpperCase()
        .concat(input.slice(1));
