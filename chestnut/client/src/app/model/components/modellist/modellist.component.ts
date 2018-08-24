import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
    selector: 'app-modellist',
    templateUrl: './modellist.component.html',
    styleUrls: ['./modellist.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModellistComponent {
    @Input()
    displayedColumns: string[];

    @Input()
    dataSource: any[];
}
