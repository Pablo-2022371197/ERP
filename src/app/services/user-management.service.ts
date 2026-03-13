import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import usersData from './users.mock.json';

export interface UserManagement {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    department: string;
    permissions: string[];
}

@Injectable({
    providedIn: 'root'
})
export class UserManagementService {
    private readonly STORAGE_KEY = 'erp_users';
    private users: UserManagement[] = [];

    constructor() {
        this.loadUsers();
    }

    // Cargar usuarios desde localStorage o mock
    private loadUsers(): void {
        const storedUsers = localStorage.getItem(this.STORAGE_KEY);
        if (storedUsers) {
            try {
                this.users = JSON.parse(storedUsers);
            } catch (error) {
                console.error('Error al cargar usuarios desde localStorage:', error);
                this.users = usersData.users.map(user => ({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    department: user.department,
                    permissions: user.permissions
                }));
                this.saveToLocalStorage();
            }
        } else {
            // Primera vez, cargar desde mock
            this.users = usersData.users.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                department: user.department,
                permissions: user.permissions
            }));
            this.saveToLocalStorage();
        }
    }

    // Guardar usuarios en localStorage
    private saveToLocalStorage(): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.users));
    }

    // Obtener todos los usuarios
    getAllUsers(): Observable<UserManagement[]> {
        return of([...this.users]);
    }

    // Obtener un usuario por ID
    getUserById(id: number): Observable<UserManagement | undefined> {
        const user = this.users.find(u => u.id === id);
        return of(user ? { ...user } : undefined);
    }

    // Actualizar permisos de un usuario
    updateUserPermissions(userId: number, permissions: string[]): Observable<UserManagement | null> {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            this.users[userIndex] = {
                ...this.users[userIndex],
                permissions: [...permissions]
            };
            this.saveToLocalStorage();
            return of({ ...this.users[userIndex] });
        }
        return of(null);
    }

    // Actualizar usuario completo
    updateUser(userId: number, userData: Partial<UserManagement>): Observable<UserManagement | null> {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            this.users[userIndex] = {
                ...this.users[userIndex],
                ...userData
            };
            this.saveToLocalStorage();
            return of({ ...this.users[userIndex] });
        }
        return of(null);
    }

    // Eliminar un usuario
    deleteUser(id: number): Observable<boolean> {
        const initialLength = this.users.length;
        this.users = this.users.filter(u => u.id !== id);
        if (this.users.length < initialLength) {
            this.saveToLocalStorage();
            return of(true);
        }
        return of(false);
    }
}
