import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { IfHasPermissionDirective } from '../../directives/if-has-permission.directive';
import { GroupService, Group } from '../../services/group.service';
import { TicketService, Ticket } from '../../services/ticket.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CardModule,
        TableModule,
        ButtonModule,
        TagModule,
        BadgeModule,
        SelectModule,
        InputTextModule,
        ToggleSwitchModule,
        IfHasPermissionDirective
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    // Usuario actual (simulado)
    currentUser = 'Carlos Mendoza';

    // Grupos del usuario
    userGroups: Group[] = [];
    selectedGroup: Group | null = null;

    // Tickets
    allUserTickets: Ticket[] = [];
    displayedTickets: Ticket[] = [];
    recentTickets: Ticket[] = [];

    // Contadores
    totalTickets = 0;
    ticketsByStatus: { [key: string]: number } = {};

    // Filtros y ordenamiento
    filterOptions = {
        estado: null as string | null,
        prioridad: null as string | null,
        ordenarPor: 'fechaCreacion' as 'fechaCreacion' | 'fechaLimite' | 'prioridad' | 'estado'
    };

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

    ordenarOptions = [
        { label: 'Fecha de Creación', value: 'fechaCreacion' },
        { label: 'Fecha Límite', value: 'fechaLimite' },
        { label: 'Prioridad', value: 'prioridad' },
        { label: 'Estado', value: 'estado' }
    ];

    // Vista: true = Kanban, false = Lista
    isKanbanView = false;

    constructor(
        private groupService: GroupService,
        private ticketService: TicketService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadUserData();
    }

    loadUserData() {
        // Cargar grupos del usuario
        this.groupService.getUserGroups().subscribe(groups => {
            this.userGroups = groups;

            // Obtener los IDs de los grupos del usuario
            const groupIds = groups.map(g => g.id);

            // Cargar todos los tickets de los grupos del usuario
            this.ticketService.getTicketsByGroupIds(groupIds).subscribe(tickets => {
                this.allUserTickets = tickets;
                this.displayedTickets = tickets;
                this.totalTickets = tickets.length;
                this.calculateTicketsByStatus(tickets);
            });

            // Cargar tickets recientes asignados al usuario
            this.ticketService.getRecentTicketsByUser(this.currentUser, 5).subscribe(tickets => {
                this.recentTickets = tickets;
            });
        });
    }

    onGroupSelect(group: Group) {
        this.selectedGroup = group;

        // Cargar tickets del grupo seleccionado
        this.ticketService.getTicketsByGroupId(group.id).subscribe(tickets => {
            this.displayedTickets = tickets;
            this.totalTickets = tickets.length;
            this.calculateTicketsByStatus(tickets);
            this.applyFilters();
        });
    }

    calculateTicketsByStatus(tickets: Ticket[]) {
        this.ticketsByStatus = this.ticketService.countTicketsByStatus(tickets);
    }

    applyFilters() {
        let filtered = [...this.displayedTickets];

        // Filtrar por estado
        if (this.filterOptions.estado) {
            filtered = filtered.filter(t => t.estado === this.filterOptions.estado);
        }

        // Filtrar por prioridad
        if (this.filterOptions.prioridad) {
            filtered = filtered.filter(t => t.prioridad === this.filterOptions.prioridad);
        }

        // Ordenar
        filtered = this.sortTickets(filtered, this.filterOptions.ordenarPor);

        this.displayedTickets = filtered;
        this.calculateTicketsByStatus(filtered);
    }

    sortTickets(tickets: Ticket[], sortBy: string): Ticket[] {
        return tickets.sort((a, b) => {
            switch (sortBy) {
                case 'fechaCreacion':
                    return b.fechaCreacion.getTime() - a.fechaCreacion.getTime();
                case 'fechaLimite':
                    return a.fechaLimite.getTime() - b.fechaLimite.getTime();
                case 'prioridad':
                    const prioridadOrder = { 'Alta': 0, 'Media': 1, 'Baja': 2 };
                    return prioridadOrder[a.prioridad] - prioridadOrder[b.prioridad];
                case 'estado':
                    const estadoOrder = { 'Pendiente': 0, 'En progreso': 1, 'Revisión': 2, 'Finalizado': 3 };
                    return estadoOrder[a.estado] - estadoOrder[b.estado];
                default:
                    return 0;
            }
        });
    }

    onFilterChange() {
        this.applyFilters();
    }

    onViewChange() {
        // La vista cambia automáticamente por el binding
    }

    clearFilters() {
        this.filterOptions = {
            estado: null,
            prioridad: null,
            ordenarPor: 'fechaCreacion'
        };

        if (this.selectedGroup) {
            this.onGroupSelect(this.selectedGroup);
        } else {
            this.displayedTickets = this.allUserTickets;
            this.calculateTicketsByStatus(this.allUserTickets);
        }
    }

    getTicketsByEstado(estado: string): Ticket[] {
        return this.displayedTickets.filter(t => t.estado === estado);
    }

    getEstadoSeverity(estado: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        switch (estado) {
            case 'Finalizado':
                return 'success';
            case 'En progreso':
                return 'info';
            case 'Revisión':
                return 'warn';
            case 'Pendiente':
                return 'secondary';
            default:
                return 'contrast';
        }
    }

    getPrioridadSeverity(prioridad: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        switch (prioridad) {
            case 'Alta':
                return 'danger';
            case 'Media':
                return 'warn';
            case 'Baja':
                return 'info';
            default:
                return 'secondary';
        }
    }

    formatDate(date: Date): string {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    }

    navigateToTickets() {
        this.router.navigate(['/ticket']);
    }

    createTicket() {
        // Navegar a la página de tickets con un parámetro para abrir el formulario
        this.router.navigate(['/ticket'], { queryParams: { action: 'create' } });
    }
}
