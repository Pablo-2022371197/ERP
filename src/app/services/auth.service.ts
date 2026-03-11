import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface CurrentUser {
    username: string;
    email: string;
    name: string;
    role: string;
    department: string;
    phone: string;
    joinDate: string;
    status: string;
    address: string;
    city: string;
    country: string;
    bio: string;
    linkedin: string;
    github: string;
    permissions: string[];
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly STORAGE_KEY = 'currentUser';
    private currentUserSignal = signal<CurrentUser | null>(null);

    constructor(private router: Router) {
        // Cargar usuario desde localStorage al inicializar
        this.loadUserFromStorage();
    }

    private loadUserFromStorage(): void {
        const userJson = localStorage.getItem(this.STORAGE_KEY);
        if (userJson) {
            try {
                const user = JSON.parse(userJson);
                this.currentUserSignal.set(user);
            } catch (error) {
                console.error('Error al cargar usuario desde localStorage:', error);
                localStorage.removeItem(this.STORAGE_KEY);
            }
        }
    }

    login(user: CurrentUser): void {
        this.currentUserSignal.set(user);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    }

    logout(): void {
        this.currentUserSignal.set(null);
        localStorage.removeItem(this.STORAGE_KEY);
        this.router.navigate(['/login']);
    }

    getCurrentUser(): CurrentUser | null {
        return this.currentUserSignal();
    }

    isAuthenticated(): boolean {
        return this.currentUserSignal() !== null;
    }

    getUserName(): string {
        const user = this.currentUserSignal();
        return user ? user.name : '';
    }

    getUserUsername(): string {
        const user = this.currentUserSignal();
        return user ? user.username : '';
    }

    getUserEmail(): string {
        const user = this.currentUserSignal();
        return user ? user.email : '';
    }

    getUserInitials(): string {
        const user = this.currentUserSignal();
        if (!user) return '';
        return user.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
    }
}
