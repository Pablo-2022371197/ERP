import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { ChipModule } from 'primeng/chip';
import { BadgeModule } from 'primeng/badge';
import permissionsData from '../../../services/permissions.mock.json';

interface UserManagement {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    department: string;
    permissions: string[];
}

interface PermissionOption {
    label: string;
    value: string;
    category: string;
}

@Component({
    selector: 'app-user-edit-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        ButtonModule,
        InputTextModule,
        MultiSelectModule,
        TooltipModule,
        ChipModule,
        BadgeModule
    ],
    templateUrl: './user-edit-form.component.html',
    styleUrls: ['./user-edit-form.component.css']
})
export class UserEditFormComponent implements OnChanges {
    @Input() visible = false;
    @Input() user: UserManagement | null = null;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() onSave = new EventEmitter<UserManagement>();
    @Output() onCancel = new EventEmitter<void>();

    currentUser: UserManagement | null = null;
    selectedPermissions: string[] = [];
    availablePermissions: PermissionOption[] = [];

    ngOnChanges(changes: SimpleChanges) {
        if (changes['user'] || changes['visible']) {
            if (this.visible && this.user) {
                this.currentUser = JSON.parse(JSON.stringify(this.user));
                this.selectedPermissions = [...this.user.permissions];
                this.loadAvailablePermissions();
            }
        }
    }

    private loadAvailablePermissions() {
        this.availablePermissions = permissionsData.permissions.map(permission => ({
            label: permission,
            value: permission,
            category: this.getPermissionCategory(permission)
        }));
    }

    getPermissionCategory(permission: string): string {
        if (permission.includes('group')) return 'Grupos';
        if (permission.includes('user')) return 'Usuarios';
        if (permission.includes('ticket')) return 'Tickets';
        return 'Otros';
    }

    getCategoryIcon(category: string): string {
        switch (category) {
            case 'Grupos': return 'pi-users';
            case 'Usuarios': return 'pi-user';
            case 'Tickets': return 'pi-ticket';
            default: return 'pi-cog';
        }
    }

    getInitials(name: string): string {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
    }

    groupPermissionsByCategory(): { [key: string]: string[] } {
        if (!this.selectedPermissions || this.selectedPermissions.length === 0) return {};

        const grouped: { [key: string]: string[] } = {};
        this.selectedPermissions.forEach(permission => {
            const category = this.getPermissionCategory(permission);
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(permission);
        });
        return grouped;
    }

    removePermission(permission: string) {
        this.selectedPermissions = this.selectedPermissions.filter(p => p !== permission);
    }

    saveUser() {
        if (this.currentUser) {
            const updatedUser: UserManagement = {
                ...this.currentUser,
                permissions: [...this.selectedPermissions]
            };
            this.onSave.emit(updatedUser);
        }
    }

    cancelForm() {
        this.selectedPermissions = [];
        this.onCancel.emit();
    }

    closeDialog() {
        this.selectedPermissions = [];
        this.visible = false;
        this.visibleChange.emit(false);
        this.onCancel.emit();
    }
}
