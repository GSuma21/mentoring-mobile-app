import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CommonRoutes } from 'src/global.routes';
import { PublicGuard } from './core/guards/canActivate/public.guard';
import { PrivateGuard } from './core/guards/private.guard';
import { PrivateModule } from './modules/private/private.module';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/private/private.module').then(m => m.PrivateModule),
  },
  {
    path: CommonRoutes.AUTH,
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthPageModule),
    canActivate:[PublicGuard]
  },
  {
    path: '',
    redirectTo: CommonRoutes.AUTH,
    pathMatch: 'full'
  }
  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
