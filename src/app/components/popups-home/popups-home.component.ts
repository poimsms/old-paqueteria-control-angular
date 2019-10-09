import { Component, OnInit } from '@angular/core';
import { ControlService } from 'src/app/services/control.service';
import { DataService } from 'src/app/services/data.service';
import { GlobalService } from 'src/app/services/global.service';
import { ToastrService } from 'ngx-toastr';
import { MapaService } from 'src/app/services/mapa.service';

@Component({
  selector: 'app-popups-home',
  templateUrl: './popups-home.component.html',
  styleUrls: ['./popups-home.component.css']
})
export class PopupsHomeComponent implements OnInit {

  caso = '';
  telefono: string;

  tarifas = {
    moto: {
      base: 0,
      minima: 0,
      distancia: 0,
      limite: 0,
      maxLimite: 0
    },
    bici: {
      base: 0,
      minima: 0,
      distancia: 0,
      limite: 0,
      maxLimite: 0
    }
  };

  horario = {
    horaCambioNoche: 24,
    horaCambioDia: 24
  };

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
  }

  filtro_temp = {
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
  }

  tarifaTipo = 'noche';
  maxLimiteMoto = 20;
  maxLimiteBici = 2.5;

  constructor(
    public _control: ControlService,
    private _data: DataService,
    private _mapa: MapaService,
    public _global: GlobalService,
    private toastr: ToastrService
  ) {

    if (_control.map_tarifas_noche) {
      this.tarifas = _global.tarifas.noche;
    } else {
      this.tarifas = _global.tarifas.dia;
    }

    if (_control.map_horario) {
      this.horario.horaCambioNoche = _global.tarifas.horaCambioNoche;
      this.horario.horaCambioDia = _global.tarifas.horaCambioDia;
    }
  }

  ngOnInit() {
  }

  close(tipo) {

    if (tipo == 'tarifa') {
      this._control.map_tarifas = false;
    }

    if (tipo == 'horario') {
      this._control.map_horario = false;
    }

    if (tipo == 'filtros') {
      this.filtro = JSON.parse(JSON.stringify(this.filtro_temp));
      this._control.map_filtros = false;
    }
  }

  filtrar() {
    this.filtro_temp = JSON.parse(JSON.stringify(this.filtro));
    this._control.map_filtroData = this.filtro_temp;
    this._mapa.mapAction$.next({ accion: 'traer_riders', filtro: this.filtro })
    this._control.map_filtros = false;
  }

  actualizarTarifas() {
    this.close('tarifa');

    let data: any = {};

    if (this._control.map_tarifas_noche) {
      data.noche = this.tarifas;
    } else {
      data.dia = this.tarifas;
    }

    this._global.updateTarifas(data).then(() => {
      this._global.getTarifas();
      this.toastr.success('Se han actualizado las tarifas con éxito', 'Tarifas actualizadas');
    });

  }

  actualizarHorario() {
    this._global.updateTarifasHorario(this.horario).then(() => {
      this.close('horario')
    });
  }

  changeLimiteTarifaMinima(tipo, vehiculo, diaNoche) {

    if (diaNoche == 'noche') {
      if (tipo == '+' && vehiculo == 'moto') {
        this._global.tarifas_temp.noche.moto.limite += 100;
      }

      if (tipo == '-' && vehiculo == 'moto') {
        this._global.tarifas_temp.noche.moto.limite -= 100;
      }

      if (tipo == '+' && vehiculo == 'bici') {
        this._global.tarifas_temp.noche.limite += 100;
      }

      if (tipo == '-' && vehiculo == 'bici') {
        this._global.tarifas_temp.noche.limite -= 100;
      }
    }

    if (diaNoche == 'dia') {
      if (tipo == '+' && vehiculo == 'moto') {
        this._global.tarifas_temp.dia.moto.limite += 100;
      }

      if (tipo == '-' && vehiculo == 'moto') {
        this._global.tarifas_temp.dia.moto.limite -= 100;
      }

      if (tipo == '+' && vehiculo == 'bici') {
        this._global.tarifas_temp.dia.limite += 100;
      }

      if (tipo == '-' && vehiculo == 'bici') {
        this._global.tarifas_temp.dia.limite -= 100;
      }
    }

  }

  async aplicarReset() {

    if (this.caso == '' || this.telefono.length != 8 || !Number(this.telefono)) {
      return;
    }

    this._control.isLoading = true;

    const data: any = await this._data.getRiderByPhone(this.telefono);

    if (!data.ok) {
      return this.toastr.error(data.message, 'Algo salio mal');
    }

    if (this.caso == 'Entrego con éxito') {

      const res: any = await this._data.updatePedido(data.rider._id, { entregado: true });

      if (!res.ok) {
        return this.toastr.error(data.message, 'Algo salio mal');
      }

      this._data.updateRiderFirebase(data.rider._id, 'riders', {
        actividad: 'disponible',
        aceptadoId: '',
        fase: ''
      });

      this._data.updateRiderFirebase(data.rider._id, 'coors', {
        actividad: 'disponible',
        pedido: '',
        cliente: ''
      });
    }

    if (this.caso == 'No completo el pedido') {

      const res: any = await this._data.updatePedido(data.rider._id, { cancelado: true });

      if (!res.ok) {
        return this.toastr.error(data.message, 'Algo salio mal');
      }

      this._data.updateRiderFirebase(data.rider._id, 'riders', {
        actividad: 'disponible',
        aceptadoId: '',
        fase: ''
      });

      this._data.updateRiderFirebase(data.rider._id, 'coors', {
        actividad: 'disponible',
        pedido: '',
        cliente: ''
      });
    }

    if (this.caso == 'No confirmó el pedido') {

      this._data.updateRiderFirebase(data.rider._id, 'riders', {
        pagoPendiente: false
      });

      this._data.updateRiderFirebase(data.rider._id, 'coors', {
        pagoPendiente: false
      });

    }

    this.toastr.success('Rider reiniciado con exito');

    this.caso = '';
    this._control.reiniciar_rider = false;
    this._control.isLoading = false;
  }

}
