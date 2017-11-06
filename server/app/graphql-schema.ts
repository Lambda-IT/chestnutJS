import {
    GraphQLBoolean,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLSchema,
    GraphQLString,
} from 'graphql';

import { todoRepository } from './todo.repository';

const todoType = new GraphQLObjectType({
    name: 'Todo',
    description: 'A task to be completed',
    fields: {
        id: { type: GraphQLID },
        description: { type: GraphQLString },
        completed: { type: GraphQLBoolean },
    },
});

const queryType = new GraphQLObjectType({
    name: 'QueryType',
    fields: {
        todos: {
            type: new GraphQLList(todoType),
            args: {
                id: { type: GraphQLID },
            },
            resolve: async () => await todoRepository.getAllTodos(),
        },
        todo: {
            type: todoType,
            args: {
                id: { type: GraphQLID },
            },
            resolve: async (_, args) => await todoRepository.getTodoById(args.id),
        },
    },
});

const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        setCompleted: {
            type: todoType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                completed: { type: new GraphQLNonNull(GraphQLBoolean) },
            },
            resolve: async (_, args) => await todoRepository.setCompleted(args.id, args.completed),
        },
    },
});

export const schema = new GraphQLSchema({
    query: queryType,
    mutation: mutationType,
});
