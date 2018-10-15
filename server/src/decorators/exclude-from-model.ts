import { registry } from './type-registry';
import * as camelcase from 'camelcase';

export function excludeFromModel() {
    return function (constructor: Function) {
        const modelName = camelcase(constructor.name);
        registry.exclusions.push(modelName);
    };
}
