import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ControlService } from './services/control.service';
import { AuthService } from './services/auth.service';
import { DataService } from './services/data.service';
import { GlobalService } from './services/global.service';
import { MapaService } from './services/mapa.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild('origin') origin: ElementRef;
  @ViewChild('destination') destination: ElementRef;

  pedidoID: string;
  isAuth = false;
  vehiculo = '';
  showPopups = false;
  usuario: any;

  constructor(
    public _control: ControlService,
    private _data: DataService,
    private _mapa: MapaService,
    private _auth: AuthService,
    private router: Router,
    public _global: GlobalService
  ) {
    this._auth.authState.subscribe(data => {
      this.isAuth = data.isAuth;
      if (data.isAuth) {
        this._global.getTarifas();
        this.usuario = data.usuario;
      }
    });
  }

  changeVehicle(vehiculo) {
    this.vehiculo = vehiculo;
    this._data.vehiculo = vehiculo;
  }

  trackRider() {

    if (!this._control.pedidoID) {
      return;
    }

    this._data.getPedido(this._control.pedidoID).then((pedido: any) => {
      this._control.pedido = pedido;
      this._control.rider = pedido.rider;
      this._control.origen = { lat: pedido.origen.lat, lng: pedido.origen.lng };
      this._control.destino = { lat: pedido.destino.lat, lng: pedido.destino.lng };
      this._mapa.mapAction$.next({ accion: 'rastrear_rider', pedidoID: pedido._id });
      this._mapa.mapAction$.next({ accion: 'graficar_ruta' });
      this._control.isTracking = true;
    });

  }

  openPage(page) {
    this._control.activar(page)
    this.router.navigateByUrl(page);
  }

  openPopup(tipo) {

    this.showPopups = true;

    if (tipo == 'tarifa noche') {
      this._global.show_tarifas_noche = true;
    }

    if (tipo == 'tarifa dia') {
      this._global.show_tarifas_dia = true;
    }

    if (tipo == 'reiniciar rider') {
      this._control.reiniciar_rider = true;
    }

    if (tipo == 'filtros') {
      this._control.map_filtros = true;
    }
  }

  logout() {
    this._auth.logout();
  }
}
