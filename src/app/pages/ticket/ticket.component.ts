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
import { IfHasPermissionDirective } from "../../directives/if-has-permission.directive";
import { PermissionsService } from '../../services/permissions.service';
import { TicketService, Ticket as ServiceTicket } from '../../services/ticket.service';
import { TicketViewComponent, Ticket as ViewTicket } from '../../components/ticket/ticket-view/ticket-view.component';
import { TicketFormComponent, Ticket as FormTicket } from '../../components/ticket/ticket-form/ticket-form.component';

// Usar tipo combinado de los componentes
type Ticket = ViewTicket & FormTicket;

@Component({
    selector: 'app-ticket',
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
        IfHasPermissionDirective,
        TicketViewComponent,
        TicketFormComponent
    ],
    templateUrl: './ticket.component.html',
    styleUrls: ['./ticket.component.css']
})
export class TicketComponent {
    displayTicketDialog = false;
    displayViewDialog = false;
    isEditMode = false;
    viewingTicket: Ticket | null = null;
    editingTicket: Partial<Ticket> | null = null;

    constructor(
        private permissionsService: PermissionsService,
        private ticketService: TicketService
    ) {
        this.loadTickets();
    }

    loadTickets() {
        this.ticketService.getAllTickets().subscribe(tickets => {
            this.tickets = tickets;
            this.totalTickets = tickets.length;
        });
    }

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

    tickets: Ticket[] = [];

    totalTickets = 0;


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

    getInitials(name: string): string {
        return name
            .split(' ')
            .map(n => n[0])
            .join('');
    }

    formatDate(date: Date | undefined): string {
        if (!date) return '';
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    }

    openNewTicketDialog() {
        this.isEditMode = false;
        this.editingTicket = null;
        this.displayTicketDialog = true;
    }

    editTicket(ticket: Ticket) {
        this.isEditMode = true;
        this.editingTicket = ticket;
        this.displayTicketDialog = true;
    }

    viewTicket(ticket: Ticket) {
        this.viewingTicket = ticket;
        this.displayViewDialog = true;
    }

    deleteTicket(ticket: Ticket) {
        if (confirm(`¿Estás seguro de que deseas eliminar el ticket "${ticket.titulo}"?`)) {
            this.ticketService.deleteTicket(ticket.id).subscribe(success => {
                if (success) {
                    this.loadTickets(); // Recargar desde el servicio
                }
            });
        }
    }

    onSaveTicket(ticketData: Partial<Ticket>) {
        if (this.isEditMode && this.editingTicket) {
            // Actualizar ticket existente usando el servicio
            const updatedData = {
                ...ticketData,
                id: this.editingTicket.id
            } as Partial<ServiceTicket>;
            this.ticketService.updateTicket(updatedData).subscribe(updatedTicket => {
                if (updatedTicket) {
                    this.loadTickets(); // Recargar desde el servicio
                }
            });
        } else {
            // Crear nuevo ticket usando el servicio
            this.ticketService.createTicket(ticketData as Partial<ServiceTicket>).subscribe(newTicket => {
                this.loadTickets(); // Recargar desde el servicio
            });
        }
        this.displayTicketDialog = false;
        this.editingTicket = null;
    }

    onCancelTicketForm() {
        this.displayTicketDialog = false;
        this.editingTicket = null;
    }

    onCloseView() {
        this.displayViewDialog = false;
        this.viewingTicket = null;
    }

}
