import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigService } from './config.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})

export class DataService {

  apiURL: string;

  id: string;

  vehiculo: string;


  constructor(
    private http: HttpClient,
    private _config: ConfigService,
    private db: AngularFirestore,
    private _auth: AuthService
  ) {
    this.apiURL = this._config.apiURL;
  }


  // ---------------------------
  //        FIREBASE
  // ---------------------------

  createRiderFirebase(rider) {

    const data = {
      cliente_activo: '',
      rechazadoId: '',
      aceptadoId: '',
      pedido: '',
      evento: 1,
      fase: '',
      actividad: 'disponible',
      pedidos_perdidos: 0,
      isOnline: false,
      isActive: true,
      bloqueado: false,
      servicio_cancelado: false,
      nuevaSolicitud: false,
      pagoPendiente: false,
      rider: rider._id
    };

    this.db.collection(this._config.coleccion_riders).doc(rider._id).set(data);
  }

  createRiderCoorsFirebase(rider) {

    const data: any = {
      pagoPendiente: false,
      rider: rider._id,
      ciudad: 'coquimbo_la_serena',
      pedido: '',
      cliente: '',
      evento: 1,
      isActive: true,
      isOnline: false,
      lat: Number((-33.444600 - Math.random() / 100).toFixed(4)),
      lng: Number((-70.655585 - Math.random() / 50).toFixed(3)),
      nombre: rider.nombre,
      telefono: rider.telefono,
      todo: 'todo',
      actividad: 'disponible'
    };

    if (rider.vehiculo == 'Moto') {
      data.vehiculo = 'moto';
    }

    if (rider.vehiculo == 'Auto') {
      data.vehiculo = 'auto';
    }

    if (rider.vehiculo == 'Bicicleta') {
      data.vehiculo = 'bicicleta';
    }

    this.db.collection(this._config.coleccion_coors).doc(rider._id).set(data);
  }

  createModalidadFirebase(rider) {

    const data = {
      cobro_activo: false,
      cobro_libre: 0,
      cobro_turno: 0,
      horas_disponibles: true,
      isTurno: false,
      fee: rider.turnoSet ? 0.3 : 0.2,
      rider: rider._id
    };

    this.db.collection(this._config.coleccion_modalidad).doc(rider._id).set(data);
  }


  updateRiderFirebase(id, tipo, data) {
    if (tipo == 'coors') {
      this.db.doc('riders_coors/' + id).update(data);
    } else {
      this.db.doc('riders/' + id).update(data);
    }
  }

  getRiderFire(telefono) {
    return this.db.collection('riders_coors', ref =>
      ref.where('telefono', '==', telefono))
      .valueChanges().pipe(take(1)).toPromise();
  }

  // ---------------------------
  //        PEDIDOS
  // ---------------------------

  getPedido(id) {
    const url = `${this.apiURL}/dash/pedidos-get-one?id=${id}`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });
    return this.http.get(url, { headers }).toPromise();
  }

  deletePedido(id) {
    const url = `${this.apiURL}/dash/pedidos-delete-one?id=${id}`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });
    return this.http.get(url, { headers }).toPromise();
  }

  updatePedido(id, body) {
    const url = `${this.apiURL}/dash/pedidos-update?id=${id}`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });
    return this.http.put(url, body, { headers }).toPromise();
  }

  // ---------------------------
  //        RIDERS
  // ---------------------------

  findPedidosByPhone_rider(filter) {
    const url = `${this.apiURL}/dash/pedidos-get-by-phone-rider`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });
    return this.http.post(url, filter, { headers }).toPromise();
  }

  getRidersByFilter(body) {
    const url = `${this.apiURL}/dash/riders-get-by-filter`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });
    return this.http.post(url, body, { headers }).toPromise();
  }

  getRiderByPhone(telefono) {
    const url = `${this.apiURL}/dash/riders-get-one-by-phone?telefono=${telefono}`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });
    return this.http.get(url, { headers }).toPromise();
  }

  getBalanceLibre(body) {
    const url = `${this.apiURL}/dash/balance-libre-get`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });
    return this.http.post(url, body, { headers }).toPromise();
  }

  getBalanceTurno(body) {
    const url = `${this.apiURL}/dash/balance-turno-get`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });
    return this.http.post(url, body, { headers }).toPromise();
  }

  updateBalanceLibre(id, body) {
    const url = `${this.apiURL}/dash/balance-libre-update?id=${id}`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });
    return this.http.put(url, body, { headers }).toPromise();
  }

  updateBalanceTurno(id, body) {
    const url = `${this.apiURL}/dash/balance-turno-update?id=${id}`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });
    return this.http.put(url, body, { headers }).toPromise();
  }

  // ---------------------------
  //        EMPRESA
  // ---------------------------

  getEmpresasByFilter(body) {
    const url = `${this.apiURL}/dash/empresas-get-by-filter`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });
    return this.http.post(url, body, { headers }).toPromise();
  }

  findPedidosByPhone_empresa(body) {
    const url = `${this.apiURL}/dash/pedidos-get-by-phone-empresa`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });
    return this.http.post(url, body, { headers }).toPromise();
  }

  // ---------------------------
  //        CUPONES
  // ---------------------------

  getCodigosByFilter(body) {
    const url = `${this.apiURL}/dash/cupones-get-by-filter`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });
    return this.http.post(url, body, { headers }).toPromise();
  }

  createCupon(body) {
    const url = `${this.apiURL}/dash/cupones-create`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });
    return this.http.post(url, body, { headers }).toPromise();
  }

  // ---------------------------
  //        OTROS
  // ---------------------------

  uploadImage(body) {
    const url = `${this.apiURL}/imgs/upload`;
    return this.http.post(url, body).toPromise();
  }

  createAccount(body) {
    const url = `${this.apiURL}/dash/create-account`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });
    return this.http.post(url, body, { headers }).toPromise();
  }

  updateAccount(id, body) {
    const url = `${this.apiURL}/dash/update-account?id=${id}`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });
    return this.http.put(url, body, { headers }).toPromise();
  }

  updateRegistro(body) {
    const url = `${this.apiURL}/dash/registros-de-actividad-riders-update`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });

    return this.http.put(url, body, { headers }).toPromise();
  }

  getRegistros(body) {
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });

    const url = `${this.apiURL}/dash/registros-de-actividad-riders-get-all`;
    return this.http.post(url, body, { headers }).toPromise();
  }

  createBalances(body) {
    const url = `${this.apiURL}/dash/balances-create`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });
    return this.http.post(url, body, { headers }).toPromise();
  }

}
