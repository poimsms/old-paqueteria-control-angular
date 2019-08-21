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

  title = 'control';
  telefono: number;
  isAuth = false;
  riderNotFound = false;
  vehiculo = '';
  showPopups = false;
  
  constructor(
    public _control: ControlService,
    private _data: DataService,
    private _auth: AuthService,
    private router: Router,
    private _global: GlobalService
  ) {
    this._auth.authState.subscribe(data => {
      this.isAuth = data.isAuth;
    });
    // this.getRiders('riders-activos');
  }

  getRiders(tipo) {
    this._data.queryRidersFirebase(tipo);
  }

  changeVehicle(vehiculo) {
    this.vehiculo = vehiculo;
    this._data.vehiculo = vehiculo;
  }

  trackRider() {

    if (!this.telefono) {
      return;
    }

    this._data.getRiderByPhone(this.telefono).then((res: any) => {

      if (res.ok) {
        this._data.id = res.rider._id;
        this._data.queryRidersFirebase('rastreo');
      } else {
        // rider no encontrado
        this.riderNotFound = true;
        setTimeout(() => {
          this.riderNotFound = false;
        }, 3000);
      }
    });

  }

  openPage(page) {
    this._control.activar(page)
    this.router.navigateByUrl(page);
  }

  openPopup(tipo) {

    this.showPopups = true;

    if (tipo == 'tarifa noche') {
      this._control.map_tarifas = true;
      this._control.map_tarifas_noche = true;
    }

    if (tipo == 'tarifa dia') {
      this._control.map_tarifas = true;
      this._control.map_tarifas_dia = true;
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
