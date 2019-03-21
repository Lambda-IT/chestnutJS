import { createQueryForFilterSearch } from '@shared/graphql/queries';

describe('Tests the GrapshQL Queries', () => {
    it('should return valid query with string param', () => {
        const modelName = 'todo';
        const prop = ['description', 'completed'];
        const filterItems = [
            { field: 'description', operator: 'is', value: '', isString: true, hasGraphQLOperator: false },
        ];

        const expected = 'query gettodoMany {todoMany(filter : {description: ""}) {description,completed}}';

        expect(transformString(createQueryForFilterSearch(modelName, prop, filterItems))).toBe(expected);
    });

    it('should return valid query with boolean param', () => {
        const modelName = 'todo';
        const prop = ['description', 'completed'];
        const filterItems = [
            { field: 'completed', operator: 'is', value: true, isString: false, hasGraphQLOperator: false },
        ];

        const expected = 'query gettodoMany {todoMany(filter : {completed: true}) {description,completed}}';

        expect(transformString(createQueryForFilterSearch(modelName, prop, filterItems))).toBe(expected);
    });

    it('should return valid combinded query with boolean and string param ', () => {
        const modelName = 'todo';
        const prop = ['description', 'completed'];
        const filterItems = [
            { field: 'completed', operator: 'is', value: true, isString: false, hasGraphQLOperator: false },
            { field: 'description', operator: 'is', value: 'Test', isString: true, hasGraphQLOperator: false },
        ];

        const expected =
            'query gettodoMany {todoMany(filter : {completed: true,description: "Test"}) {description,completed}}';

        expect(transformString(createQueryForFilterSearch(modelName, prop, filterItems))).toEqual(expected);
    });

    it('should return valid  query with string param for operator contains', () => {
        const modelName = 'todo';
        const prop = ['description'];
        const filterItems = [
            { field: 'description', operator: 'contains', value: 'Test', isString: true, hasGraphQLOperator: false },
        ];

        const expected = 'query gettodoMany {todoMany(filter : {description_regex: "Test"}) {description}}';

        expect(transformString(createQueryForFilterSearch(modelName, prop, filterItems))).toEqual(expected);
    });
    it('should return valid  query with operator search', () => {
        const modelName = 'todo';
        const prop = ['number'];
        const filterItems = [
            { field: 'description', operator: 'lt', value: '1', isString: false, hasGraphQLOperator: true },
        ];

        const expected = 'query gettodoMany {todoMany(filter : {_operators: {description : {lt:1}}}) {number}}';

        expect(transformString(createQueryForFilterSearch(modelName, prop, filterItems))).toEqual(expected);
    });
});

export const transformString = (str: string): string => {
    return str.replace(/(\s{2,}|\r)/gm, '');
};
