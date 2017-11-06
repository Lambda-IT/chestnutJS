import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'models-list',
    templateUrl: 'models-list.html',
    styleUrls: ['models-list.scss'],
})
export class ModelsListComponent {
    @Input() models: Models[];

    constructor() {}
}
