import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { EmpresasComponent } from './pages/empresas/empresas.component';
import { AuthGuard } from './guards/auth.guard';
import { PedidosComponent } from './pages/pedidos/pedidos.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { RidersComponent } from './pages/riders/riders.component';

const routes: Routes = [
  { path: '', redirectTo: 'empresas', pathMatch: 'full' },
  { path: 'home', component: HomeComponent,  canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'empresas', component: EmpresasComponent, canActivate: [AuthGuard] },
  { path: 'pedidos', component: PedidosComponent, canActivate: [AuthGuard] },
  { path: 'usuario', component: UsuarioComponent, canActivate: [AuthGuard] },
  { path: 'riders', component: RidersComponent, canActivate: [AuthGuard] },

  { path: '**', component: LoginComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
