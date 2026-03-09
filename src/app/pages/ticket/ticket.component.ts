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

    totalTickets = this.tickets.length;


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
            this.tickets = this.tickets.filter(t => t.id !== ticket.id);
            this.totalTickets--;
        }
    }

    onSaveTicket(ticketData: Partial<Ticket>) {
        if (this.isEditMode && this.editingTicket) {
            // Actualizar ticket existente
            const index = this.tickets.findIndex(t => t.id === this.editingTicket!.id);
            if (index !== -1) {
                this.tickets[index] = { ...this.tickets[index], ...ticketData };
            }
        } else {
            // Crear nuevo ticket
            const newId = Math.max(...this.tickets.map(t => t.id), 0) + 1;
            const newTicket: Ticket = {
                id: newId,
                titulo: ticketData.titulo!,
                descripcion: ticketData.descripcion || '',
                estado: ticketData.estado!,
                asignadoA: ticketData.asignadoA!,
                prioridad: ticketData.prioridad!,
                fechaCreacion: new Date(),
                fechaLimite: ticketData.fechaLimite!,
                comentarios: ticketData.comentarios || [],
                historial: []
            };
            this.tickets = [...this.tickets, newTicket];
            this.totalTickets++;
        }
        this.displayTicketDialog = false;
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
