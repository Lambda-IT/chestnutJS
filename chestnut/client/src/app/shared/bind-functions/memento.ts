export interface Memento<T> {
    createMemento(): void;
    restoreMemento(): void;
    state(): T;
}

export const unit = <T>(source: T): Memento<T> => {
    let state: T = JSON.parse(JSON.stringify(source));
    let memento: T;
    return {
        createMemento() {
            memento = JSON.parse(JSON.stringify(state));
        },
        restoreMemento() {
            state = JSON.parse(JSON.stringify(memento));
        },
        state() {
            return state;
        },
    };
};
