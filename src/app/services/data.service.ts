import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigService } from './config.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription, Subject, BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
    private db: AngularFirestore
  ) {
    this.apiURL = this._config.apiURL;

    this.riders$ = this.rider_query$.pipe(
      switchMap((data: any) => {

        if (data.tipo == 'filtro') {
          const filtro = data.filtro;
          console.log(filtro)
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
    const url = `${this.apiURL}/dashboard/signup`;
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
    const url = `${this.apiURL}/dashboard/riders-get-one-by-phone?telefono=${telefono}`;
    return this.http.get(url).toPromise();
  }

  findRiderByPhone_using_options(telefono, options) {
    const url = `${this.apiURL}/dashboard/riders-get-one-by-phone-using-options?telefono=${telefono}`;
    return this.http.post(url, options).toPromise();
  }

  findPedidosByPhoneRider(filter) {
    const url = `${this.apiURL}/dashboard/pedidos-get-by-phone-rider`;
    return this.http.post(url, filter).toPromise();
  }

  getRidersByFilter(filter) {
    const url = `${this.apiURL}/dashboard/riders-get-by-filter`;
    return this.http.post(url, filter).toPromise();
  }

  findRiders_using_options(options) {
    const url = `${this.apiURL}/dashboard/riders-get-all-using-options`;
    return this.http.post(url, options).toPromise();
  }

  queryRidersFirebase(query) {
    this.rider_query$.next(query);
  }

  riderToggleAccount(body) {
    const url = `${this.apiURL}/dashboard/riders-activation`;
    return this.http.put(url, body).toPromise();
  }

  getPedido(id) {
    const url = `${this.apiURL}/dashboard/pedidos-get-one?id=${id}`;
    return this.http.get(url).toPromise();
  }

  // ---------------------------
  //        EMPRESA
  // ---------------------------


  crearEmpresa(body) {
    const url = `${this.apiURL}/dashboard/empresa-create-account`;
    return this.http.post(url, body).toPromise();
  }

  getEmpresasByFilter(filter) {
    const url = `${this.apiURL}/dashboard/empresas-get-by-filter`;
    return this.http.post(url, filter).toPromise();
  }

  findPedidosByPhoneEmpresa(filter) {
    const url = `${this.apiURL}/dashboard/pedidos-get-by-phone-empresa`;
    return this.http.post(url, filter).toPromise();
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
    const url = `${this.apiURL}/dashboard/riders-create-balance`;

    const body = {
      rider: '5d3f2e0255266a733cd4242b',
      inicio: 'Lunes 05 - Agosto',
      fin: 'Domingo 11 - Agosto',
      year: 2019
    };

    return this.http.post(url, body).toPromise();
  }
}
