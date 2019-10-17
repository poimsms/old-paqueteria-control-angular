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

      if (tipo == '+' && vehiculo == 'bicicleta') {
        this._global.tarifas_temp.noche.limite += 100;
      }

      if (tipo == '-' && vehiculo == 'bicicleta') {
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

      if (tipo == '+' && vehiculo == 'bicicleta') {
        this._global.tarifas_temp.dia.limite += 100;
      }

      if (tipo == '-' && vehiculo == 'bicicleta') {
        this._global.tarifas_temp.dia.limite -= 100;
      }
    }

  }

  async aplicarReset() {

    if (this.caso == '' || !Number(this.telefono)) {
      return;
    }

    this._control.isLoading = true;
    const fireArray: any = await this._data.getRiderFire(this.telefono);

    if (fireArray.length == 0) {
      this._control.isLoading = false;
      return this.toastr.error('Teléfono no encontrado', 'Algo salio mal');
    }

    const fireData: any = fireArray[0];

    if (!fireData.isActive) {
      this._control.isLoading = false;
      return this.toastr.error('Cuenta de rider bloqueada', 'Algo salio mal');
    }

    if (this.caso == 'rider_no_informo_la_entrega') {

      const res: any = await this._data.updatePedido(fireData.pedido, { entregado: true, mediado_por_admin: true });

      if (!res.ok) {
        this._control.isLoading = false;
        return this.toastr.error(res.message, 'Algo salio mal');
      }

      this.reiniciarRider(fireData.rider, fireData.cliente);
    }

    if (this.caso == 'rider_no_completo_el_pedido') {

      const res: any = await this._data.updatePedido(fireData.pedido, { cancelado: true, mediado_por_admin: true });

      if (!res.ok) {
        this._control.isLoading = false;
        return this.toastr.error(res.message, 'Algo salio mal');
      }

      this.reiniciarRider(fireData.rider);
    }

    if (this.caso == 'cliente_no_confirmó_el_pedido') {

      this.reiniciarRider(fireData.rider);
    }

    this.toastr.success('Rider reiniciado con exito');

    this.caso = '';
    this._control.reiniciar_rider = false;
    this._control.isLoading = false;
  }

  reiniciarRider(id, entregado_id?) {
    this._data.updateRiderFirebase(id, 'riders', {
      actividad: 'disponible',
      aceptadoId: '',
      entregadoId: entregado_id ? entregado_id : '',
      fase: '',
      pedido: '',
      pagoPendiente: false,
      nuevaSolicitud: false,
      isOnline: false,
    });

    this._data.updateRiderFirebase(id, 'coors', {
      actividad: 'disponible',
      pedido: '',
      cliente: '',
      pagoPendiente: false,
      isOnline: false
    });
  }

}
