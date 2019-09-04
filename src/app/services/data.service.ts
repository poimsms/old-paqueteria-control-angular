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
  //        RIDERS
  // ---------------------------

  crearCuenta(body) {
    const url = `${this.apiURL}/core/create-account`;
    return this.http.post(url, body).toPromise();
  }

  createRiderFirebase(rider) {

    const data = {
      entregadoId: '',
      rechazadoId: '',
      aceptadoId: '',
      pedido: '',
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
      isOnline: true,
      lat: Number((-33.444600 - Math.random() / 100).toFixed(4)),
      lng: Number((-70.655585 - Math.random() / 50).toFixed(3)),
      nombre: rider.nombre,
      telefono: rider.telefono,
      todo: 'todo',
      actividad: 'disponible'
    }

    rider.vehiculo == 'Moto' ? data.vehiculo = 'moto' : data.vehiculo = 'bici';
    rider.relacion == 'Contrato' ? data.vehiculo = 'contrato' : data.vehiculo = 'servicio';

    this.db.collection("riders_coors").doc(rider._id).set(data);
  }

  updateRiderFirebase(id, data) {
    this.db.doc('riders/' + id).update(data);
  }

  getRiderByPhone(telefono) {
    const url = `${this.apiURL}/core/riders-get-one-by-phone?telefono=${telefono}`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });
    return this.http.get(url, { headers }).toPromise();
  }

  findRiderByPhone_using_options(telefono, body) {
    const url = `${this.apiURL}/core/riders-get-one-by-phone-using-options?telefono=${telefono}`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });
    return this.http.post(url, body, { headers }).toPromise();
  }

  findPedidosByPhoneRider(filter) {
    const url = `${this.apiURL}/core/pedidos-get-by-phone-rider`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });
    return this.http.post(url, filter, { headers }).toPromise();
  }

  getRidersByFilter(body) {
    const url = `${this.apiURL}/core/riders-get-by-filter`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });
    return this.http.post(url, body, { headers }).toPromise();
  }

  findRiders_using_options(body) {
    const url = `${this.apiURL}/core/riders-get-all-using-options`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });
    return this.http.post(url, body, { headers }).toPromise();
  }

  queryRidersFirebase(query) {
    this.rider_query$.next(query);
  }

  riderToggleAccount(body) {
    const url = `${this.apiURL}/core/riders-activation`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });
    return this.http.put(url, body, { headers }).toPromise();
  }

  getPedido(id) {
    const url = `${this.apiURL}/core/pedidos-get-one?id=${id}`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });
    return this.http.get(url, { headers }).toPromise();
  }

  // ---------------------------
  //        EMPRESA
  // ---------------------------


  crearEmpresa(body) {
    const url = `${this.apiURL}/core/empresa-create-account`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });
    return this.http.post(url, body, { headers }).toPromise();
  }

  getEmpresasByFilter(body) {
    const url = `${this.apiURL}/core/empresas-get-by-filter`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });
    return this.http.post(url, body, { headers }).toPromise();
  }

  findPedidosByPhoneEmpresa(body) {
    const url = `${this.apiURL}/core/pedidos-get-by-phone-empresa`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });
    return this.http.post(url, body, { headers }).toPromise();
  }

  // ---------------------------
  //        IMAGENES
  // ---------------------------


  uploadImage(body) {
    const url = `${this.apiURL}/imgs/upload`;
    return this.http.post(url, body).toPromise();
  }



  // ---------------------------
  //        AUXILIAR
  // ---------------------------

  crearAdmin() {
    const url = `${this.apiURL}/usuarios/admin-signup`;

    const body = {
      cuenta: 293812,
      password: '389203'
    };

    return this.http.post(url, body).toPromise();
  }

  crearBalance() {
    const url = `${this.apiURL}/core/riders-create-balance`;

    const body = {
      rider: '5d3f2e0255266a733cd4242b',
      inicio: 'Lunes 05 - Agosto',
      fin: 'Domingo 11 - Agosto',
      year: 2019
    };

    return this.http.post(url, body).toPromise();
  }
}
