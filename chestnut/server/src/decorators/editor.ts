
import { registry, initModel } from './type-registry';
import { PropertyType } from '../../../common/metadata';

export function editor(type: PropertyType) {
    return function (target: any, key: any) {
        const modelName = target.constructor.name.toLowerCase();
        initModel(modelName, key);
        registry.model[modelName] = { ...registry.model[modelName], [key]: { editorType: type } };
        console.log('----------editor------------', JSON.stringify(registry));
    };
}
