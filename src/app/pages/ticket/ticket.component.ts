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
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { TabsModule } from 'primeng/tabs';
import { IfHasPermissionDirective } from "../../directives/if-has-permission.directive";
import { PermissionsService } from '../../services/permissions.service';

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

interface Ticket {
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
        DialogModule,
        SelectModule,
        TextareaModule,
        InputNumberModule,
        DatePickerModule,
        TabsModule,
        IfHasPermissionDirective
    ],
    templateUrl: './ticket.component.html',
    styleUrls: ['./ticket.component.css']
})
export class TicketComponent {
    totalTickets = 15;
    displayTicketDialog = false;
    displayViewDialog = false;
    isEditMode = false;
    today = new Date();
    newComment = '';
    viewingTicket: Ticket | null = null;
    showHistorial = false;

    currentTicket: Partial<Ticket> = this.getEmptyTicket();

    // Ticket original para comparar cambios
    private originalTicket: Partial<Ticket> | null = null;

    constructor(private permissionsService: PermissionsService) { }

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

    tickets: Ticket[] = [
        {
            id: 1,
            titulo: 'Implementar sistema de autenticación',
            descripcion: 'Crear un sistema de login con JWT y validación de roles',
            estado: 'En progreso',
            asignadoA: 'Carlos Mendoza',
            prioridad: 'Alta',
            fechaCreacion: new Date('2024-03-01'),
            fechaLimite: new Date('2024-03-15'),
            comentarios: [
                {
                    autor: 'María García',
                    texto: 'Revisar los estándares de seguridad OAuth 2.0',
                    fecha: new Date('2024-03-02')
                }
            ],
            historial: []
        },
        {
            id: 2,
            titulo: 'Diseñar interfaz de usuario para dashboard',
            descripcion: 'Crear mockups y prototipos para el nuevo dashboard administrativo',
            estado: 'Revisión',
            asignadoA: 'Ana Torres',
            prioridad: 'Media',
            fechaCreacion: new Date('2024-02-28'),
            fechaLimite: new Date('2024-03-10'),
            comentarios: [],
            historial: []
        },
        {
            id: 3,
            titulo: 'Optimizar consultas de base de datos',
            descripcion: 'Mejorar el rendimiento de las consultas SQL más utilizadas',
            estado: 'Pendiente',
            asignadoA: 'Juan López',
            prioridad: 'Alta',
            fechaCreacion: new Date('2024-03-03'),
            fechaLimite: new Date('2024-03-20'),
            comentarios: [],
            historial: []
        },
        {
            id: 4,
            titulo: 'Crear documentación de API',
            descripcion: 'Documentar todos los endpoints de la API REST',
            estado: 'En progreso',
            asignadoA: 'Laura Ramírez',
            prioridad: 'Media',
            fechaCreacion: new Date('2024-02-25'),
            fechaLimite: new Date('2024-03-12'),
            comentarios: [
                {
                    autor: 'Pedro Sánchez',
                    texto: 'Incluir ejemplos de uso para cada endpoint',
                    fecha: new Date('2024-02-26')
                },
                {
                    autor: 'Laura Ramírez',
                    texto: 'Agregados ejemplos de autenticación',
                    fecha: new Date('2024-02-28')
                }
            ],
            historial: []
        },
        {
            id: 5,
            titulo: 'Configurar pipeline CI/CD',
            descripcion: 'Implementar pipeline de integración continua con GitHub Actions',
            estado: 'Finalizado',
            asignadoA: 'Pedro Sánchez',
            prioridad: 'Alta',
            fechaCreacion: new Date('2024-02-20'),
            fechaLimite: new Date('2024-03-05'),
            comentarios: [],
            historial: [
                {
                    campo: 'Estado',
                    valorAnterior: 'En progreso',
                    valorNuevo: 'Finalizado',
                    fecha: new Date('2024-03-04T14:30:00'),
                    autor: 'Pedro Sánchez'
                },
                {
                    campo: 'Prioridad',
                    valorAnterior: 'Media',
                    valorNuevo: 'Alta',
                    fecha: new Date('2024-03-01T09:15:00'),
                    autor: 'Carlos Mendoza'
                }
            ]
        },
        {
            id: 6,
            titulo: 'Corregir bug en módulo de pagos',
            descripcion: 'Resolver error al procesar pagos con tarjetas internacionales',
            estado: 'Revisión',
            asignadoA: 'Roberto Díaz',
            prioridad: 'Alta',
            fechaCreacion: new Date('2024-03-04'),
            fechaLimite: new Date('2024-03-08'),
            comentarios: [
                {
                    autor: 'Carmen Ruiz',
                    texto: 'Verificar con la pasarela de pagos las validaciones',
                    fecha: new Date('2024-03-04')
                }
            ],
            historial: []
        },
        {
            id: 7,
            titulo: 'Actualizar dependencias del proyecto',
            descripcion: 'Actualizar todas las librerías a sus últimas versiones estables',
            estado: 'Pendiente',
            asignadoA: 'Sofia Castro',
            prioridad: 'Baja',
            fechaCreacion: new Date('2024-03-05'),
            fechaLimite: new Date('2024-03-25'),
            comentarios: [],
            historial: []
        },
        {
            id: 8,
            titulo: 'Implementar notificaciones push',
            descripcion: 'Agregar sistema de notificaciones en tiempo real para usuarios',
            estado: 'En progreso',
            asignadoA: 'Diego Moreno',
            prioridad: 'Media',
            fechaCreacion: new Date('2024-03-02'),
            fechaLimite: new Date('2024-03-18'),
            comentarios: [],
            historial: []
        },
        {
            id: 9,
            titulo: 'Crear tests unitarios para servicios',
            descripcion: 'Implementar suite de tests con cobertura del 80%',
            estado: 'Pendiente',
            asignadoA: 'Carmen Ruiz',
            prioridad: 'Media',
            fechaCreacion: new Date('2024-03-01'),
            fechaLimite: new Date('2024-03-22'),
            comentarios: [],
            historial: []
        },
        {
            id: 10,
            titulo: 'Migrar base de datos a PostgreSQL',
            descripcion: 'Planificar y ejecutar migración desde MySQL a PostgreSQL',
            estado: 'Pendiente',
            asignadoA: 'Carlos Mendoza',
            prioridad: 'Baja',
            fechaCreacion: new Date('2024-02-22'),
            fechaLimite: new Date('2024-04-01'),
            comentarios: [
                {
                    autor: 'Juan López',
                    texto: 'Preparar script de migración y backup',
                    fecha: new Date('2024-02-23')
                }
            ],
            historial: []
        }
    ];

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

    openNewTicketDialog() {
        this.currentTicket = this.getEmptyTicket();
        this.originalTicket = null;
        this.newComment = '';
        this.isEditMode = false;
        this.displayTicketDialog = true;
    }

    editTicket(ticket: Ticket) {
        // Crear copia profunda del ticket original para comparación
        this.originalTicket = JSON.parse(JSON.stringify(ticket));
        // Crear copia profunda para edición
        this.currentTicket = JSON.parse(JSON.stringify(ticket));
        // Convertir fechas de string a Date
        this.currentTicket.fechaCreacion = new Date(this.currentTicket.fechaCreacion!);
        this.currentTicket.fechaLimite = new Date(this.currentTicket.fechaLimite!);
        this.newComment = '';
        this.isEditMode = true;
        this.displayTicketDialog = true;
    }

    viewTicket(ticket: Ticket) {
        this.viewingTicket = ticket;
        this.showHistorial = false;
        this.displayViewDialog = true;
    }

    deleteTicket(ticket: Ticket) {
        if (confirm(`¿Estás seguro de que deseas eliminar el ticket "${ticket.titulo}"?`)) {
            this.tickets = this.tickets.filter(t => t.id !== ticket.id);
            this.totalTickets--;
        }
    }

    onEstadoChange() {
        // Este método se puede usar para validaciones adicionales cuando cambia el estado
    }

    addComment() {
        if (this.newComment && this.newComment.trim()) {
            if (!this.currentTicket.comentarios) {
                this.currentTicket.comentarios = [];
            }
            this.currentTicket.comentarios.push({
                autor: 'Usuario Actual', // En producción, obtener del usuario autenticado
                texto: this.newComment.trim(),
                fecha: new Date()
            });
            this.newComment = '';
        }
    }

    saveTicket() {
        if (this.currentTicket.titulo && this.currentTicket.estado &&
            this.currentTicket.prioridad && this.currentTicket.asignadoA &&
            this.currentTicket.fechaLimite) {

            if (this.isEditMode) {
                // Modo edición: detectar cambios y agregar al historial
                const changes = this.detectChanges();
                if (changes.length > 0) {
                    if (!this.currentTicket.historial) {
                        this.currentTicket.historial = [];
                    }
                    this.currentTicket.historial.push(...changes);
                }

                // Actualizar el ticket en el array
                const index = this.tickets.findIndex(t => t.id === this.currentTicket.id);
                if (index !== -1) {
                    this.tickets[index] = this.currentTicket as Ticket;
                }
            } else {
                // Modo creación: agregar nuevo ticket
                const newId = Math.max(...this.tickets.map(t => t.id), 0) + 1;
                const newTicket: Ticket = {
                    id: newId,
                    titulo: this.currentTicket.titulo!,
                    descripcion: this.currentTicket.descripcion || '',
                    estado: this.currentTicket.estado!,
                    asignadoA: this.currentTicket.asignadoA!,
                    prioridad: this.currentTicket.prioridad!,
                    fechaCreacion: new Date(),
                    fechaLimite: this.currentTicket.fechaLimite!,
                    comentarios: this.currentTicket.comentarios || [],
                    historial: []
                };
                this.tickets = [...this.tickets, newTicket];
                this.totalTickets++;
            }

            this.displayTicketDialog = false;
        }
    }

    private detectChanges(): HistorialCambio[] {
        const changes: HistorialCambio[] = [];
        const now = new Date();

        if (!this.originalTicket) return changes;

        const currentUser = 'Usuario Actual'; // En producción, obtener del usuario autenticado

        // Comparar campos importantes
        if (this.originalTicket.estado !== this.currentTicket.estado) {
            changes.push({
                campo: 'Estado',
                valorAnterior: this.originalTicket.estado!,
                valorNuevo: this.currentTicket.estado!,
                fecha: now,
                autor: currentUser
            });
        }

        if (this.originalTicket.prioridad !== this.currentTicket.prioridad) {
            changes.push({
                campo: 'Prioridad',
                valorAnterior: this.originalTicket.prioridad!,
                valorNuevo: this.currentTicket.prioridad!,
                fecha: now,
                autor: currentUser
            });
        }

        if (this.originalTicket.asignadoA !== this.currentTicket.asignadoA) {
            changes.push({
                campo: 'Asignado a',
                valorAnterior: this.originalTicket.asignadoA!,
                valorNuevo: this.currentTicket.asignadoA!,
                fecha: now,
                autor: currentUser
            });
        }

        if (this.originalTicket.titulo !== this.currentTicket.titulo) {
            changes.push({
                campo: 'Título',
                valorAnterior: this.originalTicket.titulo!,
                valorNuevo: this.currentTicket.titulo!,
                fecha: now,
                autor: currentUser
            });
        }

        // Comparar fechas límite
        const originalDate = this.formatDate(new Date(this.originalTicket.fechaLimite!));
        const currentDate = this.formatDate(this.currentTicket.fechaLimite!);
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
        this.displayTicketDialog = false;
        this.currentTicket = this.getEmptyTicket();
        this.originalTicket = null;
        this.newComment = '';
    }

    closeViewDialog() {
        this.displayViewDialog = false;
        this.viewingTicket = null;
        this.showHistorial = false;
    }

    toggleHistorial() {
        this.showHistorial = !this.showHistorial;
    }
}
