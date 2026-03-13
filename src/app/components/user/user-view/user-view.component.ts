import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { TabsModule } from 'primeng/tabs';
import { ChipModule } from 'primeng/chip';

interface UserManagement {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    department: string;
    permissions: string[];
}

@Component({
    selector: 'app-user-view',
    standalone: true,
    imports: [
        CommonModule,
        DialogModule,
        ButtonModule,
        TagModule,
        BadgeModule,
        TabsModule,
        ChipModule
    ],
    templateUrl: './user-view.component.html',
    styleUrls: ['./user-view.component.css']
})
export class UserViewComponent {
    @Input() visible = false;
    @Input() user: UserManagement | null = null;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() onClose = new EventEmitter<void>();

    getRoleSeverity(role: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        switch (role) {
            case 'Administrador':
                return 'danger';
            case 'Moderador':
                return 'warn';
            case 'Usuario':
                return 'info';
            default:
                return 'secondary';
        }
    }

    getInitials(name: string): string {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
    }

    getPermissionCategory(permission: string): string {
        if (permission.includes('group')) return 'Grupos';
        if (permission.includes('user')) return 'Usuarios';
        if (permission.includes('ticket')) return 'Tickets';
        return 'Otros';
    }

    groupPermissionsByCategory(): { [key: string]: string[] } {
        if (!this.user || !this.user.permissions) return {};

        const grouped: { [key: string]: string[] } = {};
        this.user.permissions.forEach(permission => {
            const category = this.getPermissionCategory(permission);
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(permission);
        });
        return grouped;
    }

    getCategoryIcon(category: string): string {
        switch (category) {
            case 'Grupos': return 'pi-users';
            case 'Usuarios': return 'pi-user';
            case 'Tickets': return 'pi-ticket';
            default: return 'pi-cog';
        }
    }

    getCategorySeverity(category: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        switch (category) {
            case 'Grupos': return 'success';
            case 'Usuarios': return 'warn';
            case 'Tickets': return 'info';
            default: return 'secondary';
        }
    }

    closeView() {
        this.visible = false;
        this.visibleChange.emit(false);
        this.onClose.emit();
    }
}
