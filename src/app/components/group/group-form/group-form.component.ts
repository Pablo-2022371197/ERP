import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../../services/auth.service';

export interface User {
    id: number;
    nombre: string;
    email: string;
    username: string;
    displayName?: string;
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
    selector: 'app-group-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        ButtonModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        MultiSelectModule,
        InputNumberModule,
        TooltipModule
    ],
    templateUrl: './group-form.component.html',
    styleUrls: ['./group-form.component.css']
})
export class GroupFormComponent implements OnChanges {
    @Input() visible = false;
    @Input() isEditMode = false;
    @Input() group: Partial<Group> | null = null;
    @Input() nivelOptions: any[] = [];
    @Input() availableUsers: User[] = [];

    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() onSave = new EventEmitter<Partial<Group>>();
    @Output() onCancel = new EventEmitter<void>();

    currentGroup: Partial<Group> = this.getEmptyGroup();
    selectedMembers: User[] = [];

    constructor(private authService: AuthService) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['group'] || changes['visible']) {
            if (this.visible) {
                if (this.isEditMode && this.group) {
                    this.currentGroup = JSON.parse(JSON.stringify(this.group));
                    // En modo edición, no pre-seleccionamos los miembros guardados
                    this.selectedMembers = [];
                } else {
                    // Modo creación: establecer usuario actual como autor y miembro
                    this.currentGroup = this.getEmptyGroup();
                    const currentUser = this.authService.getCurrentUser();
                    if (currentUser) {
                        this.currentGroup.autor = currentUser.name;
                        // Crear usuario actual como miembro del grupo
                        const currentUserAsMember: User = {
                            id: this.generateUserId(),
                            nombre: currentUser.name,
                            email: currentUser.email,
                            username: currentUser.username,
                            displayName: `${currentUser.name} (${currentUser.email})`
                        };
                        this.currentGroup.miembros = [currentUserAsMember];
                    }
                    this.selectedMembers = [];
                }
            }
        }

        // Añadir displayName para mostrar en el multiselect
        if (changes['availableUsers'] && this.availableUsers) {
            this.availableUsers = this.availableUsers.map(user => ({
                ...user,
                displayName: `${user.nombre} (${user.email})`
            }));
        }
    }

    private getEmptyGroup(): Partial<Group> {
        return {
            nombre: '',
            descripcion: '',
            nivel: '',
            autor: '',
            tickets: 0,
            miembros: []
        };
    }

    private generateUserId(): number {
        // Generar ID temporal basado en timestamp
        return Date.now();
    }

    getInitials(name: string): string {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
    }

    // Verificar si un miembro es el autor del grupo (en modo creación)
    isGroupAuthor(member: User): boolean {
        if (this.isEditMode) return false;
        const currentUser = this.authService.getCurrentUser();
        return currentUser !== null && member.email === currentUser.email;
    }

    // Filtrar usuarios para excluir los ya guardados en el grupo
    getFilteredUsers(): User[] {
        const savedMemberIds = (this.currentGroup.miembros || []).map(m => m.id);
        const currentUser = this.authService.getCurrentUser();
        return this.availableUsers.filter(user => {
            const isAlreadyMember = savedMemberIds.includes(user.id);
            // En modo creación, también excluir al usuario actual por email
            const isCurrentUser = !this.isEditMode && currentUser && user.email === currentUser.email;
            return !isAlreadyMember && !isCurrentUser;
        });
    }

    // Eliminar miembro de la lista guardada (solo en modo edición)
    removeMemberFromSaved(member: User) {
        // No permitir eliminar al autor del grupo
        const currentUser = this.authService.getCurrentUser();
        if (!this.isEditMode && currentUser && member.email === currentUser.email) {
            return; // No permitir eliminar al creador del grupo
        }
        if (this.currentGroup.miembros) {
            this.currentGroup.miembros = this.currentGroup.miembros.filter(m => m.id !== member.id);
        }
    }

    saveGroup() {
        if (this.currentGroup.nombre && this.currentGroup.autor && this.currentGroup.nivel) {
            // Combinar miembros guardados con nuevos seleccionados
            const allMembers = [
                ...(this.currentGroup.miembros || []),
                ...this.selectedMembers
            ];

            // Eliminar duplicados basándose en el ID
            const uniqueMembers = allMembers.filter((member, index, self) =>
                index === self.findIndex(m => m.id === member.id)
            );

            const groupData: Partial<Group> = {
                ...this.currentGroup,
                miembros: uniqueMembers,
                integrantes: uniqueMembers.length
            };
            this.onSave.emit(groupData);
        }
    }

    cancelForm() {
        this.selectedMembers = [];
        this.onCancel.emit();
    }

    closeDialog() {
        this.selectedMembers = [];
        this.visible = false;
        this.visibleChange.emit(false);
        this.onCancel.emit();
    }
}
