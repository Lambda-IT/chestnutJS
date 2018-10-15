import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromModels from '../../reducers';
import * as models from '../../models/actions/models.actions';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
})
export class AppComponent {
    constructor(private store: Store<fromModels.State>) {
        this.store.dispatch(new models.LoadModels());
    }
}
