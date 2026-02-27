import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule
    ],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
    collapsed = false;
    projectName = 'ERP System';
    appVersion = '0.0.0';

    toggleSidebar() {
        this.collapsed = !this.collapsed;
    }
}
