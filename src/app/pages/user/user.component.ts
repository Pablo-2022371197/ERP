import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { IfHasPermissionDirective } from '../../directives/if-has-permission.directive';
import { AuthService } from '../../services/auth.service';
import usersData from '../../services/users.mock.json';

interface UserProfile {
    name: string;
    email: string;
    role: string;
    department: string;
    phone: string;
    joinDate: string;
    status: string;
    address: string;
    city: string;
    country: string;
    bio: string;
    linkedin: string;
    github: string;
}

@Component({
    selector: 'app-user',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AvatarModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        SelectModule,
        TextareaModule,
        IfHasPermissionDirective
    ],
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent {
    displayEditDialog = false;
    editProfile: UserProfile = {} as UserProfile;
    userProfile: UserProfile = {} as UserProfile;

    // Cargar las opciones desde el JSON
    statusOptions = usersData.statusOptions;
    departmentOptions = usersData.departmentOptions;
    roleOptions = usersData.roleOptions;

    constructor(private authService: AuthService) {
        this.loadUserProfile();
    }

    private loadUserProfile(): void {
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
            this.userProfile = {
                name: currentUser.name,
                email: currentUser.email,
                role: currentUser.role,
                department: currentUser.department,
                phone: currentUser.phone,
                joinDate: currentUser.joinDate,
                status: currentUser.status,
                address: currentUser.address,
                city: currentUser.city,
                country: currentUser.country,
                bio: currentUser.bio,
                linkedin: currentUser.linkedin,
                github: currentUser.github
            };
        }
    }

    get userInitials(): string {
        return this.userProfile.name
            .split(' ')
            .map(n => n[0])
            .join('');
    }

    openEditDialog() {
        this.editProfile = { ...this.userProfile };
        this.displayEditDialog = true;
    }

    saveProfile() {
        this.userProfile = { ...this.editProfile };

        // Actualizar la sesión con los nuevos datos
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
            this.authService.login({
                ...currentUser,
                name: this.userProfile.name,
                email: this.userProfile.email,
                role: this.userProfile.role,
                department: this.userProfile.department,
                phone: this.userProfile.phone,
                status: this.userProfile.status,
                address: this.userProfile.address,
                city: this.userProfile.city,
                country: this.userProfile.country,
                bio: this.userProfile.bio,
                linkedin: this.userProfile.linkedin,
                github: this.userProfile.github
            });
        }

        this.displayEditDialog = false;
    }

    cancelEdit() {
        this.displayEditDialog = false;
    }
}
