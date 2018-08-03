import { ModelDescription, PropertyType } from '../../../../../common/metadata';
import { FormlyFieldConfig } from '@ngx-formly/core';

interface FormMappingType {
    type: 'input' | 'textarea' | 'checkbox';
    templateType?: 'text' | 'date' | 'number' | 'datetime-local';
}

const typeMap: { [key in PropertyType]: FormMappingType } = {
    [PropertyType.string]: { type: 'input', templateType: 'text' },
    [PropertyType.html]: { type: 'textarea', templateType: 'text' },
    [PropertyType.boolean]: { type: 'checkbox' },
    [PropertyType.date]: { type: 'input', templateType: 'date' },
    [PropertyType.dateTime]: { type: 'input', templateType: 'datetime-local' },
    [PropertyType.number]: { type: 'input', templateType: 'number' },
    [PropertyType.objectID]: { type: 'input', templateType: 'text' },
    [PropertyType.array]: { type: 'input', templateType: 'text'}
};

export const transformMetadataToForm = (model: ModelDescription) => {
    return model.properties
        .map(x => {
            if (!typeMap[x.type]) {
                console.log(`Property: ${x.name} has a wrong type!`, x);
            }
            return x;
        })
        .map(
            p =>
                <FormlyFieldConfig>{
                    key: p.name,
                    type: typeMap[p.type].type,
                    templateOptions: {
                        type: typeMap[p.type].templateType,
                        label: p.name,
                        disabled: p.type === 'ObjectID',
                        required: p.required,
                    },
                }
        );
};
