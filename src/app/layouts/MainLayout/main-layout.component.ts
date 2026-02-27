import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        SidebarComponent,
        ButtonModule,
        AvatarModule,
        BadgeModule,
        MenuModule
    ],
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
    sidebarCollapsed = false;
    mobileMenuOpen = false;

    userMenuItems: MenuItem[] = [
        {
            label: 'Perfil',
            icon: 'pi pi-user',
            command: () => this.goToProfile()
        },
        {
            label: 'Configuración',
            icon: 'pi pi-cog',
            command: () => this.goToSettings()
        },
        {
            separator: true
        },
        {
            label: 'Cerrar Sesión',
            icon: 'pi pi-sign-out',
            command: () => this.logout()
        }
    ];

    notificationItems: MenuItem[] = [
        {
            label: 'Nueva orden #1234',
            icon: 'pi pi-shopping-cart',
            badge: 'Nuevo',
            command: () => console.log('Order clicked')
        },
        {
            label: 'Stock bajo en producto X',
            icon: 'pi pi-exclamation-triangle',
            badge: 'Alerta',
            command: () => console.log('Alert clicked')
        },
        {
            label: 'Pago recibido',
            icon: 'pi pi-check-circle',
            badge: 'Info',
            command: () => console.log('Payment clicked')
        }
    ];

    toggleSidebar() {
        this.sidebarCollapsed = !this.sidebarCollapsed;
    }

    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
    }

    goToProfile() {
        console.log('Go to profile');
    }

    goToSettings() {
        console.log('Go to settings');
    }

    logout() {
        console.log('Logout');
        // Aquí implementarías la lógica de logout
    }
}
