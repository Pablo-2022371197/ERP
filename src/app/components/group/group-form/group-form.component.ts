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

    ngOnChanges(changes: SimpleChanges) {
        if (changes['group'] && this.group) {
            if (this.isEditMode) {
                this.currentGroup = JSON.parse(JSON.stringify(this.group));
                // En modo edición, no pre-seleccionamos los miembros guardados
                this.selectedMembers = [];
            } else {
                this.currentGroup = this.getEmptyGroup();
                this.selectedMembers = [];
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

    getInitials(name: string): string {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
    }

    // Filtrar usuarios para excluir los ya guardados en el grupo
    getFilteredUsers(): User[] {
        const savedMemberIds = (this.currentGroup.miembros || []).map(m => m.id);
        return this.availableUsers.filter(user => !savedMemberIds.includes(user.id));
    }

    // Eliminar miembro de la lista guardada (solo en modo edición)
    removeMemberFromSaved(member: User) {
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
