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
import { GroupService, Group as ServiceGroup, User as ServiceUser } from '../../services/group.service';
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
    totalGroups = 0;
    displayGroupDialog = false;
    displayViewDialog = false;
    isEditMode = false;
    viewingGroup: Group | null = null;
    editingGroup: Partial<Group> | null = null;

    // Usuarios disponibles para agregar a grupos (se poblará desde los grupos existentes)
    availableUsers: User[] = [];

    constructor(
        private permissionsService: PermissionsService,
        private groupService: GroupService
    ) {
        this.loadGroups();
    }

    loadGroups() {
        this.groupService.getAllGroups().subscribe(groups => {
            this.groups = groups;
            this.totalGroups = groups.length;
            // Extraer usuarios únicos de todos los grupos
            this.extractAvailableUsers();
        });
    }

    extractAvailableUsers() {
        const usersMap = new Map<number, User>();
        this.groups.forEach(group => {
            group.miembros.forEach(user => {
                usersMap.set(user.id, user);
            });
        });
        this.availableUsers = Array.from(usersMap.values());
    }

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

    groups: Group[] = [];

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
            this.groupService.deleteGroup(group.id).subscribe(success => {
                if (success) {
                    this.loadGroups(); // Recargar desde el servicio
                }
            });
        }
    }

    onSaveGroup(groupData: Partial<Group>) {
        if (this.isEditMode && this.editingGroup) {
            // Actualizar grupo existente usando el servicio
            this.groupService.updateGroup(this.editingGroup.id!, groupData).subscribe(updatedGroup => {
                if (updatedGroup) {
                    this.loadGroups(); // Recargar desde el servicio
                }
            });
        } else {
            // Crear nuevo grupo usando el servicio
            const newGroupData = {
                nombre: groupData.nombre!,
                descripcion: groupData.descripcion || '',
                nivel: groupData.nivel!,
                autor: groupData.autor!,
                tickets: 0,
                integrantes: groupData.miembros?.length || 0,
                miembros: groupData.miembros || []
            };
            this.groupService.createGroup(newGroupData).subscribe(newGroup => {
                this.loadGroups(); // Recargar desde el servicio
            });
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
