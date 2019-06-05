import { initModel, registry } from './type-registry';
import { PropertyType } from '../../../client/src/app/shared/contracts/metadata';

export function customType(type: PropertyType) {
    return function(target: any, key: any) {
        const modelName = target.constructor.name.toLowerCase();
        initModel(modelName, key);
        registry.model[modelName] = { ...registry.model[modelName], [key]: { editorType: type } };
    };
}
