import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { IfHasPermissionDirective } from '../../../directives/if-has-permission.directive';
import { Group } from '../../../services/group.service';

export interface FilterOptions {
    estado: string | null;
    prioridad: string | null;
}

@Component({
    selector: 'app-ticket-filters',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        SelectModule,
        ToggleSwitchModule,
        ButtonModule,
        BadgeModule,
        TooltipModule,
        IfHasPermissionDirective
    ],
    templateUrl: './ticket-filters.component.html',
    styleUrls: ['./ticket-filters.component.css']
})
export class TicketFiltersComponent {
    @Input() userGroups: Group[] = [];
    @Input() selectedGroup: Group | null = null;
    @Input() isKanbanView: boolean = false;
    @Input() filterOptions: FilterOptions = {
        estado: null,
        prioridad: null
    };

    @Output() groupChange = new EventEmitter<Group | null>();
    @Output() viewModeChange = new EventEmitter<boolean>();
    @Output() filterChange = new EventEmitter<FilterOptions>();
    @Output() clearFiltersClick = new EventEmitter<void>();
    @Output() createTicketClick = new EventEmitter<void>();

    estadoOptions = [
        { label: 'Todos', value: null },
        { label: 'Pendiente', value: 'Pendiente' },
        { label: 'En progreso', value: 'En progreso' },
        { label: 'Revisión', value: 'Revisión' },
        { label: 'Finalizado', value: 'Finalizado' }
    ];

    prioridadOptions = [
        { label: 'Todas', value: null },
        { label: 'Alta', value: 'Alta' },
        { label: 'Media', value: 'Media' },
        { label: 'Baja', value: 'Baja' }
    ];

    onGroupChange(group: Group | null) {
        this.selectedGroup = group;
        this.groupChange.emit(group);
    }

    onViewToggle() {
        // Emitir el nuevo valor del toggle
        this.viewModeChange.emit(this.isKanbanView);
    }

    onFilterChange() {
        this.filterChange.emit(this.filterOptions);
    }

    clearFilters() {
        this.clearFiltersClick.emit();
    }

    createTicket() {
        this.createTicketClick.emit();
    }
}
