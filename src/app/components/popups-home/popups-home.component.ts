import { Component, OnInit } from '@angular/core';
import { ControlService } from 'src/app/services/control.service';
import { DataService } from 'src/app/services/data.service';
import { GlobalService } from 'src/app/services/global.service';

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


  constructor(
    public _control: ControlService,
    private _data: DataService,
    private _global: GlobalService
    ) { 
      console.log(_global.tarifas)
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
    let data: any = {};
    if (this._control.map_tarifas_noche) {
      data.noche = this.tarifas;  
      this._global.updateTarifas(data).then(() => {
        this.close('tarifa noche');
        this._global.getTarifas();
      });
    } else {
      data.dia = this.tarifas;
      this._global.updateTarifas(data).then(() => {
        this.close('tarifa dia');
        this._global.getTarifas();
      });
    }
  }

  actualizarHorario() {
    this._global.updateTarifasHorario(this.horario).then(() => {
      this.close('horario')
    });
  }



}
