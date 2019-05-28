import { OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { ConnectableObservable, Observable, Observer } from 'rxjs';
import { filter, map, publishReplay, refCount } from 'rxjs/operators';
import { DestroyableComponent } from './destroyable-component';

export interface TypedSimpleChange<T> {
    previousValue: T;
    currentValue: T;
}

export abstract class ReactiveComponent<T> extends DestroyableComponent implements OnChanges {
    private changesObserver: Observer<{ [key: string]: SimpleChange }>;
    protected changes$: ConnectableObservable<{ [key: string]: SimpleChange }>;

    constructor() {
        super();

        this.changes$ = Observable.create(
            (observer: Observer<{ [key: string]: SimpleChange }>) => (this.changesObserver = observer)
        ).pipe(publishReplay(1));
        this.changes$.connect();
    }

    observeProperty<K extends keyof T>(propertyName: K): Observable<TypedSimpleChange<T[K]>> {
        return this.changes$.pipe(
            filter(changes => changes.hasOwnProperty(propertyName)),
            map((changes: any) => changes[propertyName]),
            publishReplay(1),
            refCount()
        );
    }

    observePropertyCurrentValue<K extends keyof T>(propertyName: K): Observable<T[K]> {
        return this.observeProperty<K>(propertyName).pipe(
            map(change => change.currentValue),
            publishReplay(1),
            refCount()
        );
    }

    observePropertyCurrentNotNullValue<K extends keyof T>(propertyName: K): Observable<T[K]> {
        return this.observeProperty<K>(propertyName).pipe(
            map(change => change.currentValue),
            filter(x => x !== null),
            publishReplay(1),
            refCount()
        );
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.changesObserver.next(changes);
    }
}
