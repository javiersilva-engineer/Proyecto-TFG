import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'registro',
    pathMatch: 'full'
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then(m => m.RegistroPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'form-objetivo-1',
    loadChildren: () => import('./pages/form-objetivo-1/form-objetivo-1.module').then(m => m.FormObjetivo1PageModule)
  },
  {
    path: 'form-objetivo-2',
    loadChildren: () => import('./pages/form-objetivo-2/form-objetivo-2.module').then(m => m.FormObjetivo2PageModule)
  },
  {
    path: 'form-objetivo-2',
    loadChildren: () => import('./pages/form-objetivo-2/form-objetivo-2.module').then(m => m.FormObjetivo2PageModule)
  },
  {
    path: 'form-objetivo-3',
    loadChildren: () => import('./pages/form-objetivo-3/form-objetivo-3.module').then(m => m.FormObjetivo3PageModule)
  },
  {
    path: 'form-objetivo-4',
    loadChildren: () => import('./pages/form-objetivo-4/form-objetivo-4.module').then(m => m.FormObjetivo4PageModule)
  },
  {
    path: 'enfo-gestiona-1',
    loadChildren: () => import('./pages/enfo-gestiona-1/enfo-gestiona-1.module').then(m => m.EnfoGestiona1PageModule)
  },
  {
    path: 'enfo-gestiona-2',
    loadChildren: () => import('./pages/enfo-gestiona-2/enfo-gestiona-2.module').then(m => m.EnfoGestiona2PageModule)
  },
  {
    path: 'fin-registro',
    loadChildren: () => import('./pages/fin-registro/fin-registro.module').then(m => m.FinRegistroPageModule)
  },
  {
    path: 'comidas-1',
    loadChildren: () => import('./pages/comidas-1/comidas-1.module').then(m => m.Comidas1PageModule)
  },
  {
    path: 'recetas-1',
    loadChildren: () => import('./pages/recetas-1/recetas-1.module').then(m => m.Recetas1PageModule)
  },
  {
    path: 'recetas-2/:id',
    loadChildren: () => import('./pages/recetas-2/recetas-2.module').then(m => m.Recetas2PageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
