import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import ticketsData from './tickets.mock.json';

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
    groupId: number; // Agregado para relacionar con grupos
    titulo: string;
    descripcion: string;
    estado: 'Pendiente' | 'En progreso' | 'Revisión' | 'Finalizado';
    asignadoA: string;
    prioridad: 'Alta' | 'Media' | 'Baja';
    fechaCreacion: Date;
    fechaLimite: Date;
    comentarios: Comentario[];
    historial: HistorialCambio[];
}

@Injectable({
    providedIn: 'root'
})
export class TicketService {
    private readonly STORAGE_KEY = 'erp_tickets';
    private tickets: Ticket[] = [];

    constructor() {
        this.loadTickets();
    }

    // Cargar tickets desde localStorage o mock
    private loadTickets(): void {
        const storedTickets = localStorage.getItem(this.STORAGE_KEY);
        if (storedTickets) {
            try {
                const parsedTickets = JSON.parse(storedTickets);
                this.tickets = parsedTickets.map((ticket: any) => ({
                    ...ticket,
                    fechaCreacion: new Date(ticket.fechaCreacion),
                    fechaLimite: new Date(ticket.fechaLimite),
                    comentarios: ticket.comentarios.map((comentario: any) => ({
                        ...comentario,
                        fecha: new Date(comentario.fecha)
                    })),
                    historial: ticket.historial.map((cambio: any) => ({
                        ...cambio,
                        fecha: new Date(cambio.fecha)
                    }))
                }));
            } catch (error) {
                console.error('Error al cargar tickets desde localStorage:', error);
                this.loadFromMock();
            }
        } else {
            // Primera vez, cargar desde mock
            this.loadFromMock();
        }
    }

    // Cargar desde mock y guardar en localStorage
    private loadFromMock(): void {
        this.tickets = ticketsData.tickets.map(ticket => ({
            ...ticket,
            fechaCreacion: new Date(ticket.fechaCreacion),
            fechaLimite: new Date(ticket.fechaLimite),
            comentarios: ticket.comentarios.map(comentario => ({
                ...comentario,
                fecha: new Date(comentario.fecha)
            })),
            historial: ticket.historial.map(cambio => ({
                ...cambio,
                fecha: new Date(cambio.fecha)
            }))
        })) as Ticket[];
        this.saveToLocalStorage();
    }

    // Guardar tickets en localStorage
    private saveToLocalStorage(): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tickets));
    }

    // Obtener todos los tickets
    getAllTickets(): Observable<Ticket[]> {
        return of([...this.tickets]);
    }

    // Obtener tickets de un grupo específico
    getTicketsByGroupId(groupId: number): Observable<Ticket[]> {
        const tickets = this.tickets.filter(t => t.groupId === groupId);
        return of([...tickets]);
    }

    // Obtener tickets asignados a un usuario (por nombre de usuario)
    // Busca tanto por username como por nombre completo para compatibilidad
    getTicketsByUser(username: string): Observable<Ticket[]> {
        const tickets = this.tickets.filter(t => {
            // Buscar por username exacto o por nombre que contenga el username
            return t.asignadoA === username ||
                t.asignadoA.toLowerCase().includes(username.toLowerCase());
        });
        return of([...tickets]);
    }

    // Obtener tickets de múltiples grupos (para mostrar todos los tickets del usuario)
    getTicketsByGroupIds(groupIds: number[]): Observable<Ticket[]> {
        const tickets = this.tickets.filter(t => groupIds.includes(t.groupId));
        return of([...tickets]);
    }

    // Obtener tickets recientes asignados al usuario
    // Busca tanto por username como por nombre completo
    getRecentTicketsByUser(username: string, limit: number = 5): Observable<Ticket[]> {
        const userTickets = this.tickets
            .filter(t => {
                // Buscar por username exacto o por nombre que contenga el username
                return t.asignadoA === username ||
                    t.asignadoA.toLowerCase().includes(username.toLowerCase());
            })
            .sort((a, b) => b.fechaCreacion.getTime() - a.fechaCreacion.getTime())
            .slice(0, limit);
        return of([...userTickets]);
    }

    // Contar tickets por estado
    countTicketsByStatus(tickets: Ticket[]): { [key: string]: number } {
        return tickets.reduce((acc, ticket) => {
            acc[ticket.estado] = (acc[ticket.estado] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number });
    }

    // Crear un nuevo ticket
    createTicket(ticketData: Partial<Ticket>): Observable<Ticket> {
        const newId = Math.max(...this.tickets.map(t => t.id), 0) + 1;
        const newTicket: Ticket = {
            id: newId,
            groupId: ticketData.groupId || 1,
            titulo: ticketData.titulo || '',
            descripcion: ticketData.descripcion || '',
            estado: ticketData.estado || 'Pendiente',
            asignadoA: ticketData.asignadoA || '',
            prioridad: ticketData.prioridad || 'Media',
            fechaCreacion: ticketData.fechaCreacion || new Date(),
            fechaLimite: ticketData.fechaLimite || new Date(),
            comentarios: ticketData.comentarios || [],
            historial: ticketData.historial || []
        };

        this.tickets = [...this.tickets, newTicket];
        this.saveToLocalStorage();
        return of({ ...newTicket });
    }

    // Actualizar un ticket existente
    updateTicket(ticketData: Partial<Ticket>): Observable<Ticket | null> {
        const index = this.tickets.findIndex(t => t.id === ticketData.id);
        if (index !== -1) {
            this.tickets[index] = {
                ...this.tickets[index],
                ...ticketData,
                id: this.tickets[index].id, // Asegurar que el ID no cambie
                fechaCreacion: ticketData.fechaCreacion instanceof Date
                    ? ticketData.fechaCreacion
                    : new Date(ticketData.fechaCreacion || this.tickets[index].fechaCreacion),
                fechaLimite: ticketData.fechaLimite instanceof Date
                    ? ticketData.fechaLimite
                    : new Date(ticketData.fechaLimite || this.tickets[index].fechaLimite)
            };
            this.saveToLocalStorage();
            return of({ ...this.tickets[index] });
        }
        return of(null);
    }

    // Eliminar un ticket
    deleteTicket(ticketId: number): Observable<boolean> {
        const initialLength = this.tickets.length;
        this.tickets = this.tickets.filter(t => t.id !== ticketId);
        if (this.tickets.length < initialLength) {
            this.saveToLocalStorage();
            return of(true);
        }
        return of(false);
    }
}
