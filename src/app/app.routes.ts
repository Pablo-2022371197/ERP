import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/landing/landing.component').then((m) => m.LandingComponent),
    },
    {
        path: '',
        loadComponent: () =>
            import('./layouts/MainLayout/main-layout.component').then((m) => m.MainLayoutComponent),
        children: [
            {
                path: 'home',
                loadComponent: () =>
                    import('./pages/home/home.component').then((m) => m.HomeComponent),
            },
            {
                path: 'group',
                loadComponent: () =>
                    import('./pages/group/group.component').then((m) => m.GroupComponent),
            },
            {
                path: 'user',
                loadComponent: () =>
                    import('./pages/user/user.component').then((m) => m.UserComponent),
            },
        ],
    },
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                loadComponent: () =>
                    import('./pages/auth/login/login.component').then((m) => m.LoginComponent),
            },
            {
                path: 'register',
                loadComponent: () =>
                    import('./pages/auth/register/register.component').then((m) => m.RegisterComponent),
            },
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full',
            },
        ],
    },
];
