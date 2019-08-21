import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ControlService {

  isMapa = true;
  isMapaActivos = true;
  isMapaTodo = false;
  isRiders = false;
  isEmpresas = false;
  isPedidos = false;

  map_filtros = false;
  map_tarifas = false;
  map_tarifas_noche = false;
  map_tarifas_dia = false;
  map_horario = false;

  constructor(private router: Router) { }

  activar(tipo) {
    if (tipo == 'mapa') {
      this.isMapa = true;
      this.isRiders = false;
      this.isEmpresas = false;
      this.isPedidos = false;
    }
    if (tipo == 'riders') {
      this.isMapa = false;
      this.isRiders = true;
      this.isEmpresas = false;
      this.isPedidos = false;
    }
    if (tipo == 'empresas') {
      this.isMapa = false;
      this.isRiders = false;
      this.isEmpresas = true;
      this.isPedidos = false;   
    }
    if (tipo == 'pedidos') {
      this.isMapa = false;
      this.isRiders = false;
      this.isEmpresas = false;   
      this.isPedidos = true;   
    }
  }


}
