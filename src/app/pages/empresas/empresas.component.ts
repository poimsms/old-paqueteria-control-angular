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

  empresas = [];
  pedidos = [];
  imagen: any;

  isEmpresas = true;
  isBusqueda = false;
  isUploadedImg = false;
  isLoadingImage = false;

  error_info_incompleta = false;
  error_8_digitos_telefono = false;
  error_num_telefono = false;
  error_telefono_existe = false;
  error_imagen = false;
  error_password = false;
  error_wrong_email = false;

  showFiltros = false;
  showBusqueda = false;
  showCrear = false;

  isLoading = false;

  filtro = {
    cuenta: 'activada'
  }

  filtro_temp = {
    cuenta: 'activada'
  }

  filtro_telefono = {
    telefono: 0,
    inicio: '',
    termino: ''
  }

  constructor(
    private _control: ControlService,
    private _data: DataService,
    private toastr: ToastrService
  ) {
    this._control.activar('empresas');
    this.dateInit();
    this.getEmpresas();
  }

  ngOnInit() {
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

  getEmpresas() {
    this._data.getEmpresasByFilter(this.filtro).then((data: any) => {
      this.empresas = [];
      this.empresas = data.empresas;
    });
  }

  toggleAccount(empresa) {
    this._data.riderToggleAccount(empresa).then((res: any) => {
      if (res.activation) {
        this._data.updateRiderFirebase(empresa._id, { isActive: false })
        this.toastr.success('El usuario ahora puede acceder a la plataforma', 'Cuanta activada');
      } else {
        this.toastr.warning('El usuario no tiene acceso a la plataforma', 'Cuenta bloqueada');
      }
      this.getEmpresas();
    });
  }

  onFileSelected(event) {
    const file = event.target.files[0];
    const fd = new FormData();
    this.isLoadingImage = true;
    fd.append('image', file, file.name);
    this._data.uploadImage(fd).then(res => {
      this.imagen = res;
      this.isLoadingImage = false;
      this.isUploadedImg = true;
    });
  }

  crearEmpresa() {

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

    if (!this.validateEmail(this.email)) {
      return this.error_wrong_email = true;
    }

    if (this.password_1 != this.password_2) {
      return this.error_password = true;
    }

    if (!(this.nombre && this.email && this.telefono && this.password_1 && this.password_2)) {
      return this.error_info_incompleta = true;
    }

    this.isLoading = true;

    const body = {
      nombre: this.nombre,
      email: this.email,
      telefono: Number(this.telefono),
      password: this.password_1,
      rol: 'empresa',
      img: this.imagen
    }
    this._data.crearCuenta(body).then((data: any) => {
      if (data.ok) {
        this.toastr.success('Cuenta creada con exito', 'Nuevo empresa');
        this.close_crear();
      } else {
        this.error_telefono_existe = true;
      }
      this.isLoading = false;
    });
  }

  validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  close_crear() {
    this.showCrear = false;
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
    this.error_telefono_existe = false;
    this.error_num_telefono = false;
    this.error_8_digitos_telefono = false;
    this.error_imagen = false;
    this.error_password = false;
    this.error_wrong_email = false;
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
    this.getEmpresas();
  }

  buscar() {
    this._data.findPedidosByPhoneEmpresa(this.filtro_telefono)
      .then((data: any) => {
        this.pedidos = data.pedidos;
        this.isBusqueda = true;
        this.isEmpresas = false;
        this.showBusqueda = false;
      });
  }

}
