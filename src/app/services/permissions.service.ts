import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PermissionsService {
    // Signal para almacenar los permisos del usuario
    private permissions = signal<string[]>([]);

    // ? Por qué se necesita un constructor vacío?
    // * El constructor vacío es necesario para que Angular pueda inyectar esta clase
    // * como un servicio. Aunque no estemos realizando ninguna inicialización específica
    // * en el constructor, Angular requiere que exista para poder crear una instancia 
    // * del servicio y proporcionarla a los componentes o directivas que lo necesiten. 
    // * Sin el constructor, Angular no podría instanciar el servicio correctamente.
    constructor() { }

    /**
     * Establece los permisos del usuario
     * @param permissions Array de permisos
     */
    setPermissions(permissions: string[]): void {
        this.permissions.set(permissions);
    }

    /**
     * Verifica si el usuario tiene un permiso específico
     * @param permission Permiso a verificar
     * @returns true si el usuario tiene el permiso, false en caso contrario
     */
    hasPermission(permission: string): boolean {
        return this.permissions().includes(permission);
    }

    /**
     * Verifica si el usuario tiene al menos uno de los permisos especificados
     * @param permissions Array de permisos a verificar
     * @returns true si el usuario tiene al menos uno de los permisos, false en caso contrario
     */
    hasAnyPermission(permissions: string[]): boolean {
        return permissions.some(permission => this.hasPermission(permission));
    }

    /**
     * Obtiene todos los permisos del usuario
     * @returns Array de permisos
     */
    getPermissions(): string[] {
        return this.permissions();
    }

    /**
     * Limpia todos los permisos
     */
    clearPermissions(): void {
        this.permissions.set([]);
    }
}
