import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  
  apiURL: string;

  tarifas: any;

  constructor(
    private http: HttpClient,
    private _config: ConfigService,
  ) {

    this.apiURL = this._config.apiURL;
    this.getTarifas();
   }

   getTarifas() {
    const url = `${this.apiURL}/global/tarifas-get-all`;
    this.http.get(url).toPromise().then(tarifas => this.tarifas = tarifas)
  }

   updateTarifas(body) {
    const url = `${this.apiURL}/global/tarifas-update`;
    return this.http.put(url, body).toPromise();
  }

  updateTarifasHorario(body) {
    const url = `${this.apiURL}/global/tarifas-horario-update`;
    return this.http.put(url, body).toPromise();
  }
}
