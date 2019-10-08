import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigService } from './config.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  apiURL: string;

  rider_query$ = new Subject();

  riders$: Observable<any>;

  id: string;

  vehiculo: string;


  constructor(
    private http: HttpClient,
    private _config: ConfigService,
    private db: AngularFirestore,
    private _auth: AuthService
  ) {
    this.apiURL = this._config.apiURL;

    this.riders$ = this.rider_query$.pipe(
      switchMap((data: any) => {

        if (data.tipo == 'filtro') {

          const filtro = data.filtro;

          return this.db.collection('riders_coors', ref =>
            ref.where(filtro.vehiculo.field, '==', filtro.vehiculo.value)
              .where(filtro.actividad.field, '==', filtro.actividad.value)
              .where(filtro.relacion.field, '==', filtro.relacion.value)
              .where('isOnline', '==', true)
              .where('isActive', '==', true))
            .valueChanges();
        }

        if (data.tipo == 'track') {
          return this.db.collection('riders_coors', ref =>
            ref.where('pedido', '==', data.pedido)
              .where('isOnline', '==', true)
              .where('isActive', '==', true))
            .valueChanges();
        }
      })
    );

  }


  // ---------------------------
  //        FIREBASE
  // ---------------------------

  createRiderFirebase(rider) {

    const data = {
      entregadoId: '',
      rechazadoId: '',
      aceptadoId: '',
      pedido: '',
      fase: '',
      actividad: 'disponible',
      isOnline: false,
      isActive: true,
      nuevaSolicitud: false,
      pagoPendiente: false,
      rider: rider._id
    }

    this.db.collection("riders").doc(rider._id).set(data);
  }

  createRiderCoorsFirebase(rider) {

    const data: any = {
      pagoPendiente: false,
      rider: rider._id,
      pedido: '',
      cliente: '',
      isActive: true,
      isOnline: false,
      lat: Number((-33.444600 - Math.random() / 100).toFixed(4)),
      lng: Number((-70.655585 - Math.random() / 50).toFixed(3)),
      nombre: rider.nombre,
      telefono: rider.telefono,
      todo: 'todo',
      actividad: 'disponible'
    }

    rider.vehiculo == 'Moto' ? data.vehiculo = 'moto' : data.vehiculo = 'bici';
    rider.relacion == 'Contrato' ? data.relacion = 'contrato' : data.relacion = 'servicio';
    this.db.collection("riders_coors").doc(rider._id).set(data);
  }

  updateRiderFirebase(id, tipo, data) {
    if (tipo == 'coors') {
      this.db.doc('riders_coors/' + id).update(data);
    } else {
      this.db.doc('riders/' + id).update(data);
    }
  }
  
  queryRidersFirebase(query) {
    this.rider_query$.next(query);
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
    const url = `${this.apiURL}/dash/pedidos-update-one?id=${id}`;
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

}
