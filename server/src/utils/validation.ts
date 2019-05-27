export function isNull(value: any): boolean {
    // undefined equals to null with == but not ===
    return value == null;
}

export function isEmpty(obj: Object): boolean {
    // most efficient way to check for properties
    // tslint:disable-next-line:forin
    for (const _ in obj) {
        return false;
    }
    return true;
}

export function isNullOrEmpty(obj: Object): boolean {
    return isNull(obj) || isEmpty(obj);
}
