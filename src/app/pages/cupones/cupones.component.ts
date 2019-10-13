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
  descripcion: string;
  descuento = '% descuento próximo pedido';
  limite: string;
  tope = '$3.000';

  cupones = [];
  termino = '2019-10-31';

  error_info_incompleta = false;
  error_limite = false;

  showCrear = false;
  showTabla = true;
  showCupones = true;

  constructor(
    private _control: ControlService,
    private _data: DataService,
    private toastr: ToastrService
  ) {
    this._control.activar('cupones');
    this.getCupones();
  }

  ngOnInit() {
  }

  getCupones() {
    this._control.isLoading = true;
    this._data.getCupones().then((data: any) => {
      this.cupones = [];
      this.cupones = data.cupones;
      this._control.isLoading = false;
    });
  }

  crearCupon() {

    this.resetErros();

    if (!(this.titulo && this.descripcion && this.limite && this.tope != '$3000' && this.descuento != '% descuento próximo pedido')) {
      return this.error_info_incompleta = true;
    }

    if (!Number(this.limite)) {
      return this.error_limite = true;
    }

    this._control.isLoading = true;

    const body = {
      titulo: this.titulo,
      descripcion: this.descripcion,
      descuento: Number(this.descuento),
      tope: Number(this.tope),
      limite_de_usos: Number(this.limite),
      valido_hasta: this.termino
    }

    this._data.createCupon(body).then((data: any) => {
      if (data.ok) {
        this.toastr.success('¡Cupón creado con éxito!');
        this.getCupones();
        this.resetVariables();
        this.showTabla = true;
        this.showCrear = false;
      } else {
        this.toastr.error(data.message, 'Algo salio mal...');
      }
      this._control.isLoading = false;
    });
  }

  resetErros() {
    this.error_info_incompleta = false;
    this.error_limite = false;
  }

  resetVariables() {
    this.titulo = null;
    this.descripcion = null;
    this.descuento = '% descuento próximo pedido';
    this.tope = '$3.000';
    this.limite = null;
    this.termino = '2019-10-31';
  }
}
