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
      switchMap((filtro: any) => {
        console.log(filtro, 'FILTROO')

        return this.db.collection('riders_coors', ref =>
          ref.where(filtro.vehiculo.field, '==', filtro.vehiculo.value)
            .where(filtro.actividad.field, '==', filtro.actividad.value)
            .where(filtro.relacion.field, '==', filtro.relacion.value)
            .where('isActive', '==', true))
          .valueChanges()
      })
    );


    // this.riders$ = this.rider_query$.pipe(
    //   switchMap(tipo => {

    //     if (this.vehiculo == 'todo') {

    //       if (tipo == 'riders-inactivos') {
    //         return this.db.collection('riders', ref => ref.where('actividad', '==', 'inactivo').where('isAccountActive', '==', true)).valueChanges()
    //       }

    //       if (tipo == 'riders-activos') {
    //         return this.db.collection('riders', ref => ref.where('actividad', '==', 'activo').where('isAccountActive', '==', true)).valueChanges()
    //       }

    //       if (tipo == 'riders-todos') {
    //         return this.db.collection('riders', ref => ref.where('isAccountActive', '==', true)).valueChanges()
    //       }

    //     } else {

    //       if (tipo == 'riders-inactivos') {
    //         return this.db.collection('riders', ref => ref.where('actividad', '==', 'inactivo').where('vehiculo', '==', this.vehiculo).where('isAccountActive', '==', true)).valueChanges()
    //       }

    //       if (tipo == 'riders-activos') {
    //         return this.db.collection('riders', ref => ref.where('actividad', '==', 'activo').where('vehiculo', '==', this.vehiculo).where('isAccountActive', '==', true)).valueChanges()
    //       }

    //       if (tipo == 'riders-todos') {
    //         return this.db.collection('riders', ref => ref.where('vehiculo', '==', this.vehiculo).where('isAccountActive', '==', true)).valueChanges()
    //       }

    //     }

    //     if (tipo == 'rastreo') {
    //       return this.db.collection('riders', ref => ref.where('rider', '==', this.id)).valueChanges()
    //     }

    //   })
    // );

  }


  // ---------------------------
  //        RIDERS
  // ---------------------------

  crearRider(body) {
    return new Promise((resolve, reject) => {
      const url = `${this.apiURL}/dashboard/riders-create-account`;
      this.http.post(url, body).toPromise().then((rider: any) => {
        this.crearRiderFirebase(rider);
        this.crearPedidoFirebase(rider._id);
        resolve(true);
      });
    });
  }

  crearRiderFirebase(rider) {
    const data = {
      cliente: '',
      lat: 0,
      lng: 0,
      pedido: '',
      rider: rider._id,
      nombre: rider.nombre,
      telefono: rider.telefono,
      vehiculo: rider.vehiculo,
      tienePedido: false
    }
    this.db.collection("riders").doc(rider._id).set(data);
  }

  crearPedidoFirebase(id) {
    const data = {
      nuevoPedido: false,
      rider: id,
      pedido: ''
    }
    this.db.collection("pedidos_riders").doc(id).set(data);
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

  findPedidosByPhone(filter) {
    const url = `${this.apiURL}/dashboard/pedidos-get-by-phone`;
    return this.http.post(url, filter).toPromise();
  }

  getRiderByFilter(filter) {
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



  // ---------------------------
  //        EMPRESA
  // ---------------------------


  crearEmpresa(body) {
    const url = `${this.apiURL}/dashboard/empresa-create-account`;
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
