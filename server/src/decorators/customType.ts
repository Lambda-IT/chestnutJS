import { initModel, registry } from './type-registry';
import { PropertyType } from '../shared/contracts';

export function customType(type: PropertyType) {
    return function(target: any, key: any) {
        const modelName = target.constructor.name.toLowerCase();
        initModel(modelName, key);
        registry.model[modelName] = { ...registry.model[modelName], [key]: { editorType: type } };
    };
}
