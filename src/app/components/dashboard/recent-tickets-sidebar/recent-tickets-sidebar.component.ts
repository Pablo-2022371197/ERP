import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { IfHasPermissionDirective } from '../../../directives/if-has-permission.directive';
import { Ticket } from '../../../services/ticket.service';

@Component({
    selector: 'app-recent-tickets-sidebar',
    standalone: true,
    imports: [CommonModule, TagModule, IfHasPermissionDirective],
    templateUrl: './recent-tickets-sidebar.component.html',
    styleUrls: ['./recent-tickets-sidebar.component.css']
})
export class RecentTicketsSidebarComponent {
    @Input() recentTickets: Ticket[] = [];
    @Output() ticketClick = new EventEmitter<Ticket>();

    viewTicket(ticket: Ticket) {
        this.ticketClick.emit(ticket);
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
}
