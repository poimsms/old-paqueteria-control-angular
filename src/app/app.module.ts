import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ChartsModule } from 'ng2-charts';


export const firebaseConfig = {
  apiKey: "AIzaSyAmlXBSsNgsocMZ15dN8bc1D3ZD0gMAetQ",
  authDomain: "mapa-334c3.firebaseapp.com",
  databaseURL: "https://mapa-334c3.firebaseio.com",
  projectId: "mapa-334c3",
  storageBucket: "",
  messagingSenderId: "905180881415",
  appId: "1:905180881415:web:3d4928246302074a"
};


import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { EmpresasComponent } from './pages/empresas/empresas.component';
import { HeaderComponent } from './pages/header/header.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { RidersComponent } from './pages/riders/riders.component';
import { PopupsHomeComponent } from './components/popups-home/popups-home.component';
import { TaximetroComponent } from './pages/taximetro/taximetro.component';
import { GraficasComponent } from './pages/graficas/graficas.component';
import { CuponesComponent } from './pages/cupones/cupones.component';
import { PagosComponent } from './pages/pagos/pagos.component';
import { CobrosComponent } from './pages/cobros/cobros.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    EmpresasComponent,
    HeaderComponent,
    UsuarioComponent,
    RidersComponent,
    PopupsHomeComponent,
    TaximetroComponent,
    GraficasComponent,
    CuponesComponent,
    PagosComponent,
    CobrosComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AppRoutingModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
