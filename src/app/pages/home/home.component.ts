import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardHeaderComponent } from '../../components/dashboard/dashboard-header/dashboard-header.component';
import { RecentTicketsSidebarComponent } from '../../components/dashboard/recent-tickets-sidebar/recent-tickets-sidebar.component';
import { TicketFiltersComponent, FilterOptions } from '../../components/dashboard/ticket-filters/ticket-filters.component';
import { KanbanBoardComponent } from '../../components/dashboard/kanban-board/kanban-board.component';
import { TicketListComponent } from '../../components/dashboard/ticket-list/ticket-list.component';
import { GroupService, Group } from '../../services/group.service';
import { TicketService, Ticket } from '../../services/ticket.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        DashboardHeaderComponent,
        RecentTicketsSidebarComponent,
        TicketFiltersComponent,
        KanbanBoardComponent,
        TicketListComponent
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
    filterOptions: FilterOptions = {
        estado: null,
        prioridad: null
    };

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

    onGroupChange(group: Group | null) {
        if (group) {
            this.onGroupSelect(group);
        } else {
            this.selectedGroup = null;
            this.displayedTickets = this.allUserTickets;
            this.totalTickets = this.allUserTickets.length;
            this.calculateTicketsByStatus(this.allUserTickets);
            // Aplicar filtros existentes
            this.applyFilters();
        }
    }

    onViewModeChange(isKanban: boolean) {
        this.isKanbanView = isKanban;
    }

    onFilterChange(filters: FilterOptions) {
        this.filterOptions = filters;
        this.applyFilters();
    }

    onClearFilters() {
        this.filterOptions = {
            estado: null,
            prioridad: null
        };

        if (this.selectedGroup) {
            this.onGroupSelect(this.selectedGroup);
        } else {
            this.displayedTickets = this.allUserTickets;
            this.calculateTicketsByStatus(this.allUserTickets);
        }
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

        this.displayedTickets = filtered;
        this.calculateTicketsByStatus(filtered);
    }

    viewTicket(ticket: Ticket) {
        // Navegar a la página de tickets con el ID del ticket para ver detalles
        this.router.navigate(['/ticket'], { queryParams: { view: ticket.id } });
    }

    createTicket() {
        // Navegar a la página de tickets con un parámetro para abrir el formulario
        this.router.navigate(['/ticket'], { queryParams: { action: 'create' } });
    }
}
