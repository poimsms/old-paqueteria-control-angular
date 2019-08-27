import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ControlService } from './services/control.service';
import { AuthService } from './services/auth.service';
import { DataService } from './services/data.service';
import { GlobalService } from './services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  pedidoID: string;
  isAuth = false;
  vehiculo = '';
  showPopups = false;

  constructor(
    public _control: ControlService,
    private _data: DataService,
    private _auth: AuthService,
    private router: Router,
    public _global: GlobalService
  ) {
    this._auth.authState.subscribe(data => {
      this.isAuth = data.isAuth;
    }); 
  }

  getRiders(tipo) {
    this._data.queryRidersFirebase(tipo);
  }

  changeVehicle(vehiculo) {
    this.vehiculo = vehiculo;
    this._data.vehiculo = vehiculo;
  }

  trackRider() {

    if (!this.pedidoID) {
      return;
    }

    this._data.getPedido(this.pedidoID).then((pedido: any) => {
      this._control.origen = { lat: pedido.origen.lat, lng: pedido.origen.lng };
      this._control.destino = { lat: pedido.destino.lat, lng: pedido.destino.lng };
      this._data.queryRidersFirebase({ tipo: 'track', pedido: this.pedidoID });
      this._control.isTracking = true;
    });

  }

  refreshMap() {

    this._control.origen = null;
    this._control.destino = null;
    this.pedidoID = undefined;

    this._control.lat = Number((-33.44 - Math.random() / 1000).toFixed(5));
    this._control.lng = Number((-70.64 - Math.random() / 1000).toFixed(5));

    this._control.zoom = 13;
    setTimeout(() => {
      this._control.zoom = 14;
    }, 100);

    this._control.isTracking = false;
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

    if (tipo == 'horario') {
      this._control.map_horario = true;
    }

    if (tipo == 'filtros') {
      this._control.map_filtros = true;
    }
  }

  logout() {
    this._auth.logout();
  }

}
