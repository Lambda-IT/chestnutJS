import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-modellist',
    templateUrl: './modellist.component.html',
    styleUrls: ['./modellist.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModellistComponent {
    displayedColumns: string[] = ['description', 'completed', '_id'];
    dataSource = [
        { description: 'This is a TODO', completed: false, _id: '5b647343c95f8b3390a118bb' },
        { description: 'This is another TODO', completed: true, _id: '5b647343c95f8b3390a118bc' },
    ];
}
