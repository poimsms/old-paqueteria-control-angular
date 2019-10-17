import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ControlService } from 'src/app/services/control.service';
import { Subscription } from 'rxjs';
import { MapaService } from 'src/app/services/mapa.service';
declare let google: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  riderSubscription$: Subscription;
  mapaSubscription$: Subscription;

  motoURL = 'https://res.cloudinary.com/ddon9fx1n/image/upload/v1565228910/tools/pin_motocicleta.png';
  biciURL = 'https://res.cloudinary.com/ddon9fx1n/image/upload/v1565230426/tools/pin_bicicleta.png';

  iconoMoto = {
    url: this.motoURL,
    scaledSize: new google.maps.Size(30, 30),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(15, 30)
  };

  iconoBicicleta = {
    url: this.biciURL,
    scaledSize: new google.maps.Size(30, 30),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(4, 30)
  };

  map: any;
  markers = [];
  directionsDisplay: any;
  directionsService: any;
  interval: any;

  riders_inicializados = false;

  accion_riders = 'inicializar_marcadores';
  marcadores_accion = 'inicializar_marcadores';

  riders = [];
  riders_anteriores = [];
  riders_nuevos = [];
  marker: any;
  riderReady = false;
  rider: any;
  arr = [];
  timer: any;

  constructor(
    private _mapa: MapaService,
    public _control: ControlService
  ) {
    this._control.activar('home');
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.directionsService = new google.maps.DirectionsService();
  }

  ngOnInit() {
    this.cargarMapa();
    this.mapaSubscription$ = this._mapa.mapAction$.subscribe((data: any) => {
      switch (data.accion) {
        case 'traer_riders':
          clearTimeout(this.timer);
          this.traerTodoLosRiders(data.filtro);
          break;
        case 'rastrear_rider':
          clearTimeout(this.timer);
          this.marcadores_accion = 'inicializar_marcador_rastreo';
          this.rastrearRider(data.pedidoID);
          break;
        case 'graficar_ruta':
          this.graficarRuta();
          break;
        case 'remover_ruta':
          this.removerRuta();
          break;
      }
    });
  }

  traerTodoLosRiders(filtro) {
    console.log(filtro)
    this._mapa.getRidersByFilter(filtro).then(riders => {
      console.log(riders, 'rds')
      this.riders = riders;

      if (this.marcadores_accion == 'inicializar_marcadores') {

        this.riders.forEach(rider => {
          this.crearMarcador(rider);
        });

        this.marcadores_accion = 'actualizar_marcadores';

      }

      if (this.marcadores_accion == 'actualizar_marcadores') {
        this.actualizarMarcadores();
      }

      this.timer = setTimeout(() => {
        this.traerTodoLosRiders(filtro);
      }, 300000);

    });
  }

  rastrearRider(id) {

    this._mapa.trackRider(id).then((riders: any) => {
      let rider = riders[0];
      if (this.marcadores_accion == 'inicializar_marcador_rastreo') {
        this.marker = new google.maps.Marker({
          position: { lat: rider.lat, lng: rider.lng },
          map: this.map,
          icon: rider.vehiculo == 'moto' ? this.iconoMoto : this.iconoBicicleta
        });
        this.marcadores_accion = 'actualizar_marcador_rastreo';
      }

      if (this.marcadores_accion == 'actualizar_marcador_rastreo') {
        this.marker.set({ lat: rider.lat, lng: rider.lng });
      }

      this.timer = setTimeout(() => {
        this.rastrearRider(id);
      }, 300000);

    });
  }

  ngOnDestroy() {
    this.mapaSubscription$.unsubscribe();
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  cargarMapa() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -33.444600, lng: -70.655585 },
      zoom: 12,
      disableDefaultUI: true,
      zoomControl: true
    });
  }

  actualizarMarcadores() {
    this.markers.forEach(marker => {
      marker.encontrado = false;
    });

    this.riders.forEach(rider => {
      let rider_encontrado = false;

      this.markers.forEach(marker => {
        if (marker.riderID == rider.rider) {
          rider_encontrado = true;
          marker.marker.set({ lat: rider.lat, lng: rider.lng });
          marker.encontrado = true;
        }
      });

      if (!rider_encontrado) {
        this.crearMarcador(rider);
      }
    });

    this.markers.forEach((marker, i) => {
      if (!marker.encontrado) {
        marker.marker.setMap(null);
        this.markers.splice(i, 1);
      }
    });
  }


  crearMarcador(rider) {

    let marker = new google.maps.Marker({
      position: { lat: rider.lat, lng: rider.lng },
      map: this.map,
      icon: rider.vehiculo == 'moto' ? this.iconoMoto : this.iconoBicicleta
    });

    let html = '';

    html += `<div>${rider.nombre}</div>`;
    html += `<div>${rider.telefono}</div>`;

    if (rider.actividad == 'ocupado') {
      html += `<div>ID: ${rider.pedido}</div>`;
    }

    marker['infowindow'] = new google.maps.InfoWindow({
      content: html
    });

    google.maps.event.addListener(marker, 'click', function () {
      this['infowindow'].open(this.map, this);
    });

    this.markers.push({ riderID: rider.rider, marker, encontrado: true });
  }

  crearMarcadorRastreo(rider) {

    if (this.marcadores_accion == 'inicializar_marcador_rastreo') {
      this.marker = new google.maps.Marker({
        position: { lat: rider.lat, lng: rider.lng },
        map: this.map,
        icon: rider.vehiculo == 'moto' ? this.iconoMoto : this.iconoBicicleta
      });
    } else {
      this.marker.set({ lat: rider.lat, lng: rider.lng });
    }
  }

  removerMarcadores() {
    this.markers.forEach(marker => {
      marker.marker.setMap(null)
    });
  }

  graficarRuta() {

    this.removerMarcadores();

    var self = this;
    let origen = this._control.origen;
    let destino = this._control.destino;

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

  removerRuta() {
    this.directionsDisplay.setMap(null);
    this.removerMarcadores();
    this.marcadores_accion = 'inicializar_marcadores';
    this._mapa.mapAction$.next({ accion: 'traer_riders', filtro: this._control.map_filtroData })
  }

  limpiarRuta() {
    this._control.origen = null;
    this._control.destino = null;
    this._control.pedido = null;
    this.rider = null;
    this._mapa.mapAction$.next({ accion: 'remover_ruta' });
    this._control.isTracking = false;
  }
}
