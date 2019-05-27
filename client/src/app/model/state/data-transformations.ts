import { MetadataDto, PropertyDescription, PropertyType } from '@shared/contracts/metadata';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldConfigMap } from './model.reducer';

interface FormMappingType {
    type: 'input' | 'textarea' | 'checkbox' | 'html' | 'embedded';
    templateType?: 'text' | 'date' | 'number' | 'datetime-local' | 'embedded';
}

const typeMap: { [key in PropertyType]: FormMappingType } = {
    [PropertyType.string]: { type: 'input', templateType: 'text' },
    [PropertyType.html]: { type: 'html', templateType: 'date' },
    [PropertyType.boolean]: { type: 'checkbox', templateType: 'date' },
    [PropertyType.date]: { type: 'input', templateType: 'date' },
    [PropertyType.dateTime]: { type: 'input', templateType: 'datetime-local' },
    [PropertyType.number]: { type: 'input', templateType: 'number' },
    [PropertyType.objectID]: { type: 'input', templateType: 'text' },
    [PropertyType.array]: { type: 'input', templateType: 'text' },
    [PropertyType.embedded]: { type: 'input', templateType: 'text' },
    [PropertyType.mixed]: { type: 'input', templateType: 'text' },
};

export const transformMetadataToForm = (metadata: MetadataDto) => {
    return metadata.models.reduce(
        (acc, model) => {
            return createForm(acc, model);
        },
        {} as FormlyFieldConfigMap
    );
};

export const createForm = (acc, model) => {
    return {
        ...acc,
        [model.name]: model.properties
            .map(x => {
                if (!typeMap[x.type]) {
                    console.log(`Property: ${x.name} has a wrong type!`, x);
                }
                if (x.type === PropertyType.embedded) {
                }
                return x;
            })
            .map(p => createFormRecursively(p)),
    };
};

export const createFormRecursively = p => {
    if (p.type === 'Embedded') {
        return <FormlyFieldConfig>{
            key: p.name,
            wrappers: ['panel'],
            templateOptions: { label: p.name },
            fieldGroup: createFieldGroup(p.properties),
        };
    } else {
        return <FormlyFieldConfig>{
            key: p.name,
            type: p.readonly ? 'input' : p.enumValues && p.enumValues.length > 0 ? 'select' : typeMap[p.type].type,
            hide: p.hidden,
            defaultValue: p.default,
            templateOptions: {
                type: calculateType(p),
                label: p.name,
                disabled: p.type === 'ObjectID' || p.readonly,
                required: p.required,
                pattern: p.regExp,
                options:
                    p.enumValues &&
                    p.enumValues.length > 0 &&
                    p.enumValues.map(x => ({
                        label: x,
                        value: x,
                    })),
            },
        };
    }
};

export const calculateType = p =>
    p.readonly ? 'text' : p.enumValues && p.enumValues.length > 0 ? null : typeMap[p.type].templateType;

export const createFieldGroup = (pDescs: PropertyDescription[]) => pDescs.map(pDesc => createFormRecursively(pDesc));

export const transformMetadataToProperties = (metadata: MetadataDto) =>
    metadata.models.reduce((acc, curr) => ({ ...acc, [curr.name]: curr.properties.map(p => p.name) }), {});

export const transformMetadataToPropertyDefinition = (metadata: MetadataDto) =>
    metadata.models.reduce(
        (acc, curr) => ({
            ...acc,
            [curr.name]: curr.properties.map(p => ({
                name: p.name,
                properties: p.properties.length > 0 ? p.properties : [],
            })),
        }),
        {}
    );

export const buildColumnListForGraphQL = (metadata: MetadataDto) =>
    metadata.models.reduce(
        (acc, curr) => ({
            ...acc,
            [curr.name]: curr.properties.filter(p => p.type !== PropertyType.embedded).map(fp => fp.name),
        }),
        {}
    );
