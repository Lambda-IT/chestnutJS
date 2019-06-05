import { composeWithMongoose } from 'graphql-compose-mongoose'; // Plugin from graphql-compose toolkit
import { GQC } from 'graphql-compose';
import { GraphQLSchema } from 'graphql';
import * as camelcase from 'camelcase';
import { Store } from './store';
import { ChestnutOptions } from '.';

export function initGraphQLSchema(store: Store, options: ChestnutOptions): GraphQLSchema {
    const compositions: any = {};

    Object.keys(store.models).forEach(key => {
        const mongooseModel = store.models[key] as any; // mongooseModel
        const modelName = camelcase(key);
        const modelComposition = composeWithMongoose(mongooseModel, {}); // Mongoose to GraphQL

        compositions[modelName] = modelComposition;

        Object.keys(mongooseModel.schema.paths)
            .filter(k => k !== '__v')
            .forEach(p => {
                const property = mongooseModel.schema.paths[p];

                if (property.instance === 'String') {
                    modelComposition.setResolver(
                        'findMany',
                        modelComposition.getResolver('findMany').addFilterArg({
                            name: property.path + '_regex',
                            type: 'String',
                            description: 'Search by regExp',
                            query: (rawQuery, value) => {
                                rawQuery[property.path] = new RegExp(value, 'i');
                            },
                        })
                    );
                }
            });

        // queries and mutations from graphql-compose ...
        GQC.rootQuery().addFields({
            [modelName + 'ById']: modelComposition.getResolver('findById'),
            [modelName + 'ByIds']: modelComposition.getResolver('findByIds'),
            [modelName + 'One']: modelComposition.getResolver('findOne'),
            [modelName + 'Many']: modelComposition.getResolver('findMany'),
            [modelName + 'Count']: modelComposition.getResolver('count'),
            [modelName + 'Connection']: modelComposition.getResolver('connection'),
            [modelName + 'Pagination']: modelComposition.getResolver('pagination'),
        });

        GQC.rootMutation().addFields({
            [modelName + 'Create']: modelComposition.getResolver('createOne'),
            [modelName + 'UpdateById']: modelComposition.getResolver('updateById'),
            [modelName + 'RemoveById']: modelComposition.getResolver('removeById'),
        });
    });

    Object.keys(store.models).forEach(key => {
        const mongooseModel = store.models[key] as any; // mongooseModel
        const modelName = camelcase(key);

        Object.keys(mongooseModel.schema.paths)
            .filter(k => k !== '__v')
            .forEach(p => {
                const property = mongooseModel.schema.paths[p];
                const objProperty = mongooseModel.schema.obj[p];

                if (objProperty && objProperty.ref) {
                    const refName = camelcase(objProperty.ref);
                    compositions[modelName].addRelation(refName + 'Ref', {
                        resolver: compositions[refName].getResolver('findById'),
                        prepareArgs: {
                            _id: (source: any) => source[p],
                        },
                        projection: { [p]: 1 },
                    });
                } else if (objProperty && Array.isArray(objProperty) && objProperty.length > 0) {
                    if (objProperty[0].ref !== 'String') {
                        const refName = camelcase(objProperty[0].ref);

                        compositions[modelName].addRelation(refName + 'Refs', {
                            resolver: compositions[refName].getResolver('findByIds'),
                            prepareArgs: {
                                _ids: (source: any) => source[p],
                            },
                            projection: { [p]: 1 },
                        });
                    }
                }
            });
    });

    const graphqlSchema = GQC.buildSchema();
    return graphqlSchema;
}
