# Sistema de Permisos

## Descripción
Sistema de permisos implementado con Angular signals para controlar el acceso a funcionalidades en la aplicación.

## Archivos Creados

### 1. permissions.mock.json
Archivo JSON que simula la respuesta de una API con los permisos disponibles.

### 2. permissions.service.ts
Servicio que maneja los permisos del usuario usando signals de Angular.

**Métodos disponibles:**
- `setPermissions(permissions: string[])`: Establece los permisos del usuario
- `hasPermission(permission: string)`: Verifica si tiene un permiso específico
- `hasAnyPermission(permissions: string[])`: Verifica si tiene al menos uno de los permisos
- `getPermissions()`: Obtiene todos los permisos actuales
- `clearPermissions()`: Limpia todos los permisos

### 3. if-has-permission.directive.ts
Directiva estructural que muestra/oculta elementos según los permisos del usuario.

## Permisos Disponibles

### Groups
- `groups_view`: Ver listado de grupos
- `group_view`: Ver un grupo específico
- `groups_edit`: Editar grupos
- `group_delete`: Eliminar un grupo
- `groups_delete`: Eliminar múltiples grupos
- `groups_add`: Agregar grupos
- `group_add`: Agregar un grupo

### Users
- `users_view`: Ver listado de usuarios
- `user_view`: Ver un usuario específico
- `users_edit`: Editar usuarios
- `user_edit`: Editar un usuario
- `user_delete`: Eliminar usuario
- `user_add`: Agregar usuario

### Tickets
- `tickets_view`: Ver listado de tickets
- `ticket_view`: Ver un ticket específico
- `tickets_edit`: Editar tickets
- `ticket_edit`: Editar un ticket
- `ticket_delete`: Eliminar ticket
- `ticket_add`: Agregar un ticket
- `tickets_add`: Agregar tickets

## Uso

### 1. Cargar permisos al inicializar la aplicación

```typescript
import { Component, OnInit } from '@angular/core';
import { PermissionsService } from './services/permissions.service';
import permissionsMock from './services/permissions.mock.json';

export class AppComponent implements OnInit {
  constructor(private permissionsService: PermissionsService) {}

  ngOnInit() {
    // Cargar permisos desde el mock o desde una API
    this.permissionsService.setPermissions(permissionsMock.permissions);
    
    // O desde una API:
    // this.http.get<{permissions: string[]}>('/api/permissions')
    //   .subscribe(data => this.permissionsService.setPermissions(data.permissions));
  }
}
```

### 2. Usar la directiva en templates

```html
<!-- Mostrar elemento si tiene el permiso específico -->
<button *ifHasPermission="'groups_add'">Agregar Grupo</button>

<!-- Mostrar elemento si tiene al menos uno de los permisos -->
<div *ifHasPermission="['groups_view', 'group_view']">
  <p>Contenido visible con cualquiera de estos permisos</p>
</div>

<!-- Ejemplo completo -->
<div class="admin-panel">
  <button *ifHasPermission="'users_add'" (click)="addUser()">
    Agregar Usuario
  </button>
  
  <button *ifHasPermission="'users_delete'" (click)="deleteUser()">
    Eliminar Usuario
  </button>
  
  <section *ifHasPermission="['groups_view', 'users_view']">
    <h2>Panel de Administración</h2>
  </section>
</div>
```

### 3. Verificar permisos en el código TypeScript

```typescript
import { Component } from '@angular/core';
import { PermissionsService } from './services/permissions.service';

export class MyComponent {
  constructor(private permissionsService: PermissionsService) {}

  performAction() {
    if (this.permissionsService.hasPermission('groups_edit')) {
      // Realizar acción
      console.log('Usuario tiene permiso para editar grupos');
    }
  }

  canAccessAdmin() {
    return this.permissionsService.hasAnyPermission([
      'users_view',
      'groups_view',
      'tickets_view'
    ]);
  }
}
```

### 4. Importar la directiva en componentes

```typescript
import { Component } from '@angular/core';
import { IfHasPermissionDirective } from './directives/if-has-permission.directive';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [IfHasPermissionDirective],
  templateUrl: './my-component.html'
})
export class MyComponent {}
```

## Notas
- La directiva reacciona automáticamente a cambios en los permisos gracias a los signals de Angular
- Los permisos se pueden actualizar en tiempo real llamando a `setPermissions()` nuevamente
- La directiva soporta tanto un permiso individual (string) como múltiples permisos (array)
