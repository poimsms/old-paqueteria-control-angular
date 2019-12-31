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
  apellido: string;
  telefono: string;
  email: string;
  modalidad = 'Seleccionar';
  vehiculo = 'Seleccionar';
  isTelefono = false;
  isEmail = false;
  isModalidad = false;
  isVehiculo = false;
  isImagen = false;

  riders = [];
  pedidos = [];
  imagen: any;
  rider: any;

  isRiders = true;
  isBusqueda = false;
  isUploadedImg = true;
  isLoadingImage = false;
  showTabla = true;

  error_info_incompleta = false;
  error_telefono_existe = false;

  showFiltros = false;
  showBusqueda = false;
  showCrear = false;

  modalidad_filtro = 'Modalidad';
  vehiculo_filtro = 'Vehiculo';
  estatus_filtro = 'Estatus';

  telefono_buscar: string;

  showPassword = false;
  passwordRider: string;


  constructor(
    private _data: DataService,
    private _control: ControlService,
    private toastr: ToastrService

  ) {
    this._control.activar('riders');
    this.getRiders();
  }

  ngOnInit() {
    this.isUploadedImg = false;
  }

  validarTelefono() {
    setTimeout(() => {
      if (this.telefono.length == 9 && Number(this.telefono)) {
        this.isTelefono = true;
      } else {
        this.isTelefono = false;
      }
    }, 50);
  }

  validarEmail() {
    setTimeout(() => {
      if (this.validateEmail(this.email)) {
        this.isEmail = true;
      } else {
        this.isEmail = false;
      }
    }, 50);
  }

  validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  getRiders() {
    const filtro = this.procesarFiltro();
    this._data.getRidersByFilter(filtro).then((data: any) => {
      this.riders = [];
      this.riders = data.riders;
    });
  }

  async toggleAccount(usuario) {

    this._control.isLoading = true;

    await this._data.updateAccount(usuario._id, { isActive: !usuario.isActive });
    await this._data.updateRiderFirebase(usuario._id, 'rider', { isActive: !usuario.isActive })
    await this._data.updateRiderFirebase(usuario._id, 'coors', { isActive: !usuario.isActive })
    await this._data.updateRegistro({ isActive: !usuario.isActive });

    this._control.isLoading = false;

    if (usuario.isActive) {
      this.toastr.warning('El usuario no tiene acceso a la plataforma', 'Cuenta bloqueada');
    } else {
      this.toastr.success('El usuario ahora puede acceder a la plataforma', 'Cuanta activada');
    }

    this.getRiders();
  }

  async toggleAccountFromBusqueda(usuario) {

    this._control.isLoading = true;

    const data: any = await this._data.updateAccount(usuario._id, { isActive: !usuario.isActive });
    await this._data.updateRiderFirebase(usuario._id, 'rider', { isActive: !usuario.isActive })
    await this._data.updateRiderFirebase(usuario._id, 'coors', { isActive: !usuario.isActive })
    await this._data.updateRegistro({ isActive: !usuario.isActive });

    this._control.isLoading = false;

    if (usuario.isActive) {
      this.toastr.warning('El usuario no tiene acceso a la plataforma', 'Cuenta bloqueada');
    } else {
      this.toastr.success('El usuario ahora puede acceder a la plataforma', 'Cuanta activada');
    }
    this.rider = null;
    this.rider = data.usuario;

    this.getRiders();
  }

  onFileSelected(event) {
    const file = event.target.files[0];
    const fd = new FormData();
    fd.append('image', file, file.name);
    this.isLoadingImage = true;
    this._data.uploadImage(fd).then((res: any) => {

      if (res.ok) {
        this.imagen = res.image;
        this.isImagen = true;
        this.isUploadedImg = true;
      }

      this.isLoadingImage = false;
    });
  }

  crearHandler() {

    this.resetErros();

    if (!(this.nombre && this.apellido && this.isEmail && this.isTelefono && this.isImagen && this.isVehiculo && this.isModalidad)) {
      return this.error_info_incompleta = true;
    }

    this._control.isLoading = true;

    const body: any = {
      nombre: this.nombre.toLowerCase().trim() + ' ' + this.apellido.toLowerCase().trim(),
      email: this.email.toLowerCase().trim(),
      telefono: this.telefono,
      vehiculo: this.vehiculo,
      img: this.imagen,
      turnoSet: false,
      role: 'RIDER_ROLE',
      stats: {
        startsCount: 1,
        startsAvg: 2.0,
        startsSum: 2
      }
    };

    if (this.modalidad == 'Turnos rotativos') {
      body.turnoSet = true;
    }

    this._data.createAccount(body).then(async (data: any) => {

      console.log(data, 'data')

      if (data.ok) {

        const bodyBalances = {
          rider: data.usuario._id,
          turnoSet: this.modalidad == 'Turnos rotativos' ? true : false
        };

        // await this._data.createBalances(bodyBalances);
        await this._data.createRiderCoorsFirebase(data.usuario);
        await this._data.createRiderFirebase(data.usuario);
        await this._data.createModalidadFirebase(data.usuario);

        this.toastr.success('Cuenta creada con exito', 'Nuevo rider');
        this.passwordRider = data.password;
        this.showPassword = true;

        this.close_crear();

        this.getRiders();
      } else {
        this.error_telefono_existe = true;
      }
      this._control.isLoading = false;
    });
  }

  close_crear() {
    this.showCrear = false;
    this.showTabla = true;
    this.isUploadedImg = false;
    this.imagen = {};
    this.telefono = undefined;
    this.nombre = undefined;
    this.email = undefined;
    this.vehiculo = 'Seleccionar';
    this.modalidad = 'Seleccionar';
    this.resetErros();
  }

  resetErros() {
    this.error_info_incompleta = false;
    this.error_telefono_existe = false;
  }

  close_busqueda() {
    this.showBusqueda = false;
  }

  procesarFiltro() {
    const body: any = {};

    body.role = 'RIDER_ROLE';

    if (this.vehiculo_filtro != 'Vehiculo') {
      body.vehiculo = this.vehiculo_filtro;
    }

    if (this.modalidad_filtro != 'Modalidad') {
      if (this.modalidad_filtro == 'Turno') {
        body.turnoSet = true;
      } else {
        body.turnoSet = false;
      }
    }

    if (this.estatus_filtro != 'Estatus') {
      if (this.estatus_filtro == 'Activo') {
        body.isActive = true;
      } else {
        body.isActive = false;
      }
    }

    return body;
  }

  buscarRider() {

    const filtro = {
      telefono: this.telefono_buscar,
      role: 'RIDER_ROLE'
    };

    this._data.getRidersByFilter(filtro).then((data: any) => {
      this.riders = [];
      this.riders = data.riders;
    });
  }

}

