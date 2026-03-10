import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

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
    private mockTickets: Ticket[] = [
        {
            id: 1,
            groupId: 1,
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
            groupId: 2,
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
            groupId: 1,
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
            groupId: 1,
            titulo: 'Crear documentación de API',
            descripcion: 'Documentar todos los endpoints de la API REST',
            estado: 'En progreso',
            asignadoA: 'Carlos Mendoza',
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
            groupId: 5,
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
                }
            ]
        },
        {
            id: 6,
            groupId: 1,
            titulo: 'Corregir bug en módulo de pagos',
            descripcion: 'Resolver error al procesar pagos con tarjetas internacionales',
            estado: 'Revisión',
            asignadoA: 'Carlos Mendoza',
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
            groupId: 3,
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
            groupId: 4,
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
            groupId: 1,
            titulo: 'Crear tests unitarios para servicios',
            descripcion: 'Implementar tests con Jest para todos los servicios del backend',
            estado: 'Pendiente',
            asignadoA: 'Carlos Mendoza',
            prioridad: 'Media',
            fechaCreacion: new Date('2024-03-01'),
            fechaLimite: new Date('2024-03-16'),
            comentarios: [],
            historial: []
        },
        {
            id: 10,
            groupId: 2,
            titulo: 'Rediseñar página de inicio',
            descripcion: 'Mejorar el diseño de la landing page con nuevos componentes',
            estado: 'En progreso',
            asignadoA: 'Ana Torres',
            prioridad: 'Alta',
            fechaCreacion: new Date('2024-02-27'),
            fechaLimite: new Date('2024-03-11'),
            comentarios: [],
            historial: []
        },
        {
            id: 11,
            groupId: 5,
            titulo: 'Configurar monitoreo de servidores',
            descripcion: 'Implementar monitoreo con Prometheus y Grafana',
            estado: 'Finalizado',
            asignadoA: 'Carlos Mendoza',
            prioridad: 'Media',
            fechaCreacion: new Date('2024-02-18'),
            fechaLimite: new Date('2024-03-02'),
            comentarios: [],
            historial: []
        },
        {
            id: 12,
            groupId: 4,
            titulo: 'Automatizar tests de regresión',
            descripcion: 'Crear suite de tests automatizados con Selenium',
            estado: 'Revisión',
            asignadoA: 'Ana Torres',
            prioridad: 'Alta',
            fechaCreacion: new Date('2024-03-06'),
            fechaLimite: new Date('2024-03-14'),
            comentarios: [],
            historial: []
        }
    ];

    constructor() { }

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
}
