import { Component, OnInit } from '@angular/core';
import { ControlService } from 'src/app/services/control.service';

@Component({
  selector: 'app-cobros',
  templateUrl: './cobros.component.html',
  styleUrls: ['./cobros.component.css']
})
export class CobrosComponent implements OnInit {

  showTabla = true;

  estatus_filtro = 'Estatus';
  constructor(
    public _control: ControlService
  ) { }

  ngOnInit() {
    this._control.activar('cobros');

  }

}
