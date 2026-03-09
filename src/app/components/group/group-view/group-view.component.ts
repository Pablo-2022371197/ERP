import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { TabsModule } from 'primeng/tabs';

interface User {
    id: number;
    nombre: string;
    email: string;
    username: string;
}

export interface Group {
    id: number;
    nivel: string;
    autor: string;
    nombre: string;
    integrantes: number;
    tickets: number;
    descripcion: string;
    miembros: User[];
}

@Component({
    selector: 'app-group-view',
    standalone: true,
    imports: [
        CommonModule,
        DialogModule,
        ButtonModule,
        TagModule,
        BadgeModule,
        TabsModule
    ],
    templateUrl: './group-view.component.html',
    styleUrls: ['./group-view.component.css']
})
export class GroupViewComponent {
    @Input() visible = false;
    @Input() group: Group | null = null;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() onClose = new EventEmitter<void>();

    getNivelSeverity(nivel: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        switch (nivel) {
            case 'Avanzado':
                return 'success';
            case 'Intermedio':
                return 'info';
            case 'Básico':
                return 'warn';
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

    closeView() {
        this.visible = false;
        this.visibleChange.emit(false);
        this.onClose.emit();
    }
}
