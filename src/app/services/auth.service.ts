import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigService } from './config.service';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiURL: string;
  usuario: any;
  token: string;
  authState = new BehaviorSubject({ isAuth: false, usuario: {} });

  constructor(
    private http: HttpClient,
    private _config: ConfigService
  ) {
    this.apiURL = this._config.apiURL;
    this.loadStorage();
  }

  loginUp(body) {
    this.signUp(body).then((res: any) => {
      console.log('listooo')
    });
  }

  loginIn(email, password) {
    return new Promise((resolve, reject) => {
      this.signIn(email, password).then((res: any) => {
        if (res.ok) {
          this.saveStorage(res.usuario, res.token, res.usuario._id);
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  logout() {
    this.removeStorage();
    this.usuario = {};
    this.token = '';
    this.authState.next({ isAuth: false, usuario: {} });
  }

  removeStorage() {
    localStorage.removeItem("authData");
  }

  saveStorage(usuario, token, uid) {
    const authData = { token, uid };
    localStorage.setItem("authData", JSON.stringify(authData));
    this.authState.next({ isAuth: true, usuario });
  }

  loadStorage() {
    if (localStorage.getItem('authData')) {
      const res = localStorage.getItem('authData');

      const token = JSON.parse(res).token;
      const uid = JSON.parse(res).uid;

      this.getUser(token, uid).then(usuario => {

        this.usuario = usuario;
        this.token = token;
        this.authState.next({ isAuth: true, usuario });
      });

    } else {
      this.authState.next({ isAuth: false, usuario: {} });
    }
  }

  signIn(email, password) {
    const url = `${this.apiURL}/usuarios/signin-email`;
    const body = { email, password };
    return this.http.post(url, body).toPromise();
  }

  signUp(body) {
    const url = `${this.apiURL}/usuarios/signup`;
    return this.http.post(url, body).toPromise();
  }

  getUser(token, id) {
    const url = `${this.apiURL}/usuarios/get-one?id=${id}`;
    const headers = new HttpHeaders({
      Authorization: `JWT ${token}`
    });
    return this.http.get(url, { headers }).toPromise();
  }



}
