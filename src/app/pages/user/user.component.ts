import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-user',
    standalone: true,
    imports: [CommonModule, AvatarModule, ButtonModule],
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent {
    userProfile = {
        name: 'John Pérez',
        email: 'john.perez@example.com',
        role: 'Administrador',
        department: 'Tecnología',
        phone: '+593 99 123 4567',
        joinDate: 'January 15, 2024',
        status: 'Active'
    };

    get userInitials(): string {
        return this.userProfile.name
            .split(' ')
            .map(n => n[0])
            .join('');
    }
}
