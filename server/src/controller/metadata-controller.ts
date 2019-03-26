import { Request, Response, Express } from 'express';
import { ModelDescription, PropertyDescription } from '../../../common/metadata';
import { Store } from '../store';
import { registry, isHidden, isReadonly } from '../decorators/type-registry';

export function createMetadataController(app: Express, store: Store, baseUrl: string) {
    app.get(baseUrl + '/metadata', (req: Request, res: Response) => {
        const modelDescriptions = Object.keys(store.models)
            .filter(k => registry.exclusions.indexOf(k) === -1)
            .map(key => {
                const mongooseModel = store.models[key] as any; // mongooseModel
                const modelName = key.toLowerCase();

                const properties = Object.keys(mongooseModel.schema.paths)
                    .filter(k => k !== '__v')
                    .map(p => {
                        const property = mongooseModel.schema.paths[p];
                        const objProperty = mongooseModel.schema.obj[p];
                        const desc: PropertyDescription = {
                            name: p,
                            nameOfParameters:
                                property.schema && property.schema.paths ? Object.keys(property.schema.paths) : [],
                            type:
                                (registry.model[modelName] &&
                                    registry.model[modelName][p] &&
                                    registry.model[modelName][p].editorType) ||
                                property.instance,
                            default: property.defaultValue,
                            required: property.isRequired,
                            enumValues: property.enumValues,
                            regExp: property.regExp,
                            reference: objProperty ? objProperty.ref : null,
                            hidden: isHidden(modelName, p),
                            readonly: isReadonly(modelName, p),
                            index: objProperty ? objProperty.index : false,
                        };

                        return desc;
                    });

                return { name: key, properties: properties } as ModelDescription;
            });

        const metadata = { models: modelDescriptions };

        res.send(metadata).end();
    });
}
