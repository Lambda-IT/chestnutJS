
import { registry, initModel } from './type-registry';

export function hidden() {
    return function (target: any, key: any) {
        const modelName = target.constructor.name.toLowerCase();
        initModel(modelName, key);
        registry.model[modelName] = { [key]: { hidden: true } };
    };
}
