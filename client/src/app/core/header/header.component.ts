import { Component, EventEmitter, Output, ChangeDetectionStrategy, Input } from '@angular/core';
import { HeaderModel } from '../../login/login.model';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
    @Input() model: HeaderModel;
    @Output() logoutClicked = new EventEmitter();

    navigation = [{ label: 'Catalog', link: '../catalog' }];
}
