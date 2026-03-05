import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, effect } from '@angular/core';
import { PermissionsService } from '../services/permissions.service';

@Directive({
    selector: '[ifHasPermission]',
    standalone: true
})
export class IfHasPermissionDirective implements OnInit {
    private permission: string | string[] = '';
    private hasView = false;

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private permissionsService: PermissionsService
    ) {
        // Effect para reaccionar a cambios en los permisos
        effect(() => {
            // Acceder a los permisos para registrar el efecto
            this.permissionsService.getPermissions();
            this.updateView();
        });
    }

    @Input() set ifHasPermission(permission: string | string[]) {
        this.permission = permission;
        this.updateView();
    }

    ngOnInit(): void {
        this.updateView();
    }

    private updateView(): void {
        const hasPermission = this.checkPermission();

        if (hasPermission && !this.hasView) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.hasView = true;
        } else if (!hasPermission && this.hasView) {
            this.viewContainer.clear();
            this.hasView = false;
        }
    }

    private checkPermission(): boolean {
        if (!this.permission) {
            return false;
        }

        if (Array.isArray(this.permission)) {
            // Si es un array, verificar si tiene al menos uno de los permisos
            return this.permissionsService.hasAnyPermission(this.permission);
        } else {
            // Si es un string, verificar el permiso específico
            return this.permissionsService.hasPermission(this.permission);
        }
    }
}
