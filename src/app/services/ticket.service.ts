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
    private mockTickets: Ticket[];

    constructor() {
        // Convertir las fechas de string a Date al cargar los datos
        this.mockTickets = ticketsData.tickets.map(ticket => ({
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
    }

    // Obtener todos los tickets
    getAllTickets(): Observable<Ticket[]> {
        return of(this.mockTickets);
    }

    // Obtener tickets de un grupo específico
    getTicketsByGroupId(groupId: number): Observable<Ticket[]> {
        const tickets = this.mockTickets.filter(t => t.groupId === groupId);
        return of(tickets);
    }

    // Obtener tickets asignados a un usuario
    getTicketsByUser(username: string): Observable<Ticket[]> {
        const tickets = this.mockTickets.filter(t => t.asignadoA === username);
        return of(tickets);
    }

    // Obtener tickets de múltiples grupos (para mostrar todos los tickets del usuario)
    getTicketsByGroupIds(groupIds: number[]): Observable<Ticket[]> {
        const tickets = this.mockTickets.filter(t => groupIds.includes(t.groupId));
        return of(tickets);
    }

    // Obtener tickets recientes asignados al usuario
    getRecentTicketsByUser(username: string, limit: number = 5): Observable<Ticket[]> {
        const userTickets = this.mockTickets
            .filter(t => t.asignadoA === username)
            .sort((a, b) => b.fechaCreacion.getTime() - a.fechaCreacion.getTime())
            .slice(0, limit);
        return of(userTickets);
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
        const newId = Math.max(...this.mockTickets.map(t => t.id), 0) + 1;
        const newTicket: Ticket = {
            id: newId,
            groupId: ticketData.groupId || 1, // Asignar a un grupo por defecto si no se especifica
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

        this.mockTickets.push(newTicket);
        return of(newTicket);
    }

    // Actualizar un ticket existente
    updateTicket(ticketData: Partial<Ticket>): Observable<Ticket | null> {
        const index = this.mockTickets.findIndex(t => t.id === ticketData.id);
        if (index !== -1) {
            this.mockTickets[index] = {
                ...this.mockTickets[index],
                ...ticketData,
                // Asegurarse de que las fechas sean objetos Date
                fechaCreacion: ticketData.fechaCreacion instanceof Date
                    ? ticketData.fechaCreacion
                    : new Date(ticketData.fechaCreacion || this.mockTickets[index].fechaCreacion),
                fechaLimite: ticketData.fechaLimite instanceof Date
                    ? ticketData.fechaLimite
                    : new Date(ticketData.fechaLimite || this.mockTickets[index].fechaLimite)
            };
            return of(this.mockTickets[index]);
        }
        return of(null);
    }

    // Eliminar un ticket
    deleteTicket(ticketId: number): Observable<boolean> {
        const index = this.mockTickets.findIndex(t => t.id === ticketId);
        if (index !== -1) {
            this.mockTickets.splice(index, 1);
            return of(true);
        }
        return of(false);
    }
}
