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
import { IfHasPermissionDirective } from "../../directives/if-has-permission.directive";
import { PermissionsService } from '../../services/permissions.service';
import { GroupViewComponent, Group as ViewGroup } from '../../components/group/group-view/group-view.component';
import { GroupFormComponent, Group as FormGroup, User } from '../../components/group/group-form/group-form.component';

// Usar tipo combinado de los componentes
type Group = ViewGroup & FormGroup;

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
        InputNumberModule,
        IfHasPermissionDirective,
        GroupViewComponent,
        GroupFormComponent
    ],
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.css']
})
export class GroupComponent {
    totalGroups = 42;
    displayGroupDialog = false;
    displayViewDialog = false;
    isEditMode = false;
    viewingGroup: Group | null = null;
    editingGroup: Partial<Group> | null = null;

    // Usuarios disponibles para agregar a grupos
    availableUsers: User[] = [
        { id: 1, nombre: 'Carlos Mendoza', email: 'carlos.mendoza@example.com', username: 'cmendoza' },
        { id: 2, nombre: 'María García', email: 'maria.garcia@example.com', username: 'mgarcia' },
        { id: 3, nombre: 'Ana Torres', email: 'ana.torres@example.com', username: 'atorres' },
        { id: 4, nombre: 'Juan López', email: 'juan.lopez@example.com', username: 'jlopez' },
        { id: 5, nombre: 'Pedro Sánchez', email: 'pedro.sanchez@example.com', username: 'psanchez' },
        { id: 6, nombre: 'Laura Ramírez', email: 'laura.ramirez@example.com', username: 'lramirez' },
        { id: 7, nombre: 'Roberto Díaz', email: 'roberto.diaz@example.com', username: 'rdiaz' },
        { id: 8, nombre: 'Carmen Ruiz', email: 'carmen.ruiz@example.com', username: 'cruiz' },
        { id: 9, nombre: 'Diego Moreno', email: 'diego.moreno@example.com', username: 'dmoreno' },
        { id: 10, nombre: 'Sofia Castro', email: 'sofia.castro@example.com', username: 'scastro' },
        { id: 11, nombre: 'Fernando Ortiz', email: 'fernando.ortiz@example.com', username: 'fortiz' },
        { id: 12, nombre: 'Patricia Vega', email: 'patricia.vega@example.com', username: 'pvega' },
    ];

    constructor(private permissionsService: PermissionsService) { }

    // Método para verificar permisos activos (útil para debugging)
    logActivePermissions() {
        console.log('Permisos activos:', this.permissionsService.getPermissions());
        console.log('¿Tiene groups_add?', this.permissionsService.hasPermission('groups_add'));
    }

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
            integrantes: 5,
            tickets: 45,
            descripcion: 'Equipo encargado del desarrollo de aplicaciones web y móviles',
            miembros: [
                { id: 1, nombre: 'Carlos Mendoza', email: 'carlos.mendoza@example.com', username: 'cmendoza' },
                { id: 2, nombre: 'María García', email: 'maria.garcia@example.com', username: 'mgarcia' },
                { id: 3, nombre: 'Ana Torres', email: 'ana.torres@example.com', username: 'atorres' },
                { id: 4, nombre: 'Juan López', email: 'juan.lopez@example.com', username: 'jlopez' },
                { id: 5, nombre: 'Pedro Sánchez', email: 'pedro.sanchez@example.com', username: 'psanchez' }
            ]
        },
        {
            id: 2,
            nivel: 'Intermedio',
            autor: 'María García',
            nombre: 'Design Team',
            integrantes: 3,
            tickets: 23,
            descripcion: 'Equipo de diseño UI/UX para todos los productos digitales',
            miembros: [
                { id: 2, nombre: 'María García', email: 'maria.garcia@example.com', username: 'mgarcia' },
                { id: 6, nombre: 'Laura Ramírez', email: 'laura.ramirez@example.com', username: 'lramirez' },
                { id: 8, nombre: 'Carmen Ruiz', email: 'carmen.ruiz@example.com', username: 'cruiz' }
            ]
        },
        {
            id: 3,
            nivel: 'Básico',
            autor: 'Juan López',
            nombre: 'Marketing Team',
            integrantes: 4,
            tickets: 67,
            descripcion: 'Equipo de marketing digital y estrategias de comunicación',
            miembros: [
                { id: 4, nombre: 'Juan López', email: 'juan.lopez@example.com', username: 'jlopez' },
                { id: 7, nombre: 'Roberto Díaz', email: 'roberto.diaz@example.com', username: 'rdiaz' },
                { id: 10, nombre: 'Sofia Castro', email: 'sofia.castro@example.com', username: 'scastro' },
                { id: 11, nombre: 'Fernando Ortiz', email: 'fernando.ortiz@example.com', username: 'fortiz' }
            ]
        },
        {
            id: 4,
            nivel: 'Avanzado',
            autor: 'Ana Torres',
            nombre: 'QA Team',
            integrantes: 2,
            tickets: 89,
            descripcion: 'Equipo de control de calidad y pruebas automatizadas',
            miembros: [
                { id: 3, nombre: 'Ana Torres', email: 'ana.torres@example.com', username: 'atorres' },
                { id: 9, nombre: 'Diego Moreno', email: 'diego.moreno@example.com', username: 'dmoreno' }
            ]
        },
        {
            id: 5,
            nivel: 'Intermedio',
            autor: 'Pedro Sánchez',
            nombre: 'DevOps Team',
            integrantes: 3,
            tickets: 34,
            descripcion: 'Equipo de infraestructura y despliegue continuo',
            miembros: [
                { id: 5, nombre: 'Pedro Sánchez', email: 'pedro.sanchez@example.com', username: 'psanchez' },
                { id: 1, nombre: 'Carlos Mendoza', email: 'carlos.mendoza@example.com', username: 'cmendoza' },
                { id: 9, nombre: 'Diego Moreno', email: 'diego.moreno@example.com', username: 'dmoreno' }
            ]
        },
        {
            id: 6,
            nivel: 'Avanzado',
            autor: 'Laura Ramírez',
            nombre: 'Data Science Team',
            integrantes: 2,
            tickets: 28,
            descripcion: 'Equipo de análisis de datos y machine learning',
            miembros: [
                { id: 6, nombre: 'Laura Ramírez', email: 'laura.ramirez@example.com', username: 'lramirez' },
                { id: 12, nombre: 'Patricia Vega', email: 'patricia.vega@example.com', username: 'pvega' }
            ]
        },
        {
            id: 7,
            nivel: 'Básico',
            autor: 'Roberto Díaz',
            nombre: 'Support Team',
            integrantes: 3,
            tickets: 156,
            descripcion: 'Equipo de soporte técnico y atención al cliente',
            miembros: [
                { id: 7, nombre: 'Roberto Díaz', email: 'roberto.diaz@example.com', username: 'rdiaz' },
                { id: 10, nombre: 'Sofia Castro', email: 'sofia.castro@example.com', username: 'scastro' },
                { id: 11, nombre: 'Fernando Ortiz', email: 'fernando.ortiz@example.com', username: 'fortiz' }
            ]
        },
        {
            id: 8,
            nivel: 'Intermedio',
            autor: 'Carmen Ruiz',
            nombre: 'Product Team',
            integrantes: 2,
            tickets: 42,
            descripcion: 'Equipo de gestión de producto y roadmap',
            miembros: [
                { id: 8, nombre: 'Carmen Ruiz', email: 'carmen.ruiz@example.com', username: 'cruiz' },
                { id: 2, nombre: 'María García', email: 'maria.garcia@example.com', username: 'mgarcia' }
            ]
        },
        {
            id: 9,
            nivel: 'Avanzado',
            autor: 'Diego Moreno',
            nombre: 'Security Team',
            integrantes: 2,
            tickets: 19,
            descripcion: 'Equipo de seguridad informática y auditorías',
            miembros: [
                { id: 9, nombre: 'Diego Moreno', email: 'diego.moreno@example.com', username: 'dmoreno' },
                { id: 1, nombre: 'Carlos Mendoza', email: 'carlos.mendoza@example.com', username: 'cmendoza' }
            ]
        },
        {
            id: 10,
            nivel: 'Básico',
            autor: 'Sofia Castro',
            nombre: 'HR Team',
            integrantes: 2,
            tickets: 31,
            descripcion: 'Equipo de recursos humanos y gestión del talento',
            miembros: [
                { id: 10, nombre: 'Sofia Castro', email: 'sofia.castro@example.com', username: 'scastro' },
                { id: 12, nombre: 'Patricia Vega', email: 'patricia.vega@example.com', username: 'pvega' }
            ]
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
        this.isEditMode = false;
        this.editingGroup = null;
        this.displayGroupDialog = true;
    }

    viewGroup(group: Group) {
        this.viewingGroup = group;
        this.displayViewDialog = true;
    }

    editGroup(group: Group) {
        this.isEditMode = true;
        this.editingGroup = group;
        this.displayGroupDialog = true;
    }

    deleteGroup(group: Group) {
        if (confirm(`¿Estás seguro de que deseas eliminar el grupo "${group.nombre}"?`)) {
            this.groups = this.groups.filter(g => g.id !== group.id);
            this.totalGroups--;
        }
    }

    onSaveGroup(groupData: Partial<Group>) {
        if (this.isEditMode && this.editingGroup) {
            // Actualizar grupo existente
            const index = this.groups.findIndex(g => g.id === this.editingGroup!.id);
            if (index !== -1) {
                this.groups[index] = {
                    ...this.groups[index],
                    ...groupData,
                    integrantes: groupData.miembros?.length || 0
                };
            }
        } else {
            // Crear nuevo grupo
            const newId = Math.max(...this.groups.map(g => g.id), 0) + 1;
            const newGroup: Group = {
                id: newId,
                nombre: groupData.nombre!,
                descripcion: groupData.descripcion || '',
                nivel: groupData.nivel!,
                autor: groupData.autor!,
                tickets: 0,
                integrantes: groupData.miembros?.length || 0,
                miembros: groupData.miembros || []
            };
            this.groups = [...this.groups, newGroup];
            this.totalGroups++;
        }
        this.displayGroupDialog = false;
        this.editingGroup = null;
    }

    onCancelGroupForm() {
        this.displayGroupDialog = false;
        this.editingGroup = null;
    }

    onCloseView() {
        this.displayViewDialog = false;
        this.viewingGroup = null;
    }
}
