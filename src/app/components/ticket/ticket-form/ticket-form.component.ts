import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

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
    selector: 'app-ticket-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        ButtonModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        DatePickerModule
    ],
    templateUrl: './ticket-form.component.html',
    styleUrls: ['./ticket-form.component.css']
})
export class TicketFormComponent implements OnChanges {
    @Input() visible = false;
    @Input() isEditMode = false;
    @Input() ticket: Partial<Ticket> | null = null;
    @Input() estadoOptions: any[] = [];
    @Input() prioridadOptions: any[] = [];

    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() onSave = new EventEmitter<Partial<Ticket>>();
    @Output() onCancel = new EventEmitter<void>();

    currentTicket: Partial<Ticket> = this.getEmptyTicket();
    originalTicket: Partial<Ticket> | null = null;
    today = new Date();

    ngOnChanges(changes: SimpleChanges) {
        if (changes['ticket'] && this.ticket) {
            if (this.isEditMode) {
                // Modo edición: guardar copia original
                this.originalTicket = JSON.parse(JSON.stringify(this.ticket));
                this.currentTicket = JSON.parse(JSON.stringify(this.ticket));
                // Convertir fechas
                if (this.currentTicket.fechaCreacion) {
                    this.currentTicket.fechaCreacion = new Date(this.currentTicket.fechaCreacion);
                }
                if (this.currentTicket.fechaLimite) {
                    this.currentTicket.fechaLimite = new Date(this.currentTicket.fechaLimite);
                }
            } else {
                this.currentTicket = this.getEmptyTicket();
                this.originalTicket = null;
            }
        }
    }

    private getEmptyTicket(): Partial<Ticket> {
        return {
            titulo: '',
            descripcion: '',
            estado: '',
            asignadoA: '',
            prioridad: '',
            fechaCreacion: new Date(),
            fechaLimite: undefined,
            comentarios: [],
            historial: []
        };
    }

    formatDate(date: Date | undefined): string {
        if (!date) return '';
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
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

    saveTicket() {
        if (this.currentTicket.titulo && this.currentTicket.estado &&
            this.currentTicket.prioridad && this.currentTicket.asignadoA &&
            this.currentTicket.fechaLimite) {

            // Si es edición, detectar cambios
            if (this.isEditMode && this.originalTicket) {
                const changes = this.detectChanges();
                if (changes.length > 0) {
                    if (!this.currentTicket.historial) {
                        this.currentTicket.historial = [];
                    }
                    this.currentTicket.historial.push(...changes);
                }
            }

            this.onSave.emit(this.currentTicket);
            this.closeDialog();
        }
    }

    private detectChanges(): HistorialCambio[] {
        const changes: HistorialCambio[] = [];
        const now = new Date();
        const currentUser = 'Usuario Actual';

        if (!this.originalTicket) return changes;

        // Comparar estado
        if (this.originalTicket.estado !== this.currentTicket.estado) {
            changes.push({
                campo: 'Estado',
                valorAnterior: this.originalTicket.estado!,
                valorNuevo: this.currentTicket.estado!,
                fecha: now,
                autor: currentUser
            });
        }

        // Comparar prioridad
        if (this.originalTicket.prioridad !== this.currentTicket.prioridad) {
            changes.push({
                campo: 'Prioridad',
                valorAnterior: this.originalTicket.prioridad!,
                valorNuevo: this.currentTicket.prioridad!,
                fecha: now,
                autor: currentUser
            });
        }

        // Comparar asignado
        if (this.originalTicket.asignadoA !== this.currentTicket.asignadoA) {
            changes.push({
                campo: 'Asignado a',
                valorAnterior: this.originalTicket.asignadoA!,
                valorNuevo: this.currentTicket.asignadoA!,
                fecha: now,
                autor: currentUser
            });
        }

        // Comparar título
        if (this.originalTicket.titulo !== this.currentTicket.titulo) {
            changes.push({
                campo: 'Título',
                valorAnterior: this.originalTicket.titulo!,
                valorNuevo: this.currentTicket.titulo!,
                fecha: now,
                autor: currentUser
            });
        }

        // Comparar fecha límite
        const originalDate = this.formatDate(this.originalTicket.fechaLimite);
        const currentDate = this.formatDate(this.currentTicket.fechaLimite);
        if (originalDate !== currentDate) {
            changes.push({
                campo: 'Fecha Límite',
                valorAnterior: originalDate,
                valorNuevo: currentDate,
                fecha: now,
                autor: currentUser
            });
        }

        return changes;
    }

    cancelTicket() {
        this.closeDialog();
    }

    closeDialog() {
        this.visible = false;
        this.visibleChange.emit(false);
        this.currentTicket = this.getEmptyTicket();
        this.originalTicket = null;
        this.onCancel.emit();
    }

    onEstadoChange() {
        // Para validaciones adicionales cuando cambia el estado
    }
}
