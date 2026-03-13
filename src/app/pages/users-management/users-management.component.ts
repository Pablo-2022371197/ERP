import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { IfHasPermissionDirective } from "../../directives/if-has-permission.directive";
import { PermissionsService } from '../../services/permissions.service';
import { UserManagementService, UserManagement } from '../../services/user-management.service';
import { UserViewComponent } from '../../components/user/user-view/user-view.component';
import { UserEditFormComponent } from '../../components/user/user-edit-form/user-edit-form.component';

@Component({
    selector: 'app-users-management',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CardModule,
        BadgeModule,
        ChipModule,
        TagModule,
        ButtonModule,
        TableModule,
        InputTextModule,
        DialogModule,
        IfHasPermissionDirective,
        UserViewComponent,
        UserEditFormComponent
    ],
    templateUrl: './users-management.component.html',
    styleUrls: ['./users-management.component.css']
})
export class UsersManagementComponent {
    totalUsers = 0;
    displayUserDialog = false;
    displayViewDialog = false;
    viewingUser: UserManagement | null = null;
    editingUser: UserManagement | null = null;

    users: UserManagement[] = [];

    constructor(
        private permissionsService: PermissionsService,
        private userManagementService: UserManagementService
    ) {
        this.loadUsers();
    }

    loadUsers() {
        this.userManagementService.getAllUsers().subscribe(users => {
            this.users = users;
            this.totalUsers = users.length;
        });
    }

    getInitials(name: string): string {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
    }

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

    viewUser(user: UserManagement) {
        this.viewingUser = { ...user };
        this.displayViewDialog = true;
    }

    editUser(user: UserManagement) {
        this.editingUser = { ...user };
        this.displayUserDialog = true;
    }

    onSaveUser(updatedUser: UserManagement) {
        if (updatedUser.id) {
            this.userManagementService.updateUser(updatedUser.id, updatedUser).subscribe(savedUser => {
                if (savedUser) {
                    this.loadUsers();
                    this.displayUserDialog = false;
                    this.editingUser = null;
                }
            });
        }
    }

    onCancelUserForm() {
        this.displayUserDialog = false;
        this.editingUser = null;
    }

    onCloseView() {
        this.displayViewDialog = false;
        this.viewingUser = null;
    }
}
