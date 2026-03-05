import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PermissionsService } from './services/permissions.service';
import permissionsMock from './services/permissions.mock.json';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  constructor(private permissionsService: PermissionsService) { }

  ngOnInit() {
    // Cargar permisos desde el archivo mock (simula una petición a la API)
    console.log('Cargando permisos:', permissionsMock.permissions);
    this.permissionsService.setPermissions(permissionsMock.permissions);

    // Verificar permisos cargados
    console.log('Permisos activos:', this.permissionsService.getPermissions());
  }
}
