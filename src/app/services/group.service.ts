import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import groupsData from './groups.mock.json';

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
    private mockGroups: Group[] = groupsData.groups;

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
