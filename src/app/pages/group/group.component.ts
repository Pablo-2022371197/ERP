import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';

interface Group {
    id: number;
    nivel: string;
    autor: string;
    nombre: string;
    integrantes: number;
    tickets: number;
    descripcion: string;
}

@Component({
    selector: 'app-group',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CardModule,
        BadgeModule,
        ChipModule,
        TagModule,
        ProgressBarModule,
        ButtonModule,
        TableModule,
        InputTextModule,
        DialogModule,
        SelectModule,
        TextareaModule,
        InputNumberModule
    ],
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.css']
})
export class GroupComponent {
    totalGroups = 42;
    displayNewGroupDialog = false;

    newGroup: Partial<Group> = {
        nivel: '',
        autor: '',
        nombre: '',
        integrantes: 0,
        tickets: 0,
        descripcion: ''
    };

    nivelOptions = [
        { label: 'Avanzado', value: 'Avanzado' },
        { label: 'Intermedio', value: 'Intermedio' },
        { label: 'Básico', value: 'Básico' }
    ];

    groups: Group[] = [
        {
            id: 1,
            nivel: 'Avanzado',
            autor: 'Carlos Mendoza',
            nombre: 'Development Team',
            integrantes: 12,
            tickets: 45,
            descripcion: 'Equipo encargado del desarrollo de aplicaciones web y móviles'
        },
        {
            id: 2,
            nivel: 'Intermedio',
            autor: 'María García',
            nombre: 'Design Team',
            integrantes: 8,
            tickets: 23,
            descripcion: 'Equipo de diseño UI/UX para todos los productos digitales'
        },
        {
            id: 3,
            nivel: 'Básico',
            autor: 'Juan López',
            nombre: 'Marketing Team',
            integrantes: 15,
            tickets: 67,
            descripcion: 'Equipo de marketing digital y estrategias de comunicación'
        },
        {
            id: 4,
            nivel: 'Avanzado',
            autor: 'Ana Torres',
            nombre: 'QA Team',
            integrantes: 6,
            tickets: 89,
            descripcion: 'Equipo de control de calidad y pruebas automatizadas'
        },
        {
            id: 5,
            nivel: 'Intermedio',
            autor: 'Pedro Sánchez',
            nombre: 'DevOps Team',
            integrantes: 4,
            tickets: 34,
            descripcion: 'Equipo de infraestructura y despliegue continuo'
        },
        {
            id: 6,
            nivel: 'Avanzado',
            autor: 'Laura Ramírez',
            nombre: 'Data Science Team',
            integrantes: 7,
            tickets: 28,
            descripcion: 'Equipo de análisis de datos y machine learning'
        },
        {
            id: 7,
            nivel: 'Básico',
            autor: 'Roberto Díaz',
            nombre: 'Support Team',
            integrantes: 10,
            tickets: 156,
            descripcion: 'Equipo de soporte técnico y atención al cliente'
        },
        {
            id: 8,
            nivel: 'Intermedio',
            autor: 'Carmen Ruiz',
            nombre: 'Product Team',
            integrantes: 5,
            tickets: 42,
            descripcion: 'Equipo de gestión de producto y roadmap'
        },
        {
            id: 9,
            nivel: 'Avanzado',
            autor: 'Diego Moreno',
            nombre: 'Security Team',
            integrantes: 3,
            tickets: 19,
            descripcion: 'Equipo de seguridad informática y auditorías'
        },
        {
            id: 10,
            nivel: 'Básico',
            autor: 'Sofia Castro',
            nombre: 'HR Team',
            integrantes: 6,
            tickets: 31,
            descripcion: 'Equipo de recursos humanos y gestión del talento'
        }
    ];

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
            .join('');
    }

    openNewGroupDialog() {
        this.newGroup = {
            nivel: '',
            autor: '',
            nombre: '',
            integrantes: 0,
            tickets: 0,
            descripcion: ''
        };
        this.displayNewGroupDialog = true;
    }

    saveNewGroup() {
        if (this.newGroup.nombre && this.newGroup.autor && this.newGroup.nivel) {
            const newId = Math.max(...this.groups.map(g => g.id)) + 1;
            this.groups = [
                ...this.groups,
                {
                    id: newId,
                    nivel: this.newGroup.nivel!,
                    autor: this.newGroup.autor!,
                    nombre: this.newGroup.nombre!,
                    integrantes: this.newGroup.integrantes || 0,
                    tickets: this.newGroup.tickets || 0,
                    descripcion: this.newGroup.descripcion || ''
                }
            ];
            this.totalGroups++;
            this.displayNewGroupDialog = false;
        }
    }

    cancelNewGroup() {
        this.displayNewGroupDialog = false;
    }
}
