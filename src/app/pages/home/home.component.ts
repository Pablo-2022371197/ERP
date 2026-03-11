import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardHeaderComponent } from '../../components/dashboard/dashboard-header/dashboard-header.component';
import { RecentTicketsSidebarComponent } from '../../components/dashboard/recent-tickets-sidebar/recent-tickets-sidebar.component';
import { TicketFiltersComponent, FilterOptions } from '../../components/dashboard/ticket-filters/ticket-filters.component';
import { KanbanBoardComponent } from '../../components/dashboard/kanban-board/kanban-board.component';
import { TicketListComponent } from '../../components/dashboard/ticket-list/ticket-list.component';
import { TicketViewComponent, Ticket as TicketView } from '../../components/ticket/ticket-view/ticket-view.component';
import { TicketFormComponent, Ticket as TicketForm } from '../../components/ticket/ticket-form/ticket-form.component';
import { GroupService, Group } from '../../services/group.service';
import { TicketService, Ticket } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        DashboardHeaderComponent,
        RecentTicketsSidebarComponent,
        TicketFiltersComponent,
        KanbanBoardComponent,
        TicketListComponent,
        TicketViewComponent,
        TicketFormComponent
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


    // Grupos del usuario
    userGroups: Group[] = [];
    selectedGroup: Group | null = null;

    // Tickets
    allUserTickets: Ticket[] = [];
    currentGroupTickets: Ticket[] = []; // Tickets del grupo actual sin filtros
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

    // Ticket View Dialog
    showTicketDialog = false;
    selectedTicket: TicketView | null = null;

    // Ticket Form Dialog
    showTicketFormDialog = false;
    isEditMode = false;
    ticketToEdit: Partial<TicketForm> | null = null;

    // Opciones para el formulario
    estadoOptions = [
        { label: 'Pendiente', value: 'Pendiente' },
        { label: 'En progreso', value: 'En progreso' },
        { label: 'Revisión', value: 'Revisión' },
        { label: 'Finalizado', value: 'Finalizado' }
    ];

    prioridadOptions = [
        { label: 'Alta', value: 'Alta' },
        { label: 'Media', value: 'Media' },
        { label: 'Baja', value: 'Baja' }
    ];

    constructor(
        private groupService: GroupService,
        private ticketService: TicketService,
        private router: Router,
        public authService: AuthService,

    ) { }

    get currentUserName(): string {
        return this.authService.getUserName();
    }


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
                this.currentGroupTickets = tickets;
                this.displayedTickets = tickets;
                this.totalTickets = tickets.length;
                this.calculateTicketsByStatus(tickets);
            });

            // Cargar tickets recientes asignados al usuario
            this.ticketService.getRecentTicketsByUser(this.currentUserName, 5).subscribe(tickets => {
                this.recentTickets = tickets;
            });
        });
    }
    currentUser(currentUser: any, arg1: number) {
        throw new Error('Method not implemented.');
    }

    onGroupSelect(group: Group) {
        this.selectedGroup = group;

        // Cargar tickets del grupo seleccionado
        this.ticketService.getTicketsByGroupId(group.id).subscribe(tickets => {
            this.currentGroupTickets = tickets;
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
            this.currentGroupTickets = this.allUserTickets;
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

        // Restaurar tickets del grupo actual sin filtros
        this.displayedTickets = this.currentGroupTickets;
        this.calculateTicketsByStatus(this.currentGroupTickets);
    }

    calculateTicketsByStatus(tickets: Ticket[]) {
        this.ticketsByStatus = this.ticketService.countTicketsByStatus(tickets);
    }

    reloadCurrentView() {
        // Recargar tickets recientes
        this.ticketService.getRecentTicketsByUser(this.currentUserName, 5).subscribe(tickets => {
            this.recentTickets = tickets;
        });

        // Si hay un grupo seleccionado, recargar solo ese grupo
        if (this.selectedGroup) {
            this.ticketService.getTicketsByGroupId(this.selectedGroup.id).subscribe(tickets => {
                this.currentGroupTickets = tickets;
                this.totalTickets = tickets.length;
                // Aplicar filtros existentes para mantener el estado de la vista
                this.applyFilters();
            });
        } else {
            // Si no hay grupo seleccionado, recargar todos los tickets del usuario
            const groupIds = this.userGroups.map(g => g.id);
            this.ticketService.getTicketsByGroupIds(groupIds).subscribe(tickets => {
                this.allUserTickets = tickets;
                this.currentGroupTickets = tickets;
                this.totalTickets = tickets.length;
                // Aplicar filtros existentes para mantener el estado de la vista
                this.applyFilters();
            });
        }
    }

    applyFilters() {
        // Filtrar desde los tickets del grupo actual (sin filtros previos)
        let filtered = [...this.currentGroupTickets];

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
        // Convertir Ticket a TicketView para el diálogo
        this.selectedTicket = ticket as TicketView;
        this.showTicketDialog = true;
    }

    closeTicketDialog() {
        this.showTicketDialog = false;
        this.selectedTicket = null;
    }

    createTicket() {
        // Abrir diálogo de creación de ticket
        this.isEditMode = false;
        this.ticketToEdit = null;
        this.showTicketFormDialog = true;
    }

    saveTicket(ticket: Partial<TicketForm>) {
        if (this.isEditMode) {
            // Actualizar ticket existente
            this.ticketService.updateTicket(ticket as Partial<Ticket>).subscribe({
                next: (updatedTicket) => {
                    if (updatedTicket) {
                        console.log('Ticket actualizado:', updatedTicket);
                        this.showTicketFormDialog = false;
                        // Recargar datos después de guardar
                        this.loadUserData();
                    }
                },
                error: (error) => {
                    console.error('Error al actualizar ticket:', error);
                }
            });
        } else {
            // Crear nuevo ticket - asignar al primer grupo del usuario si hay grupo seleccionado
            const ticketData = {
                ...ticket,
                groupId: this.selectedGroup?.id || (this.userGroups.length > 0 ? this.userGroups[0].id : 1)
            } as Partial<Ticket>;

            this.ticketService.createTicket(ticketData).subscribe({
                next: (newTicket) => {
                    console.log('Ticket creado:', newTicket);
                    this.showTicketFormDialog = false;
                    // Recargar datos después de guardar
                    this.loadUserData();
                },
                error: (error) => {
                    console.error('Error al crear ticket:', error);
                }
            });
        }
    }

    cancelTicketForm() {
        this.showTicketFormDialog = false;
        this.ticketToEdit = null;
    }

    onTicketStatusChange(event: { ticket: Ticket, newStatus: string }) {
        const updatedTicket = {
            ...event.ticket,
            estado: event.newStatus as 'Pendiente' | 'En progreso' | 'Revisión' | 'Finalizado'
        };

        this.ticketService.updateTicket(updatedTicket).subscribe({
            next: (updated) => {
                if (updated) {
                    console.log('Estado del ticket actualizado:', updated);
                    // Recargar vista actual manteniendo filtros
                    this.reloadCurrentView();
                }
            },
            error: (error) => {
                console.error('Error al actualizar el estado del ticket:', error);
            }
        });
    }

    onCommentAdded(event: { ticket: TicketView, comment: any }) {
        // Actualizar el ticket con el nuevo comentario
        this.ticketService.updateTicket(event.ticket as Partial<Ticket>).subscribe({
            next: (updated) => {
                if (updated) {
                    console.log('Comentario agregado al ticket:', updated);
                    // Recargar vista actual manteniendo filtros
                    this.reloadCurrentView();
                }
            },
            error: (error) => {
                console.error('Error al agregar comentario:', error);
            }
        });
    }
}
