import { Component, OnInit } from '@angular/core';
import { ControlService } from 'src/app/services/control.service';
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

  constructor(public _control: ControlService) { }

  ngOnInit() { }

  cargarMapa() {

    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -33.444600, lng: -70.655585 },
      zoom: 15,
      disableDefaultUI: true
    });
    setTimeout(() => {
      this.graficarMarcador({ lat: -33.444600, lng: -70.655585 });

    }, 100);
  }

  graficarMarcador(coors) {
    if (!this.markerReady) {
      this.marker = new google.maps.Marker({
        position: coors,
        map: this.map,
        // icon: this.image
      });
      this.markerReady = true;
    } else {
      this.marker.setPosition(coors);
    }
  }

}
