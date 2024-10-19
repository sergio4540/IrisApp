import { Routes } from '@angular/router';
import { LoginComponent } from './auth/pages/login/login.component';
import { ValidarTokenGuard } from './guards/validar-token.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./protected/protected.module').then(m => m.ProtectedModule),
        canActivate:[ValidarTokenGuard],
        canLoad:[ValidarTokenGuard]
      },
      {
        path: '**',
        redirectTo: 'auth'
      },
    //   { path: '**', component: LoginComponent }
];
