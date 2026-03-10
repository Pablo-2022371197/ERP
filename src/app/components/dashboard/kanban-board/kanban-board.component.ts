import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { DragDropModule } from 'primeng/dragdrop';
import { IfHasPermissionDirective } from '../../../directives/if-has-permission.directive';
import { Ticket } from '../../../services/ticket.service';

@Component({
    selector: 'app-kanban-board',
    standalone: true,
    imports: [CommonModule, BadgeModule, TagModule, DragDropModule, IfHasPermissionDirective],
    templateUrl: './kanban-board.component.html',
    styleUrls: ['./kanban-board.component.css']
})
export class KanbanBoardComponent {
    @Input() tickets: Ticket[] = [];
    @Input() ticketsByStatus: { [key: string]: number } = {};
    @Output() ticketClick = new EventEmitter<Ticket>();
    @Output() ticketStatusChange = new EventEmitter<{ ticket: Ticket, newStatus: string }>();

    draggedTicket: Ticket | null = null;

    getTicketsByEstado(estado: string): Ticket[] {
        return this.tickets.filter(t => t.estado === estado);
    }

    viewTicket(ticket: Ticket) {
        this.ticketClick.emit(ticket);
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

    onDragStart(ticket: Ticket) {
        this.draggedTicket = ticket;
    }

    onDragEnd() {
        this.draggedTicket = null;
    }

    onDrop(newStatus: string) {
        if (this.draggedTicket && this.draggedTicket.estado !== newStatus) {
            this.ticketStatusChange.emit({
                ticket: this.draggedTicket,
                newStatus: newStatus
            });
        }
        this.draggedTicket = null;
    }
}
