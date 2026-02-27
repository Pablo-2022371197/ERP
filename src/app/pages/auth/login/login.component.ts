import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

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

    // Credenciales hardcodeadas
    private readonly VALID_CREDENTIALS = {
        email: 'admin@erp.com',
        password: 'Admin123!'
    };

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private messageService: MessageService
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            rememberMe: [false]
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            const { email, password } = this.loginForm.value;

            // Validar credenciales
            if (email === this.VALID_CREDENTIALS.email && password === this.VALID_CREDENTIALS.password) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Login Exitoso',
                    detail: 'Bienvenido al sistema ERP',
                    life: 3000
                });

                // Aquí puedes navegar a la página principal
                setTimeout(() => {
                    this.router.navigate(['/home']);
                }, 1000);
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
