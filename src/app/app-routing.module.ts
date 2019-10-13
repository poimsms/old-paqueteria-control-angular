import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { EmpresasComponent } from './pages/empresas/empresas.component';
import { AuthGuard } from './guards/auth.guard';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { RidersComponent } from './pages/riders/riders.component';
import { TaximetroComponent } from './pages/taximetro/taximetro.component';
import { GraficasComponent } from './pages/graficas/graficas.component';
import { CuponesComponent } from './pages/cupones/cupones.component';

const routes: Routes = [
  { path: '', redirectTo: 'empresas', pathMatch: 'full' },
  { path: 'home', component: HomeComponent,  canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'empresas', component: EmpresasComponent, canActivate: [AuthGuard] },
  { path: 'usuario', component: UsuarioComponent, canActivate: [AuthGuard] },
  { path: 'riders', component: RidersComponent, canActivate: [AuthGuard] },
  { path: 'taximetro', component: TaximetroComponent, canActivate: [AuthGuard] },
  { path: 'graficas', component: GraficasComponent, canActivate: [AuthGuard] },
  { path: 'cupones', component: CuponesComponent, canActivate: [AuthGuard] },


  { path: '**', component: LoginComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
