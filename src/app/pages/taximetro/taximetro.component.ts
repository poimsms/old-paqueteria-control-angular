import { Component, OnInit } from '@angular/core';
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

  constructor(
    public _control: ControlService,
    private _mapa: MapaService
  ) {
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.directionsService = new google.maps.DirectionsService();
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

}
