import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;
  isErr = false;
  isLoading = false;

  constructor(
    private _auth: AuthService,
    private router: Router
  ) {
    this._auth.authState.subscribe(data => {
      if (data.isAuth) {
        this.router.navigateByUrl('home');
      }
    });
  }

  ngOnInit() {
  }

  crearAdmin() {
    const data = {
      telefono: 76812201,
      email: 'poimsm@gmail.com',
      nombre: 'Oscar Garcia',
      password: 'lospri133',
      tipo: 'admin'
    }
    this._auth.loginUp(data);
  }

  crearRider() {
    const data = {
      telefono: 3,
      email: '3@gmail.com',
      nombre: 'Oscar Garcia',
      password: 'lospri133',
      rol: 'rider'
    }
    this._auth.loginUp(data);
  }

  crearCliente() {
    const data = {
      telefono: 4,
      email: '4@gmail.com',
      nombre: 'Oscar Garcia',
      password: 'lospri133',
      rol: 'cliente'
    }
    this._auth.loginUp(data);
  }

  login() {
    if (this.email && this.password) {
      this.isLoading = true;
      
      const authData = {
        email: this.email.toLowerCase(),
        password: this.password,
        from: 'dashborad-app'
      };
      
      this._auth.loginIn(authData).then(isAuth => {
        if (isAuth) {
          this.isLoading = false;
          this.router.navigateByUrl('home');
        } else {
          this.isLoading = false;
          this.isErr = true;
        }
      });
    }
  }

}
