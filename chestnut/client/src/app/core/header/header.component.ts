import { Component, EventEmitter, Output, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
    @Input() isAuthenticated: boolean;
    @Output() logoutClicked = new EventEmitter();
    @Output() loginClicked = new EventEmitter();

    navigationSideMenu = [{ label: 'Label 1' }, { label: 'Label2'}];
    navigation = [{ label: 'Home', link: '/home' }, { label: 'About', link: 'static/about' }, { label: 'Catalog', link: '/catalog' }];
}
