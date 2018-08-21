import { Component } from '@angular/core';

@Component({
    selector: 'app-modellist',
    templateUrl: './modellist.component.html',
    styleUrls: ['./modellist.component.scss'],
})
export class ModellistComponent {
    displayedColumns: string[] = ['description', 'completed', '_id'];
    dataSource = [
        { description: 'This is a TODO', completed: false, _id: '024534ad5' },
        { description: 'This is another TODO', completed: true, _id: '024d14ad5' },
    ];
}
