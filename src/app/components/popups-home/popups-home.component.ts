import { Component, OnInit } from '@angular/core';
import { ControlService } from 'src/app/services/control.service';
import { DataService } from 'src/app/services/data.service';
import { GlobalService } from 'src/app/services/global.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-popups-home',
  templateUrl: './popups-home.component.html',
  styleUrls: ['./popups-home.component.css']
})
export class PopupsHomeComponent implements OnInit {

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
      field: 'vehiculo',
      value: 'moto'
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
      field: 'vehiculo',
      value: 'moto'
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
    private _global: GlobalService,
    private toastr: ToastrService
  ) {    
    if (_control.map_tarifas_noche) {
      this.tarifas = _global.tarifas.noche;
      console.log(this.tarifas)

    } else {
      this.tarifas = _global.tarifas.dia;
      console.log(this.tarifas)
    }

    if (_control.map_horario) {
      this.horario.horaCambioNoche = _global.tarifas.horaCambioNoche;
      this.horario.horaCambioDia = _global.tarifas.horaCambioDia;
      console.log(this.horario)

    }

    console.log('pasoo')
  }

  ngOnInit() {
  }

  close(tipo) {

    if (tipo == 'tarifa') {
      this._control.map_tarifas = false;
      this._control.map_tarifas_dia = false;
      this._control.map_tarifas_noche = false;
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
    this._data.queryRidersFirebase(this.filtro);
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

  changeLimiteTarifaMinima(tipo, vehiculo) {

    if (tipo == '+' && vehiculo == 'moto') {
      this.tarifas.moto.limite += 100;
    }

    if (tipo == '-' && vehiculo == 'moto') {
      this.tarifas.moto.limite -= 100;
    }

    if (tipo == '+' && vehiculo == 'bici') {
      this.tarifas.bici.limite += 100;
    }

    if (tipo == '-' && vehiculo == 'bici') {
      this.tarifas.bici.limite -= 100;
    }
  }

  changeHorarioTarifas() {
    
  }



}
