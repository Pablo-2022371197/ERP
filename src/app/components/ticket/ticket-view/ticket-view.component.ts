import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { TabsModule } from 'primeng/tabs';

interface Comentario {
    autor: string;
    texto: string;
    fecha: Date;
}

interface HistorialCambio {
    campo: string;
    valorAnterior: string;
    valorNuevo: string;
    fecha: Date;
    autor: string;
}

export interface Ticket {
    id: number;
    titulo: string;
    descripcion: string;
    estado: string;
    asignadoA: string;
    prioridad: string;
    fechaCreacion: Date;
    fechaLimite: Date;
    comentarios: Comentario[];
    historial: HistorialCambio[];
}

@Component({
    selector: 'app-ticket-view',
    standalone: true,
    imports: [
        CommonModule,
        DialogModule,
        ButtonModule,
        TagModule,
        BadgeModule,
        TabsModule
    ],
    templateUrl: './ticket-view.component.html',
    styleUrls: ['./ticket-view.component.css']
})
export class TicketViewComponent {
    @Input() visible = false;
    @Input() ticket: Ticket | null = null;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() onClose = new EventEmitter<void>();

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

    closeView() {
        this.visible = false;
        this.visibleChange.emit(false);
        this.onClose.emit();
    }

    formatDateTime(date: Date | undefined): string {
        if (!date) return '';
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    closeDialog() {
        this.visible = false;
        this.visibleChange.emit(false);
        this.onClose.emit();
    }
}
