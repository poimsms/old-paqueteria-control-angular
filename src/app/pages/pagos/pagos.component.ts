import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ControlService } from 'src/app/services/control.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export class PagosComponent implements OnInit {

  showTabla = true;

  estatus_filtro = 'Estatus';

  balances = [];

  tipo: string;

  constructor(
    private _data: DataService,
    public _control: ControlService,
    private toastr: ToastrService
  ) { 
    this._control.activar('pagos');
  }

  ngOnInit() {
    this.getBalances('libre')
  }

  getBalances(tipo) {

    this.tipo = tipo;

    const query = {
      isActive: true,
      procesado: true
    }

    this.balances = [];
    
    if (tipo == 'libre') {
      this._data.getBalanceLibre(query).then((data: any) => {
        this.balances = data;
      });
    }

    if (tipo == 'turno') {
      this._data.getBalanceTurno(query).then((data: any) => {
        this.balances = data;
      });
    }   
  }

  async toggleBalance(balance) {
   
    const data = {
      pagado: !balance.pagado 
    }

    if (this.tipo == 'libre') {
      await this._data.updateBalanceLibre(balance._id, data);
      this.getBalances(this.tipo);
    }

    if (this.tipo == 'turno') {
      await this._data.updateBalanceTurno(balance._id, data);
      this.getBalances(this.tipo);
    }
  }

  openDetails(balance) {
    
  }

}
