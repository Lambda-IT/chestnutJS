export const filterProperties = ([data, prop]) =>
    Object.getOwnPropertyNames(data)
        .filter(p => prop.indexOf(p) > -1)
        .reduce((acc, curr) => ({ ...acc, [curr]: data[curr] }), {});
