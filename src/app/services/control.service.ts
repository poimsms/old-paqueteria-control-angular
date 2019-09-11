import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class ControlService {

  isMapa = true;
  isMapaActivos = true;
  isMapaTodo = false;
  isTaximetro = false;
  isRiders = false;
  isEmpresas = false;
  isPedidos = false;

  stretched = false;

  map_filtros = false;
  map_tarifas = false;
  map_tarifas_noche = false;
  map_tarifas_dia = false;
  map_horario = false;
  isTracking = false;

  lat = -33.444600;
  lng = -70.655585;
  zoom = 14;
  origen: any;
  destino: any;

  taxOrigin: any;
  taxDestination: any;
  showOrigin = false;
  showDestination = false;
  showRoute = false;
  isTaxRoute = false;
  origen_tax: any;
  destino_tax: any;
  taxCenter = {
    lat: -33.444600,
    lng: -70.655585
  };

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
      this.isTaximetro = false;
      this.isRiders = false;
      this.isEmpresas = false;
      this.isPedidos = false;
      this.stretched = false;
    }
    if (tipo == 'taximetro') {
      this.isMapa = false;
      this.isTaximetro = true;
      this.isRiders = false;
      this.isEmpresas = false;
      this.isPedidos = false;
      this.stretched = true;

    }
    if (tipo == 'riders') {
      this.isMapa = false;
      this.isTaximetro = false;
      this.isRiders = true;
      this.isEmpresas = false;
      this.isPedidos = false;
      this.stretched = false;

    }
    if (tipo == 'empresas') {
      this.isMapa = false;
      this.isTaximetro = false;
      this.isRiders = false;
      this.isEmpresas = true;
      this.isPedidos = false;
      this.stretched = false;

    }
    if (tipo == 'pedidos') {
      this.isMapa = false;
      this.isTaximetro = false;
      this.isRiders = false;
      this.isEmpresas = false;
      this.isPedidos = true;
      this.stretched = false;

    }
  }

  handleCenter(type, center) {
    if (type == 'origin') {
      this.taxOrigin = center;
      this.taxCenter = center;
      this.showOrigin = true;
      this.showDestination = false;
      this.showRoute = false;
    } else {
      this.taxDestination = center;
      this.taxCenter = center;
      this.showOrigin = false;
      this.showDestination = true;
      this.showRoute = false;
    }
  }


  graficarRuta(origen, destino) {

    this.origen_tax = origen;
    this.destino_tax = destino;

    this.showOrigin = false;
    this.showDestination = false;
    this.showRoute = true;
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
