import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class ControlService {

  isMapa = true;
  isMapaActivos = true;
  isMapaTodo = false;
  isTaximetro = false;
  isGraficas = false;
  isRiders = false;
  isEmpresas = false;
  isPedidos = false;
  isCupones = false;
  stretched = false;

  map_filtros = false;
  map_tarifas = false;
  map_tarifas_noche = false;
  map_tarifas_dia = false;
  map_horario = false;
  reiniciar_rider = false;
  isTracking = false;

  isLoading = false;

  lat = -33.444600;
  lng = -70.655585;
  zoom = 14;
  origen: any;
  destino: any;

  origen_taximetro: any;
  destino_taximetro: any;

  pedidoID: string;
  rider: any;
  pedido: string;

  mostrar = false;

  map_filtroData = {
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

  constructor(private _global: GlobalService) { }

  activar(tipo) {
    if (tipo == 'mapa') {
      this.isMapa = true;
      this.isGraficas = false;
      this.isTaximetro = false;
      this.isRiders = false;
      this.isEmpresas = false;
      this.isPedidos = false;
      this.stretched = false;
      this.isCupones = false;
    }
    if (tipo == 'graficas') {
      this.isMapa = false;
      this.isGraficas = true;
      this.isTaximetro = false;
      this.isRiders = false;
      this.isEmpresas = false;
      this.isPedidos = false;
      this.stretched = false;
      this.isCupones = false;

    }
    if (tipo == 'taximetro') {
      this.isMapa = false;
      this.isGraficas = false;
      this.isTaximetro = true;
      this.isRiders = false;
      this.isEmpresas = false;
      this.isPedidos = false;
      this.stretched = true;
      this.isCupones = false;

    }
    if (tipo == 'riders') {
      this.isMapa = false;
      this.isGraficas = false;
      this.isTaximetro = false;
      this.isRiders = true;
      this.isEmpresas = false;
      this.isPedidos = false;
      this.stretched = false;
      this.isCupones = false;

    }
    if (tipo == 'empresas') {
      this.isMapa = false;
      this.isGraficas = false;
      this.isTaximetro = false;
      this.isRiders = false;
      this.isEmpresas = true;
      this.isPedidos = false;
      this.stretched = false;
      this.isCupones = false;

    }
    if (tipo == 'pedidos') {
      this.isMapa = false;
      this.isGraficas = false;
      this.isTaximetro = false;
      this.isRiders = false;
      this.isEmpresas = false;
      this.isPedidos = true;
      this.stretched = false;
      this.isCupones = false;
    }
    if (tipo == 'cupones') {
      this.isMapa = false;
      this.isGraficas = false;
      this.isTaximetro = false;
      this.isRiders = false;
      this.isEmpresas = false;
      this.isPedidos = false;
      this.stretched = false;
      this.isCupones = true;
    }
  }


  calcularPrecio(distancia) {

    const bici = this._global.tarifas.noche.bici;
    const moto = this._global.tarifas.noche.moto;

    let precioBici = 0;

    if (distancia > bici.maxLimite) {
      precioBici = 0;
    } else {
      if (distancia < bici.limite) {
        precioBici = bici.minima;
      } else {
        const costo = bici.distancia * distancia / 1000 + bici.base;
        precioBici = Math.ceil(costo / 10) * 10;
      }
    }

    let precioMoto = 0;

    if (distancia > moto.maxLimite) {
      precioMoto = 0;
    } else {
      if (distancia < moto.limite) {
        precioMoto = moto.minima;
      } else {
        const costo = moto.distancia * distancia / 1000 + moto.base;
        precioMoto = Math.ceil(costo / 10) * 10;
      }
    }

    let data = { distancia, precioBici, precioMoto };

    return data;

  }


}
