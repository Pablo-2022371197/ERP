import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        ChartModule,
        TableModule,
        ButtonModule,
        TagModule,
        AvatarModule
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    // Stats Cards
    stats = [
        {
            title: 'Ventas del Mes',
            value: '$45,231',
            change: '+12.5%',
            changeType: 'positive',
            icon: 'pi-shopping-cart',
            color: '#667eea'
        },
        {
            title: 'Nuevos Clientes',
            value: '234',
            change: '+8.2%',
            changeType: 'positive',
            icon: 'pi-users',
            color: '#10b981'
        },
        {
            title: 'Productos Vendidos',
            value: '1,843',
            change: '+4.3%',
            changeType: 'positive',
            icon: 'pi-box',
            color: '#f59e0b'
        },
        {
            title: 'Ingresos Totales',
            value: '$128,459',
            change: '-2.1%',
            changeType: 'negative',
            icon: 'pi-dollar',
            color: '#ef4444'
        }
    ];

    // Sales Chart Data
    salesChartData: any;
    salesChartOptions: any;

    // Revenue Chart Data
    revenueChartData: any;
    revenueChartOptions: any;

    // Recent Orders
    recentOrders = [
        {
            id: '#ORD-1234',
            customer: 'María García',
            product: 'Laptop Dell',
            amount: '$1,299',
            status: 'Completado',
            date: '2026-02-25'
        },
        {
            id: '#ORD-1235',
            customer: 'Carlos Rodríguez',
            product: 'Mouse Logitech',
            amount: '$49',
            status: 'Pendiente',
            date: '2026-02-25'
        },
        {
            id: '#ORD-1236',
            customer: 'Ana Martínez',
            product: 'Teclado Mecánico',
            amount: '$159',
            status: 'Procesando',
            date: '2026-02-24'
        },
        {
            id: '#ORD-1237',
            customer: 'Luis Fernández',
            product: 'Monitor Samsung',
            amount: '$349',
            status: 'Completado',
            date: '2026-02-24'
        },
        {
            id: '#ORD-1238',
            customer: 'Patricia López',
            product: 'Webcam HD',
            amount: '$89',
            status: 'Cancelado',
            date: '2026-02-23'
        }
    ];

    // Top Products
    topProducts = [
        { name: 'Laptop Dell XPS', sales: 145, revenue: '$188,355' },
        { name: 'iPhone 15 Pro', sales: 98, revenue: '$156,800' },
        { name: 'Mouse Logitech MX', sales: 234, revenue: '$11,466' },
        { name: 'Teclado Mecánico', sales: 187, revenue: '$29,733' },
        { name: 'Monitor Samsung 27"', sales: 76, revenue: '$26,524' }
    ];

    ngOnInit() {
        this.initCharts();
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);

        // Sales Chart
        this.salesChartData = {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [
                {
                    label: 'Ventas 2026',
                    data: [65, 59, 80, 81, 56, 55, 70, 85, 90, 78, 95, 88],
                    fill: true,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Ventas 2025',
                    data: [45, 49, 70, 71, 46, 45, 60, 75, 78, 68, 82, 75],
                    fill: true,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4
                }
            ]
        };

        this.salesChartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: '#495057',
                        font: {
                            family: 'Inter'
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057',
                        font: {
                            family: 'Inter'
                        }
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057',
                        font: {
                            family: 'Inter'
                        }
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        // Revenue Chart
        this.revenueChartData = {
            labels: ['Electrónica', 'Ropa', 'Alimentos', 'Hogar', 'Deportes'],
            datasets: [
                {
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: ['#667eea', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                    hoverBackgroundColor: ['#5568d3', '#0ea572', '#dc8b0a', '#dc2626', '#7c3aed']
                }
            ]
        };

        this.revenueChartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 1,
            plugins: {
                legend: {
                    labels: {
                        color: '#495057',
                        font: {
                            family: 'Inter'
                        }
                    }
                }
            }
        };
    }

    getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        const severityMap: { [key: string]: 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' } = {
            Completado: 'success',
            Pendiente: 'warn',
            Procesando: 'info',
            Cancelado: 'danger'
        };
        return severityMap[status] || 'info';
    }

    getCustomerInitials(name: string): string {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
}
