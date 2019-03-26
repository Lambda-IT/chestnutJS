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

                const properties = createProperties(mongooseModel.schema.paths, modelName);

                return { name: key, properties: properties } as ModelDescription;
            });

        const metadata = { models: modelDescriptions };

        res.send(metadata).end();
    });
}

export function createProperties(path, modelName: string) {
    return Object.keys(path)
        .filter(k => k !== '__v')
        .map(p => {
            const property = path[p];
            const objProperty = path[p];
            const desc: PropertyDescription = {
                name: p,
                properties:
                    property.schema && property.schema.paths ? createProperties(property.schema.paths, modelName) : [],
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
}
