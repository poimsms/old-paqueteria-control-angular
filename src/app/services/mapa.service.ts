import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigService } from './config.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MapaService {
  apiURL: string;

  rider_query$ = new Subject();

  riders$: Observable<any>;

  filtro = {
    vehiculo: {
      field: 'todo',
      value: 'todo'
    },
    actividad: {
      field: 'actividad',
      value: 'ocupado'
    },
    relacion: {
      field: 'relacion',
      value: 'contrato'
    }
  };

  mapTaximetroAction$ = new Subject<any>();

  mapAction$ = new BehaviorSubject<any>({
    accion: 'traer_riders',
    filtro: this.filtro
  });

  riders_action$ = new BehaviorSubject('cargar-mapa');

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

  getRidersByFilter(filtro) {
    return this.db.collection('riders_coors', ref =>
      ref.where(filtro.vehiculo.field, '==', filtro.vehiculo.value)
        .where(filtro.actividad.field, '==', filtro.actividad.value)
        .where(filtro.relacion.field, '==', filtro.relacion.value)
        .where('isOnline', '==', true)
        .where('isActive', '==', true))
      .valueChanges().pipe(take(1)).toPromise();
  }


  trackRider(id) {
    return this.db.collection('riders_coors', ref =>
      ref.where('pedido', '==', id)
        .where('isOnline', '==', true)
        .where('isActive', '==', true))
      .valueChanges().pipe(take(1)).toPromise();
  }

}
