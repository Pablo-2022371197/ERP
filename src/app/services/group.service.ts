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
    private readonly STORAGE_KEY = 'erp_groups';
    private groups: Group[] = [];

    constructor() {
        this.loadGroups();
    }

    // Cargar grupos desde localStorage o mock
    private loadGroups(): void {
        const storedGroups = localStorage.getItem(this.STORAGE_KEY);
        if (storedGroups) {
            try {
                this.groups = JSON.parse(storedGroups);
            } catch (error) {
                console.error('Error al cargar grupos desde localStorage:', error);
                this.groups = groupsData.groups;
                this.saveToLocalStorage();
            }
        } else {
            // Primera vez, cargar desde mock
            this.groups = groupsData.groups;
            this.saveToLocalStorage();
        }
    }

    // Guardar grupos en localStorage
    private saveToLocalStorage(): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.groups));
    }

    // Obtener todos los grupos
    getAllGroups(): Observable<Group[]> {
        return of([...this.groups]);
    }

    // Obtener grupos del usuario actual por username
    getUserGroupsByUsername(username: string): Observable<Group[]> {
        const userGroups = this.groups.filter(group =>
            group.miembros.some(miembro => miembro.username === username)
        );
        return of([...userGroups]);
    }

    // Obtener grupos del usuario actual por email
    getUserGroupsByEmail(email: string): Observable<Group[]> {
        const userGroups = this.groups.filter(group =>
            group.miembros.some(miembro => miembro.email === email)
        );
        return of([...userGroups]);
    }

    // Obtener grupos del usuario actual por ID
    getUserGroups(userId?: number): Observable<Group[]> {
        if (userId) {
            const userGroups = this.groups.filter(group =>
                group.miembros.some(miembro => miembro.id === userId)
            );
            return of([...userGroups]);
        }
        return of([...this.groups]);
    }

    // Obtener un grupo por ID
    getGroupById(id: number): Observable<Group | undefined> {
        const group = this.groups.find(g => g.id === id);
        return of(group ? { ...group } : undefined);
    }

    // Crear un nuevo grupo
    createGroup(group: Omit<Group, 'id'>): Observable<Group> {
        const newId = Math.max(...this.groups.map(g => g.id), 0) + 1;
        const newGroup: Group = {
            ...group,
            id: newId
        };
        this.groups = [...this.groups, newGroup];
        this.saveToLocalStorage();
        return of({ ...newGroup });
    }

    // Actualizar un grupo existente
    updateGroup(id: number, groupData: Partial<Group>): Observable<Group | null> {
        const index = this.groups.findIndex(g => g.id === id);
        if (index !== -1) {
            this.groups[index] = {
                ...this.groups[index],
                ...groupData,
                id // Asegurar que el ID no cambie
            };
            this.saveToLocalStorage();
            return of({ ...this.groups[index] });
        }
        return of(null);
    }

    // Eliminar un grupo
    deleteGroup(id: number): Observable<boolean> {
        const initialLength = this.groups.length;
        this.groups = this.groups.filter(g => g.id !== id);
        if (this.groups.length < initialLength) {
            this.saveToLocalStorage();
            return of(true);
        }
        return of(false);
    }

    // Obtener todos los usuarios únicos de todos los grupos
    getAllAvailableUsers(): Observable<User[]> {
        const usersMap = new Map<number, User>();
        this.groups.forEach(group => {
            group.miembros.forEach(user => {
                if (!usersMap.has(user.id)) {
                    usersMap.set(user.id, user);
                }
            });
        });
        return of(Array.from(usersMap.values()));
    }

    // Obtener el ID del usuario actual
    getCurrentUserId(): number {
        return 1; // Esto debería venir del AuthService
    }
}
