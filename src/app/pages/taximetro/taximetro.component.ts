import { Component, OnInit, NgZone } from '@angular/core';
import { ControlService } from 'src/app/services/control.service';
import { MapaService } from 'src/app/services/mapa.service';
declare let google: any;

@Component({
  selector: 'app-taximetro',
  templateUrl: './taximetro.component.html',
  styleUrls: ['./taximetro.component.css']
})
export class TaximetroComponent implements OnInit {

  map: any;
  zoom = 16;
  markerReady = false;
  marker: any;

  directionsDisplay: any;
  directionsService: any;

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

  constructor(
    public _control: ControlService,
    private _mapa: MapaService,
    private zone: NgZone

  ) {
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.directionsService = new google.maps.DirectionsService();

    this.timeLater = this.time;
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.geocoder = new google.maps.Geocoder();
    this.service = new google.maps.DistanceMatrixService();
  }

  ngOnInit() {
    this.cargarMapa();

    this._mapa.mapTaximetroAction$.subscribe((data: any) => {
      switch (data.accion) {
        case 'graficar_marcador':
          this.graficarMarcador(data.coors);
          break;
        case 'graficar_ruta':
          this.graficarRuta(data.origen, data.destino);
          break;
        case 'remover_ruta':
          this.directionsDisplay.setMap(null);
          break;
      }
    })
  }

  cargarMapa() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -33.444600, lng: -70.655585 },
      zoom: 15,
      disableDefaultUI: true,
      zoomControl: true
    });
  }

  graficarMarcador(coors) {

    if (this.marker) {
      this.marker.setMap(null);
    }

    this.map.setCenter(coors);

    this.marker = new google.maps.Marker({
      position: coors,
      map: this.map
    });
  }

  graficarRuta(origen, destino) {
    this.marker.setMap(null);
    this.marker = null;

    var self = this;

    this.directionsDisplay.setMap(this.map);
    const origenLatLng = new google.maps.LatLng(origen.lat, origen.lng);
    const destinoLatLng = new google.maps.LatLng(destino.lat, destino.lng);

    this.directionsService.route({
      origin: origenLatLng,
      destination: destinoLatLng,
      travelMode: 'DRIVING',
    }, function (response, status) {
      self.directionsDisplay.setDirections(response);
    });
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

      this.GoogleAutocomplete.getPlacePredictions({ input, componentRestrictions: { country: 'cl' } },
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
        this._mapa.mapTaximetroAction$.next({ accion: 'remover_ruta' });
        this._mapa.mapTaximetroAction$.next({ accion: 'graficar_marcador', coors: center })
      }

    });
  }


  calcular() {

    if (this.isLoading) {
      return;
    }

    if (!(this.origen && this.destino)) {
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
        self._mapa.mapTaximetroAction$.next({
          accion: 'graficar_ruta',
          origen: self.origen,
          destino: self.destino
        });
        self.showCosto = true;
        self.isLoading = false;
      });
  }

}
