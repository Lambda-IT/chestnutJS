import { registry, initModel } from './type-registry';

export function readonly() {
    return function (target: any, key: any) {
        const modelName = target.constructor.name.toLowerCase();
        initModel(modelName, key);
        registry.model[modelName] = { ...registry.model[modelName], [key]: { readonly: true } };
    };
}
