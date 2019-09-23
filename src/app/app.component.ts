import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ControlService } from './services/control.service';
import { AuthService } from './services/auth.service';
import { DataService } from './services/data.service';
import { GlobalService } from './services/global.service';
import { GooglePlaceDirective } from "node_modules/ngx-google-places-autocomplete/ngx-google-places-autocomplete.directive";
declare let google: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild("placesRef") placesRef: GooglePlaceDirective;
  @ViewChild('origin') origin: ElementRef;
  @ViewChild('destination') destination: ElementRef;


  pedidoID: string;
  isAuth = false;
  vehiculo = '';
  showPopups = false;
  hola: string;
  GoogleAutocomplete: any;
  autocomplete = { input: '' };
  autocompleteItems = [];
  origin_address: string;
  destination_address: string;
  origin_items = [];
  destination_items = [];
  geocoder: any;
  service: any;

  time = new Date().getTime();
  timeLater: number;

  origen: any;
  destino: any;
  distancia: number;

  direccion_origen: string;
  direccion_destino: string;

  costoData: any;
  showCosto = false;
  isLoading = false;

  usuario: any;

  constructor(
    public _control: ControlService,
    private _data: DataService,
    private _auth: AuthService,
    private router: Router,
    public _global: GlobalService,
    private zone: NgZone
  ) {
    this._auth.authState.subscribe(data => {
      this.isAuth = data.isAuth;
      if (data.isAuth) {
        this._global.getTarifas();
        this.usuario = data.usuario;
      }
    });

    this.timeLater = this.time;
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.geocoder = new google.maps.Geocoder();
    this.service = new google.maps.DistanceMatrixService();

    // this.destination_address = 'La Moneda, Santiago, Chile';
    // setTimeout(() => {
    //   this.selectSearchResult2('destination');

    // }, 1000);
  }


  getRiders(tipo) {
    this._data.queryRidersFirebase(tipo);
  }

  changeVehicle(vehiculo) {
    this.vehiculo = vehiculo;
    this._data.vehiculo = vehiculo;
  }

  trackRider() {

    if (!this.pedidoID) {
      return;
    }

    this._data.getPedido(this.pedidoID).then((pedido: any) => {
      this._control.origen = { lat: pedido.origen.lat, lng: pedido.origen.lng };
      this._control.destino = { lat: pedido.destino.lat, lng: pedido.destino.lng };
      this._data.queryRidersFirebase({ tipo: 'track', pedido: this.pedidoID });
      this._control.isTracking = true;
    });

  }

  refreshMap() {

    this._control.origen = null;
    this._control.destino = null;
    this.pedidoID = undefined;

    this._control.lat = Number((-33.44 - Math.random() / 1000).toFixed(5));
    this._control.lng = Number((-70.64 - Math.random() / 1000).toFixed(5));

    this._control.zoom = 13;
    setTimeout(() => {
      this._control.zoom = 14;
    }, 100);

    this._control.isTracking = false;
  }

  openPage(page) {
    this._control.activar(page)
    this.router.navigateByUrl(page);
  }

  openPopup(tipo) {

    this.showPopups = true;

    if (tipo == 'tarifa noche') {
      this._global.show_tarifas_noche = true;
    }

    if (tipo == 'tarifa dia') {
      this._global.show_tarifas_dia = true;
    }

    if (tipo == 'horario') {
      this._control.map_horario = true;
    }

    if (tipo == 'filtros') {
      this._control.map_filtros = true;
    }
  }

  logout() {
    this._auth.logout();
  }

  updateSearchResults(type) {

    if (this.origin_address == '' || this.destination_address == '') {
      type == 'origin' ? this.origin_items = [] : this.destination_items = [];
      return;
    }

    if (this.timeLater - this.time > 400) {
      this.time = this.timeLater;
      let input = '';

      type == 'origin' ? input = this.origin_address : input = this.destination_address;

      this.GoogleAutocomplete.getPlacePredictions({ input },
        (predictions, status) => {
          type == 'origin' ? this.origin_items = [] : this.destination_items = [];
          this.zone.run(() => {
            predictions.forEach((prediction) => {
              type == 'origin' ? this.origin_items.push(prediction) : this.destination_items.push(prediction);
            });
          });
        });
    }

    this.timeLater = new Date().getTime();
  }

  selectSearchResult(item, type) {
    this.origin_items = [];
    this.destination_items = [];

    type == 'origin' ? this.origin_address = item.description : this.destination_address = item.description;

    this.geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {

        let center = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        };

        type == 'origin' ? this.origen = center : this.destino = center;
        this._control.handleCenter(type, center);
      }

    });

    setTimeout(() => {
      this.origin.nativeElement.focus();
      this.destination.nativeElement.focus();
      this.origin.nativeElement.focus();
      this.origin.nativeElement.blur();
      this.destination.nativeElement.blur();
    }, 200);
  }


  calcular() {

    if (this.isLoading) {
      return;
    }

    if (!(this._control.taxOrigin && this._control.taxDestination)) {
      return;
    }

    this.isLoading = true;
    this.direccion_origen = this.origin_address;
    this.direccion_destino = this.destination_address;

    let self = this;
    this.service.getDistanceMatrix(
      {
        origins: [this.direccion_origen],
        destinations: [this.direccion_destino],
        travelMode: 'DRIVING',
      }, function (response, status) {
        let distancia = response.rows[0].elements[0].distance.value;
        self.costoData = self._control.calcularPrecio(distancia);
        self._control.graficarRuta(self.origen, self.destino);
        self.showCosto = true;
        self.isLoading = false;
      });

    setTimeout(() => {
      this.origin.nativeElement.focus();
      this.destination.nativeElement.focus();
      this.origin.nativeElement.focus();
      this.origin.nativeElement.blur();
      this.destination.nativeElement.blur();
    }, 200);
  }

  clearTaximetro() {
    this._control.taxCenter = { lat: -33.444600, lng: -70.655585 };
    this._control.taxOrigin = null;
    this._control.taxDestination = null;
    this._control.showOrigin = false;
    this._control.showDestination = false;
    this._control.showRoute = false;
    this.origin_address = undefined;
    this.destination_address = undefined;
    this.origin_items = [];
    this.destination_items = [];
  }
}
