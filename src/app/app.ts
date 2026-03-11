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

  // Simular la carga de permisos al iniciar la aplicación
  // ? Se pueden cargar los permisos al hacer inicio de sesión desde aquí?
  // ? O se deben cargar desde el AuthService al hacer login?
  // * Para mantener la separación de responsabilidades, lo ideal es cargar los permisos desde 
  // * el AuthService al hacer login. De esta manera, el AppComponent se mantiene enfocado en
  // * la estructura general de la aplicación, mientras que el AuthService se encarga de
  // * gestionar la autenticación y autorización del usuario. Sin embargo, para propósitos de
  // * demostración o pruebas, también es válido cargar los permisos directamente en el
  // * AppComponent como se muestra en este ejemplo.
  ngOnInit() {
    // Cargar permisos desde el archivo mock (simula una petición a la API)
    // console.log('Cargando permisos:', permissionsMock.permissions);
    // this.permissionsService.setPermissions(permissionsMock.permissions);

    // Verificar permisos cargados
    console.log('Permisos activos:', this.permissionsService.getPermissions());
  }
}
