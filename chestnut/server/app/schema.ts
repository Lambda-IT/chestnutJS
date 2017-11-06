// import { composeWithMongoose } from "graphql-compose-mongoose";
const { composeWithMongoose } = require('graphql-compose-mongoose');
import { GQC } from 'graphql-compose';
const customizationOptions = {}; // left it empty for simplicity, described below

export function initGraphQLSchema(models: any) {
    Object.keys(models).forEach(key => {
        const model = models[key]; // Typegoose
        const modelName = key.toLowerCase();

        const mongooseModel = new model().getModelForClass(model); // Typegoose to Mongoose
        const modelComposition = composeWithMongoose(mongooseModel, customizationOptions); // Mongoose to GraphQL
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
            [modelName + 'UpdateOne']: modelComposition.getResolver('updateOne'),
            [modelName + 'UpdateMany']: modelComposition.getResolver('updateMany'),
            [modelName + 'RemoveById']: modelComposition.getResolver('removeById'),
            [modelName + 'RemoveOne']: modelComposition.getResolver('removeOne'),
            [modelName + 'RemoveMany']: modelComposition.getResolver('removeMany'),
        });
    });
    const graphqlSchema = GQC.buildSchema();
    return graphqlSchema;
}
