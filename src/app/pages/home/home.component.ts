import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { ControlService } from 'src/app/services/control.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {


  title: string = 'My first AGM project';
  lat = -33.444600;
  lng = -70.655585;

  origin = { lat: 24.799448, lng: 120.979021 };
  destination = { lat: 24.799524, lng: 120.975017 };

  riders = [];

  ridersSubscription$: Subscription;

  iconBicicleta = {
    url: 'https://res.cloudinary.com/ddon9fx1n/image/upload/v1565228910/tools/pin.png',
    scaledSize: {
      width: 40,
      height: 40
    }
  }

  iconMoto = {
    url: 'https://res.cloudinary.com/ddon9fx1n/image/upload/v1565230426/tools/pin_2.png',
    scaledSize: {
      width: 40,
      height: 40
    }
  }

  constructor(
    private _data: DataService,
    private _auth: AuthService,
    public _control: ControlService
  ) {
    this._control.activar('home');
    this.ridersSubscription$ = this._data.riders$.subscribe(riders => {
      this.riders = riders;
      console.log(riders)
    });
  }


  ngOnInit() {
  }

  ngOnDestroy() {
    this.ridersSubscription$.unsubscribe();
  }


}
