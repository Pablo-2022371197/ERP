import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

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
        TextareaModule
    ],
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent {
    displayEditDialog = false;
    editProfile: UserProfile = {} as UserProfile;

    userProfile: UserProfile = {
        name: 'John Pérez',
        email: 'john.perez@example.com',
        role: 'Administrador',
        department: 'Tecnología',
        phone: '+593 99 123 4567',
        joinDate: 'January 15, 2024',
        status: 'Active',
        address: 'Av. Principal 123, Edificio Centro',
        city: 'Quito',
        country: 'Ecuador',
        bio: 'Desarrollador Full Stack con más de 5 años de experiencia en tecnologías web y móviles.',
        linkedin: 'linkedin.com/in/johnperez',
        github: 'github.com/johnperez'
    };

    statusOptions = [
        { label: 'Activo', value: 'Active' },
        { label: 'Inactivo', value: 'Inactive' },
        { label: 'Vacaciones', value: 'Vacation' }
    ];

    departmentOptions = [
        { label: 'Tecnología', value: 'Tecnología' },
        { label: 'Recursos Humanos', value: 'Recursos Humanos' },
        { label: 'Finanzas', value: 'Finanzas' },
        { label: 'Marketing', value: 'Marketing' },
        { label: 'Operaciones', value: 'Operaciones' }
    ];

    roleOptions = [
        { label: 'Administrador', value: 'Administrador' },
        { label: 'Usuario', value: 'Usuario' },
        { label: 'Moderador', value: 'Moderador' },
        { label: 'Invitado', value: 'Invitado' }
    ];

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
        this.displayEditDialog = false;
    }

    cancelEdit() {
        this.displayEditDialog = false;
    }
}
