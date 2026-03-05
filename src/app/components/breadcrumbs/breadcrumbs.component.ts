import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-breadcrumbs',
    standalone: true,
    imports: [CommonModule, BreadcrumbModule],
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnInit {
    breadcrumbItems: MenuItem[] = [];
    home: MenuItem = {
        icon: 'pi pi-home',
        routerLink: '/home',
        label: 'Home'
    };

    private routeLabels: { [key: string]: string } = {
        'home': 'Home',
        'group': 'Grupos',
        'user': 'Usuarios'
    };

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        this.updateBreadcrumbs();

        // Actualizar breadcrumbs en cada cambio de ruta
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                this.updateBreadcrumbs();
            });
    }

    private updateBreadcrumbs() {
        const url = this.router.url;
        const segments = url.split('/').filter(segment => segment);

        this.breadcrumbItems = [];

        segments.forEach((segment, index) => {
            // Evitar duplicar 'home' cuando estamos en la ruta /home
            if (segment === 'home' && segments.length === 1) {
                return;
            }

            const routePath = '/' + segments.slice(0, index + 1).join('/');
            const label = this.routeLabels[segment] || this.capitalize(segment);

            this.breadcrumbItems.push({
                label: label,
                routerLink: routePath
            });
        });
    }

    private capitalize(text: string): string {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
}
