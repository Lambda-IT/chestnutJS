import { Action } from '@ngrx/store';
import { Observable, merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DestroyableComponent } from './destroyable-component';

export abstract class ContainerComponent extends DestroyableComponent {
    constructor(private _dispatch: (action: Action) => void) {
        super();
    }

    dispatch(...o: Observable<Action>[]) {
        merge(...o)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(action => this._dispatch(action));
    }
}
