import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
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
import { DatePicker } from 'primeng/datepicker';
import { Textarea } from 'primeng/textarea';
import { Divider } from 'primeng/divider';

@Component({
    selector: 'app-register',
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
        ToastModule,
        DatePicker,
        Textarea,
        Divider
    ],
    providers: [MessageService],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    registerForm: FormGroup;
    maxDate: Date;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private messageService: MessageService
    ) {
        // Fecha máxima para ser mayor de edad (18 años atrás)
        this.maxDate = new Date();
        this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);

        this.registerForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(4)]],
            fullName: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            birthDate: ['', [Validators.required, this.ageValidator.bind(this)]],
            phone: ['', [Validators.required, this.phoneValidator]],
            address: ['', [Validators.required, Validators.minLength(10)]],
            password: ['', [Validators.required, this.passwordValidator]],
            confirmPassword: ['', [Validators.required]],
            acceptTerms: [false, [Validators.requiredTrue]]
        }, {
            validators: this.passwordMatchValidator
        });
    }

    // Validador personalizado para contraseña
    passwordValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;

        if (!value) {
            return null;
        }

        // Al menos 10 caracteres
        if (value.length < 10) {
            return { minLength: true };
        }

        // Debe contener al menos un símbolo especial
        const specialChars = /[@#$%&*!]/;
        if (!specialChars.test(value)) {
            return { specialChar: true };
        }

        // Debe contener al menos una letra mayúscula
        if (!/[A-Z]/.test(value)) {
            return { upperCase: true };
        }

        // Debe contener al menos una letra minúscula
        if (!/[a-z]/.test(value)) {
            return { lowerCase: true };
        }

        // Debe contener al menos un número
        if (!/[0-9]/.test(value)) {
            return { number: true };
        }

        return null;
    }

    // Validador para teléfono (solo números)
    phoneValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;

        if (!value) {
            return null;
        }

        // Solo números, puede tener entre 7 y 15 dígitos
        const phonePattern = /^[0-9]{7,15}$/;
        if (!phonePattern.test(value)) {
            return { invalidPhone: true };
        }

        return null;
    }

    // Validador para edad (mayor de 18)
    ageValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;

        if (!value) {
            return null;
        }

        const birthDate = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            return { underAge: true };
        }

        return null;
    }

    // Validador para que las contraseñas coincidan
    passwordMatchValidator(form: FormGroup): ValidationErrors | null {
        const password = form.get('password');
        const confirmPassword = form.get('confirmPassword');

        if (password && confirmPassword && password.value !== confirmPassword.value) {
            confirmPassword.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        }

        return null;
    }

    onSubmit() {
        if (this.registerForm.valid) {
            this.messageService.add({
                severity: 'success',
                summary: 'Registro Exitoso',
                detail: 'Tu cuenta ha sido creada exitosamente',
                life: 4000
            });

            console.log('Register data:', this.registerForm.value);

            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                this.router.navigate(['/auth/login']);
            }, 3000);
        } else {
            this.registerForm.markAllAsTouched();
            this.messageService.add({
                severity: 'error',
                summary: 'Formulario Inválido',
                detail: 'Por favor, completa todos los campos correctamente',
                life: 4000
            });
        }
    }

    get username() {
        return this.registerForm.get('username');
    }

    get fullName() {
        return this.registerForm.get('fullName');
    }

    get email() {
        return this.registerForm.get('email');
    }

    get birthDate() {
        return this.registerForm.get('birthDate');
    }

    get phone() {
        return this.registerForm.get('phone');
    }

    get address() {
        return this.registerForm.get('address');
    }

    get password() {
        return this.registerForm.get('password');
    }

    get confirmPassword() {
        return this.registerForm.get('confirmPassword');
    }

    get acceptTerms() {
        return this.registerForm.get('acceptTerms');
    }
}
