export interface Mementoable<T> {
    state: T;
    createMemento(): T;
    restoreMemento(memento: T): Mementoable<T>;
}

export const unit = <T>(source: T): Mementoable<T> => {
    let state: T = JSON.parse(JSON.stringify(source));
    const that = {
        createMemento() {
            return JSON.parse(JSON.stringify(state));
        },
        restoreMemento(memento: T) {
            state = JSON.parse(JSON.stringify(memento));
            return that;
        },
        get state() {
            return state;
        },
    };

    return that;
};
