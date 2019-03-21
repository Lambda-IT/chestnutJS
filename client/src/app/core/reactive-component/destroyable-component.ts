import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

export abstract class DestroyableComponent implements OnDestroy {
    protected onDestroy$ = new Subject();

    ngOnDestroy(): void {
        this.onDestroy$.next();
    }
}
