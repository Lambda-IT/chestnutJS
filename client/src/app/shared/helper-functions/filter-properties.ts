export const filterProperties = ([data, prop]) => filterProps(prop, data);

export const filterProps = (prop, data) => {
    return Object.getOwnPropertyNames(data)
        .filter(p => prop.map(pr => pr.name).indexOf(p) > -1)
        .map(p => {
            const index = prop.map(pr => pr.name).indexOf(p);
            if (index > -1) {
                const bb = prop[index];
                if (bb.properties && bb.properties.length > 0) {
                    return { name: p, value: filterProps(bb.properties, data[p]) };
                }
            }
            return { name: p, value: data[p] };
        })
        .reduce((acc, curr) => ({ ...acc, [curr.name]: curr.value }), {});
};
