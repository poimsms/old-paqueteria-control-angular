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
  empresa: any;

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
  error_email_no_valido = false;

  showFiltros = false;
  showBusqueda = false;
  showCrear = false;

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
      this._control.isLoading = false;
    });
  }

  async toggleAccount(usuario) {

    this._control.isLoading = true;

    await this._data.updateAccount(usuario._id, { isActive: !usuario.isActive });

    if (usuario.isActive) {
      this.toastr.warning('El usuario no tiene acceso a la plataforma', 'Cuenta bloqueada');
    } else {
      this.toastr.success('El usuario tiene acceso a la plataforma', 'Cuenta activada');
    }

    this.getEmpresas();
  }

  async toggleAccountFromBusqueda(usuario) {

    this._control.isLoading = true;

    const data: any = await this._data.updateAccount(usuario._id, { isActive: !usuario.isActive });

    if (usuario.isActive) {
      this.toastr.warning('El usuario no tiene acceso a la plataforma', 'Cuenta bloqueada');
    } else {
      this.toastr.success('El usuario tiene acceso a la plataforma', 'Cuenta activada');
    }
    this.empresa = null;
    this.empresa = data.usuario;
    this.getEmpresas();
  }

  onFileSelected(event) {
    const file = event.target.files[0];
    const fd = new FormData();
    this.isLoadingImage = true;
    fd.append('image', file, file.name);
    this._data.uploadImage(fd).then((res: any) => {

      if (res.ok) {
        this.imagen = res.image;
        this.isUploadedImg = true;
      }

      this.isLoadingImage = false;
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
      return this.error_email_no_valido = true;
    }

    if (this.password_1 != this.password_2) {
      return this.error_password = true;
    }

    if (!(this.nombre && this.email && this.telefono && this.password_1 && this.password_2)) {
      return this.error_info_incompleta = true;
    }

    this._control.isLoading = true;

    const body = {
      nombre: this.nombre.toLowerCase(),
      email: this.email.toLowerCase(),
      telefono: Number(this.telefono),
      password: this.password_1,
      role: 'EMPRESA_ROLE',
      img: this.imagen
    }
    this._data.createAccount(body).then((data: any) => {
      if (data.ok) {
        this.toastr.success('Cuenta creada con exito', 'Nueva empresa');
        this.close_crear();
      } else {
        this.error_telefono_existe = true;
      }
      this._control.isLoading = false;
    });
  }

  close_crear() {
    this.showCrear = false;
    this.isUploadedImg = false;
    this.imagen = {};
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
    this.error_email_no_valido = false;
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

    this.empresas = [];
    this.empresa = null;

    this._data.findPedidosByPhone_empresa(this.filtro_telefono)
      .then((data: any) => {
        this.pedidos = data.pedidos;
        this.isBusqueda = true;
        this.isEmpresas = false;
        this.showBusqueda = false;
        this.empresa = data.empresa;
      });
  }

  validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

}
