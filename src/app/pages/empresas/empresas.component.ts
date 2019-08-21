import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ControlService } from 'src/app/services/control.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit {

  nombre: string;
  direccion: string;
  email: string;
  telefono: string;
  telefono_search: string;
  password_1: string;
  password_2: string;

  newEmpresa = false;

  error_info_incompleta = false;
  error_telefono = false;
  error_password = false;

  constructor(
    private _control: ControlService,
    private _data: DataService,
    private toastr: ToastrService
  ) {
    this._control.activar('empresas');

  }

  ngOnInit() {
  }


  crearEmpresa() {

    this.resetErros();

    if (!(this.nombre && this.direccion && this.email && this.telefono && this.password_1 && this.password_2)) {
      return this.error_info_incompleta = true;
    }

    if (!Number(this.telefono)) {      
      return this.error_telefono = true;
    }

    if (this.telefono.length != 8) {      
      return this.error_telefono = true;
    }

    if (this.password_1 != this.password_2) {
      return this.error_password = true;
    }  
    
    const body = {
      nombre: this.nombre,
      direccion: this.direccion,
      email: this.email,
      telefono: Number(this.telefono),
      password: this.password_1
    }

    this._data.crearEmpresa(body).then((data: any) => {
      if (data.ok) {
        this.toastr.success('Cuenta creada con exito', 'Nueva empresa');
      } else {
        this.toastr.error('No se logro crear la cuenta', 'Error');
      }
      this.close_crear_empresa();
    });
  }

  close_crear_empresa() {
    this.newEmpresa = false;
    this.telefono = undefined;
    this.nombre = undefined;
    this.direccion = undefined;
    this.email = undefined;
    this.password_1 = undefined;
    this.password_2 = undefined;

    this.resetErros();
  }

  resetErros() {
    this.error_info_incompleta = false;
    this.error_telefono = false;
    this.error_password = false;
  }


}
