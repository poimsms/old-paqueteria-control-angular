import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ControlService } from 'src/app/services/control.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-riders',
  templateUrl: './riders.component.html',
  styleUrls: ['./riders.component.css']
})
export class RidersComponent implements OnInit {

  nombre: string;
  email: string;
  telefono: string;
  password_1: string;
  password_2: string;
  vehiculo = 'Seleccionar';
  relacion = "Seleccionar";

  riders = [];
  pedidos = [];
  imagen: any;

  isRiders = true;
  isBusqueda = false;
  isUploadedImg = true;
  isLoadingImage = false;

  error_info_incompleta = false;
  error_8_digitos_telefono = false;
  error_num_telefono = false;
  error_telefono_existe = false;
  error_password = false;
  error_vehiculo = false;
  error_relacion = false;
  error_imagen = false;

  showFiltros = false;
  showBusqueda = false;
  showCrear = false;

  isLoading = false;

  filtro = {
    cuenta: 'activada',
    relacion: 'todo',
    vehiculo: 'todo'
  }

  filtro_temp = {
    cuenta: 'activada',
    relacion: 'todo',
    vehiculo: 'todo'
  }

  filtro_telefono = {
    telefono: 0,
    inicio: '',
    termino: ''
  }

  constructor(
    private _data: DataService,
    private _control: ControlService,
    private toastr: ToastrService

  ) {
    this._control.activar('riders');
    this.dateInit();
    this.getRiders();
  }

  ngOnInit() {
    this.isUploadedImg = false;
  }

  dateInit() {
    const now = new Date().toLocaleDateString('en-GB');
    const dayNow = now.split('/')[0];
    const monthNow = now.split('/')[1];
    const yearNow = now.split('/')[2];

    const now_milliseconds = new Date(Number(yearNow), Number(monthNow) - 1, Number(dayNow)).getTime();
    const past_miliseconds = now_milliseconds - 24 * 60 * 60 * 1000;

    const past = new Date(past_miliseconds).toLocaleDateString('en-GB');
    const dayPast = past.split('/')[0];
    const monthPast = past.split('/')[1];
    const yearPast = past.split('/')[2];

    const start = `${yearPast}-${monthPast}-${dayPast}`;
    const end = `${yearNow}-${monthNow}-${dayNow}`;

    this.filtro_telefono.inicio = start;
    this.filtro_telefono.termino = end;
  }

  getRiders() {
    this._data.getRidersByFilter(this.filtro).then((data: any) => {
      this.riders = [];
      this.riders = data.riders;
    });
  }

  toggleAccount(rider) {
    this._data.riderToggleAccount(rider).then((res: any) => {
      if (res.activation) {
        this._data.updateRiderFirebase(rider._id, { isActive: false })
        this.toastr.success('El usuario ahora puede acceder a la plataforma', 'Cuanta activada');
      } else {
        this.toastr.warning('El usuario no tiene acceso a la plataforma', 'Cuenta bloqueada');
      }
      this.getRiders();
    });
  }

  onFileSelected(event) {
    const file = event.target.files[0];
    const fd = new FormData();
    fd.append('image', file, file.name);
    this.isLoadingImage = true;
    this._data.uploadImage(fd).then(res => {
      this.imagen = res;
      this.isLoadingImage = false;
      this.isUploadedImg = true;
    });
  }

  crearRider() {

    this.resetErros();

    if (!this.isUploadedImg) {
      return this.error_imagen = true;
    }

    if (!Number(this.telefono)) {
      return this.error_num_telefono = true;
    }

    if (this.telefono.length != 8) {
      return this.error_8_digitos_telefono = true;
    }

    if (this.password_1 != this.password_2) {
      return this.error_password = true;
    }

    if (this.vehiculo == 'Seleccionar') {
      return this.error_vehiculo = true;
    }

    if (this.relacion == 'Seleccionar') {
      return this.error_relacion = true;
    }


    if (!(this.nombre && this.email)) {
      this.error_info_incompleta = true;
    }

    this.isLoading = true;

    const body = {
      nombre: this.nombre,
      email: this.email,
      telefono: this.telefono,
      password: this.password_1,
      vehiculo: this.vehiculo,
      relacion: this.relacion,
      img: this.imagen,
      rol: 'rider',
      stats: {
        startsCount: 1,
        startsAvg: 2.0,
        startsSum: 2
      }
    }

    this._data.crearCuenta(body).then((data: any) => {
      if (data.ok) {
        this.toastr.success('Cuenta creada con exito', 'Nuevo rider');
        this._data.createRiderCoorsFirebase(data.usuario);
        this._data.createRiderFirebase(data.usuario);
        this.close_crear();
      } else {
        this.error_telefono_existe = true;
      }
      this.isLoading = false;
    });
  }

  close_crear() {
    this.showCrear = false;
    this.telefono = undefined;
    this.nombre = undefined;
    this.email = undefined;
    this.password_1 = undefined;
    this.password_2 = undefined;
    this.vehiculo = 'Seleccionar';
    this.relacion = 'Seleccionar';
    this.isUploadedImg = false;

    this.resetErros();
  }

  resetErros() {
    this.error_info_incompleta = false;
    this.error_8_digitos_telefono = false;
    this.error_num_telefono = false;
    this.error_telefono_existe = false;
    this.error_password = false;
    this.error_vehiculo = false;
    this.error_relacion = false;
    this.error_imagen = false;
  }

  close_busqueda() {
    this.showBusqueda = false;
  }

  close_filtros() {
    this.filtro = JSON.parse(JSON.stringify(this.filtro_temp));
    this.showFiltros = false;
  }

  filtrar() {
    this.filtro_temp = JSON.parse(JSON.stringify(this.filtro));
    this.showFiltros = false;
    this.getRiders();
  }

  buscar() {
    this._data.findPedidosByPhoneRider(this.filtro_telefono)
      .then((data: any) => {
        this.pedidos = data.pedidos;
        this.isBusqueda = true;
        this.isRiders = false;
        this.showBusqueda = false;
      });
  }
}

