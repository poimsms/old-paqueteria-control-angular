import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isAuth: boolean = true;
  user: any;
  token: string;

  constructor(
    private _auth: AuthService,
    private _data: DataService,
    private router: Router
  ) { 
    this._auth.authState.subscribe((data: any) => {

      if (data.isAuth) {
        this.user = data.authData.user;
        this.token = data.authData.token;
        this.isAuth = true;
      } else {
        this.router.navigateByUrl('login');
      }
      // this.directionsService = new google.maps.DirectionsService();
      // this.directionsDisplay = new google.maps.DirectionsRenderer();
    });  

  }

  ngOnInit() {
  }

  openPage(page) {
    this.router.navigateByUrl(page);
  }

}
