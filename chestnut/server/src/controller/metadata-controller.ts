import { Request, Response, Express } from 'express';
import { ModelDescription, PropertyDescription } from '../../../common/metadata';

export function createMetadataController(app: Express, models: Object, baseUrl: string) {
    app.get(baseUrl + '/metadata', (req: Request, res: Response) => {
        const modelDescriptions = Object.keys(models).map(key => {
            const model = models[key]; // Typegoose
            const modelName = key.toLowerCase();

            const mongooseModel = new model().getModelForClass(model);

            // console.log(mongooseModel.schema, 'mongooseModel');

            const properties = Object.keys(mongooseModel.schema.paths)
                .filter(k => k !== '__v')
                .map(p => {
                    const property = mongooseModel.schema.paths[p];
                    const objProperty = mongooseModel.schema.obj[p];
                    const desc: PropertyDescription = {
                        name: p,
                        type: property.instance,
                        default: property.defaultValue,
                        required: property.isRequired,
                        enumValues: property.enumValues,
                        regExp: property.regExp,
                        reference: objProperty ? objProperty.ref : null,
                    };

                    return desc;
                });

            return { name: key, properties: properties } as ModelDescription;
        });

        const metadata = { models: modelDescriptions };

        res.send(metadata).end();
    });
}
