import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        PanelMenuModule,
        AvatarModule,
        BadgeModule,
        ButtonModule
    ],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
    collapsed = false;
    menuItems: MenuItem[] = [
        {
            label: 'Dashboard',
            icon: 'pi pi-home',
            routerLink: ['/home']
        },
        {
            label: 'Ventas',
            icon: 'pi pi-shopping-cart',
            items: [
                {
                    label: 'Órdenes',
                    icon: 'pi pi-list',
                    routerLink: ['/home/ventas/ordenes'],
                    badge: '3'
                },
                {
                    label: 'Clientes',
                    icon: 'pi pi-users',
                    routerLink: ['/home/ventas/clientes']
                },
                {
                    label: 'Productos',
                    icon: 'pi pi-box',
                    routerLink: ['/home/ventas/productos']
                }
            ]
        },
        {
            label: 'Inventario',
            icon: 'pi pi-database',
            items: [
                {
                    label: 'Almacenes',
                    icon: 'pi pi-building',
                    routerLink: ['/home/inventario/almacenes']
                },
                {
                    label: 'Stock',
                    icon: 'pi pi-chart-bar',
                    routerLink: ['/home/inventario/stock']
                },
                {
                    label: 'Movimientos',
                    icon: 'pi pi-sync',
                    routerLink: ['/home/inventario/movimientos']
                }
            ]
        },
        {
            label: 'Finanzas',
            icon: 'pi pi-dollar',
            items: [
                {
                    label: 'Facturación',
                    icon: 'pi pi-file',
                    routerLink: ['/home/finanzas/facturacion']
                },
                {
                    label: 'Pagos',
                    icon: 'pi pi-credit-card',
                    routerLink: ['/home/finanzas/pagos']
                },
                {
                    label: 'Reportes',
                    icon: 'pi pi-chart-line',
                    routerLink: ['/home/finanzas/reportes']
                }
            ]
        },
        {
            label: 'Recursos Humanos',
            icon: 'pi pi-users',
            items: [
                {
                    label: 'Empleados',
                    icon: 'pi pi-user',
                    routerLink: ['/home/rrhh/empleados']
                },
                {
                    label: 'Nómina',
                    icon: 'pi pi-money-bill',
                    routerLink: ['/home/rrhh/nomina']
                },
                {
                    label: 'Asistencia',
                    icon: 'pi pi-calendar',
                    routerLink: ['/home/rrhh/asistencia']
                }
            ]
        },
        {
            label: 'Configuración',
            icon: 'pi pi-cog',
            items: [
                {
                    label: 'Perfil',
                    icon: 'pi pi-user-edit',
                    routerLink: ['/home/configuracion/perfil']
                },
                {
                    label: 'Empresa',
                    icon: 'pi pi-building',
                    routerLink: ['/home/configuracion/empresa']
                },
                {
                    label: 'Seguridad',
                    icon: 'pi pi-shield',
                    routerLink: ['/home/configuracion/seguridad']
                }
            ]
        }
    ];

    toggleSidebar() {
        this.collapsed = !this.collapsed;
    }

    logout() {
        // Lógica de cierre de sesión
        console.log('Logout clicked');
    }
}
