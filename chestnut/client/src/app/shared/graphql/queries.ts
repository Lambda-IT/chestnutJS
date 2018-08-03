import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';

export const composeByIdQuery = (id: string, modelName, properties: string[]): DocumentNode =>
    gql`
        query get${modelName}ById {
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
