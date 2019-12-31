import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ControlService } from 'src/app/services/control.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cupones',
  templateUrl: './cupones.component.html',
  styleUrls: ['./cupones.component.css']
})
export class CuponesComponent implements OnInit {

  titulo: string;
  vendedor: string;
  descuento = 10;
  tope = 3000;
  viajes = 3;
  limite = 100;
  isLimite = false;
  isViajes = false;
  isTope = false;
  isDescuento = false;



  cupones = [];
  termino = '2019-12-10';

  error_info_incompleta = false;
  error_limite = false;

  showCrear = false;
  showTabla = true;
  showCupones = true;

  estatus_filtro = 'Estatus';


  constructor(
    private _control: ControlService,
    private _data: DataService,
    private toastr: ToastrService
  ) {
    this._control.activar('cupones');
    this.getCodigos();
  }

  ngOnInit() {
  }

  getCodigos() {
    const filtro = this.procesarFiltro();
    this._data.getCodigosByFilter(filtro).then((data: any) => {
      this.cupones = [];
      this.cupones = data.cupones;
      this._control.isLoading = false;
    });
  }

  crearHandler() {

    this.resetErros();

    if (!(this.isDescuento && this.isTope && this.isViajes && this.titulo && this.vendedor)) {
      return this.error_info_incompleta = true;
    }

    this._control.isLoading = true;

    const body = {
      titulo: this.titulo,
      descuento: this.descuento,
      tope: this.tope,
      limite_de_usos: this.limite,
      vendedor: this.vendedor,
      viajes: this.viajes,
      termino: this.termino
    }

    this._data.createCupon(body).then((data: any) => {
      if (data.ok) {
        this.toastr.success('¡Cupón creado con éxito!');
        this.getCodigos();
        this.resetVariables();
        this.showTabla = true;
        this.showCrear = false;
      } else {
        this.toastr.error(data.message, 'Algo salio mal...');
      }
      this._control.isLoading = false;
    });
  }

  procesarFiltro() {
    const body: any = {};

    body.isActive = true;

    if (this.estatus_filtro != 'Estatus') {
      if (this.estatus_filtro == 'Activo') {
        body.activo = true;
      }

      if (this.estatus_filtro == 'Agotado') {
        body.agotado = true;
      }

      if (this.estatus_filtro == 'Desactivado') {
        body.isActive = false;
      }

      if (this.estatus_filtro == 'Vencido') {
        body.vencido = true;
      }
    }

    return body;
  }


  resetErros() {
    this.error_info_incompleta = false;
  }

  resetVariables() {
    this.titulo = null;
    this.vendedor = null;
    this.descuento = 10;
    this.tope = 10;
    this.limite = 10;
    this.viajes = 10;
    this.isDescuento = false;
    this.isLimite = false;
    this.isTope = false;
    this.isViajes = false;
    this.termino = '2019-12-10';
  }
}
