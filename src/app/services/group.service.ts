import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface User {
    id: number;
    nombre: string;
    email: string;
    username: string;
}

export interface Group {
    id: number;
    nivel: string;
    autor: string;
    nombre: string;
    integrantes: number;
    tickets: number;
    descripcion: string;
    miembros: User[];
}

@Injectable({
    providedIn: 'root'
})
export class GroupService {
    private mockGroups: Group[] = [
        {
            id: 1,
            nivel: 'Avanzado',
            autor: 'Carlos Mendoza',
            nombre: 'Development Team',
            integrantes: 5,
            tickets: 45,
            descripcion: 'Equipo encargado del desarrollo de aplicaciones web y móviles',
            miembros: [
                { id: 1, nombre: 'Carlos Mendoza', email: 'carlos.mendoza@example.com', username: 'cmendoza' },
                { id: 2, nombre: 'María García', email: 'maria.garcia@example.com', username: 'mgarcia' },
                { id: 3, nombre: 'Ana Torres', email: 'ana.torres@example.com', username: 'atorres' },
                { id: 4, nombre: 'Juan López', email: 'juan.lopez@example.com', username: 'jlopez' },
                { id: 5, nombre: 'Pedro Sánchez', email: 'pedro.sanchez@example.com', username: 'psanchez' }
            ]
        },
        {
            id: 2,
            nivel: 'Intermedio',
            autor: 'María García',
            nombre: 'Design Team',
            integrantes: 3,
            tickets: 23,
            descripcion: 'Equipo de diseño UI/UX para todos los productos digitales',
            miembros: [
                { id: 2, nombre: 'María García', email: 'maria.garcia@example.com', username: 'mgarcia' },
                { id: 6, nombre: 'Laura Ramírez', email: 'laura.ramirez@example.com', username: 'lramirez' },
                { id: 8, nombre: 'Carmen Ruiz', email: 'carmen.ruiz@example.com', username: 'cruiz' }
            ]
        },
        {
            id: 3,
            nivel: 'Básico',
            autor: 'Juan López',
            nombre: 'Marketing Team',
            integrantes: 4,
            tickets: 67,
            descripcion: 'Equipo de marketing digital y estrategias de comunicación',
            miembros: [
                { id: 4, nombre: 'Juan López', email: 'juan.lopez@example.com', username: 'jlopez' },
                { id: 7, nombre: 'Roberto Díaz', email: 'roberto.diaz@example.com', username: 'rdiaz' },
                { id: 10, nombre: 'Sofia Castro', email: 'sofia.castro@example.com', username: 'scastro' },
                { id: 11, nombre: 'Fernando Ortiz', email: 'fernando.ortiz@example.com', username: 'fortiz' }
            ]
        },
        {
            id: 4,
            nivel: 'Avanzado',
            autor: 'Ana Torres',
            nombre: 'QA Team',
            integrantes: 2,
            tickets: 89,
            descripcion: 'Equipo de control de calidad y pruebas automatizadas',
            miembros: [
                { id: 3, nombre: 'Ana Torres', email: 'ana.torres@example.com', username: 'atorres' },
                { id: 9, nombre: 'Diego Moreno', email: 'diego.moreno@example.com', username: 'dmoreno' }
            ]
        },
        {
            id: 5,
            nivel: 'Intermedio',
            autor: 'Pedro Sánchez',
            nombre: 'DevOps Team',
            integrantes: 3,
            tickets: 34,
            descripcion: 'Equipo de infraestructura y despliegue continuo',
            miembros: [
                { id: 5, nombre: 'Pedro Sánchez', email: 'pedro.sanchez@example.com', username: 'psanchez' },
                { id: 1, nombre: 'Carlos Mendoza', email: 'carlos.mendoza@example.com', username: 'cmendoza' },
                { id: 9, nombre: 'Diego Moreno', email: 'diego.moreno@example.com', username: 'dmoreno' }
            ]
        }
    ];

    // Usuario actual simulado (en producción vendría de un servicio de autenticación)
    private currentUserId = 1; // Carlos Mendoza

    constructor() { }

    // Obtener todos los grupos
    getAllGroups(): Observable<Group[]> {
        return of(this.mockGroups);
    }

    // Obtener grupos del usuario actual
    getUserGroups(userId: number = this.currentUserId): Observable<Group[]> {
        const userGroups = this.mockGroups.filter(group =>
            group.miembros.some(miembro => miembro.id === userId)
        );
        return of(userGroups);
    }

    // Obtener un grupo por ID
    getGroupById(id: number): Observable<Group | undefined> {
        const group = this.mockGroups.find(g => g.id === id);
        return of(group);
    }

    // Obtener el ID del usuario actual
    getCurrentUserId(): number {
        return this.currentUserId;
    }
}
