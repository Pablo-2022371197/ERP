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
        CheckboxModule
    ],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    registerForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            fullName: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]],
            acceptTerms: [false, [Validators.requiredTrue]]
        }, {
            validators: this.passwordMatchValidator
        });
    }

    passwordMatchValidator(form: FormGroup) {
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
            console.log('Register data:', this.registerForm.value);
            // Aquí implementarías la lógica de registro
            // this.router.navigate(['/auth/login']);
        } else {
            this.registerForm.markAllAsTouched();
        }
    }

    get fullName() {
        return this.registerForm.get('fullName');
    }

    get email() {
        return this.registerForm.get('email');
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
