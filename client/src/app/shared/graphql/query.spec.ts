import { createQueryForFilterSearch } from '@shared/graphql/queries';

describe('Tests the GrapshQL Queries', () => {
    it('should return valid query with string param', () => {
        const modelName = 'todo';
        const prop = ['description', 'completed'];
        const filterItems = [{ field: 'description', operator: 'is', value: '', isString: true }];

        const expected = `
        query gettodoMany {
            todoMany(filter : {description: ""}) {
            description, completed
            }
        }
    `;

        expect(createQueryForFilterSearch(modelName, prop, filterItems)).toBe(expected);
    });

    it('should return valid query with boolean param', () => {
        const modelName = 'todo';
        const prop = ['description', 'completed'];
        const filterItems = [{ field: 'completed', operator: 'is', value: true, isString: false }];

        const expected = `
        query gettodoMany {
            todoMany(filter : {completed: true}) {
            description, completed
            }
        }
    `;

        expect(createQueryForFilterSearch(modelName, prop, filterItems)).toBe(expected);
    });

    it('should return valid combinded query with boolean and string param ', () => {
        const modelName = 'todo';
        const prop = ['description', 'completed'];
        const filterItems = [
            { field: 'completed', operator: 'is', value: true, isString: false },
            { field: 'description', operator: 'is', value: 'Test', isString: true },
        ];

        const expected = `
        query gettodoMany {
            todoMany(filter : {completed: true,description: "Test"}) {
            description, completed
            }
        }
    `;

        expect(createQueryForFilterSearch(modelName, prop, filterItems)).toBe(expected);
    });
});
