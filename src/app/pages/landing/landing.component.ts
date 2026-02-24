import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { NavbarComponent } from '../../components/header/navbar.component';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, CardModule, NavbarComponent],
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.css']
})
export class LandingComponent {
    features = [
        {
            icon: 'pi-chart-line',
            title: 'Análisis Avanzado',
            description: 'Obtén insights profundos con nuestras herramientas de análisis en tiempo real.'
        },
        {
            icon: 'pi-shield',
            title: 'Seguridad Total',
            description: 'Protección de datos de nivel empresarial con cifrado de extremo a extremo.'
        },
        {
            icon: 'pi-users',
            title: 'Colaboración',
            description: 'Trabajo en equipo fluido con herramientas de colaboración integradas.'
        },
        {
            icon: 'pi-mobile',
            title: 'Multiplataforma',
            description: 'Accede desde cualquier dispositivo, en cualquier momento y lugar.'
        },
        {
            icon: 'pi-cog',
            title: 'Automatización',
            description: 'Automatiza procesos repetitivos y ahorra tiempo valioso.'
        },
        {
            icon: 'pi-cloud',
            title: 'Cloud Computing',
            description: 'Infraestructura en la nube escalable y confiable.'
        }
    ];

    benefits = [
        {
            number: '01',
            title: 'Aumenta tu Productividad',
            description: 'Optimiza tus procesos empresariales y aumenta la eficiencia hasta un 40%.'
        },
        {
            number: '02',
            title: 'Reduce Costos',
            description: 'Ahorra hasta un 30% en costos operativos con nuestra automatización inteligente.'
        },
        {
            number: '03',
            title: 'Toma Mejores Decisiones',
            description: 'Accede a datos en tiempo real para tomar decisiones informadas y estratégicas.'
        }
    ];

    pricingPlans = [
        {
            name: 'Básico',
            price: '29',
            description: 'Perfecto para pequeños equipos',
            features: [
                'Hasta 5 usuarios',
                '10 GB de almacenamiento',
                'Soporte por email',
                'Reportes básicos'
            ],
            highlighted: false
        },
        {
            name: 'Profesional',
            price: '79',
            description: 'Ideal para empresas en crecimiento',
            features: [
                'Hasta 25 usuarios',
                '100 GB de almacenamiento',
                'Soporte prioritario 24/7',
                'Reportes avanzados',
                'Integraciones ilimitadas',
                'API personalizada'
            ],
            highlighted: true
        },
        {
            name: 'Empresarial',
            price: '199',
            description: 'Para grandes organizaciones',
            features: [
                'Usuarios ilimitados',
                '1 TB de almacenamiento',
                'Soporte dedicado',
                'Análisis avanzado',
                'Personalización completa',
                'Capacitación incluida'
            ],
            highlighted: false
        }
    ];

    scrollToSection(sectionId: string) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
}
