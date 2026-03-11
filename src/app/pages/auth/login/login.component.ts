import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PermissionsService } from '../../../services/permissions.service';
import { AuthService } from '../../../services/auth.service';
import usersData from '../../../services/users.mock.json';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        CardModule,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        FloatLabelModule,
        CheckboxModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    loginForm: FormGroup;
    private returnUrl: string = '/home';

    // Credenciales cargadas desde el JSON
    private validCredentials = usersData.credentials;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private messageService: MessageService,
        private permissionsService: PermissionsService,
        private authService: AuthService
    ) {
        // Obtener la URL de retorno si existe
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            rememberMe: [false]
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            const { email, password } = this.loginForm.value;

            // Validar credenciales contra el JSON
            const validUser = this.validCredentials.find(
                cred => cred.email === email && cred.password === password
            );

            if (validUser) {
                // Cargar el perfil de usuario completo para obtener los permisos
                const userProfile = usersData.users.find(u => u.id === validUser.userId);

                if (userProfile) {
                    // Establecer los permisos del usuario en el servicio
                    if (userProfile.permissions) {
                        this.permissionsService.setPermissions(userProfile.permissions);
                    }

                    // Guardar la sesión del usuario con AuthService
                    this.authService.login({
                        username: userProfile.name,
                        email: userProfile.email,
                        name: userProfile.name,
                        role: userProfile.role,
                        department: userProfile.department,
                        phone: userProfile.phone,
                        joinDate: userProfile.joinDate,
                        status: userProfile.status,
                        address: userProfile.address,
                        city: userProfile.city,
                        country: userProfile.country,
                        bio: userProfile.bio,
                        linkedin: userProfile.linkedin,
                        github: userProfile.github,
                        permissions: userProfile.permissions
                    });

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Login Exitoso',
                        detail: `Bienvenido ${userProfile.name}`,
                        life: 3000
                    });

                    // Navegar a la URL de retorno o a home
                    setTimeout(() => {
                        this.router.navigate([this.returnUrl]);
                    }, 1000);
                }
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error de Autenticación',
                    detail: 'Correo o contraseña incorrectos',
                    life: 3000
                });
            }
        } else {
            this.loginForm.markAllAsTouched();
            this.messageService.add({
                severity: 'warn',
                summary: 'Formulario Inválido',
                detail: 'Por favor, completa todos los campos correctamente',
                life: 3000
            });
        }
    }

    get email() {
        return this.loginForm.get('email');
    }

    get password() {
        return this.loginForm.get('password');
    }
}
