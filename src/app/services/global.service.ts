import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigService } from './config.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  apiURL: string;

  tarifas: any;

  tarifas_temp: any;

  show_tarifas_noche = false;
  show_tarifas_dia = false;
  isLoading = false;

  constructor(
    private http: HttpClient,
    private _config: ConfigService,
    private toastr: ToastrService,
    private _auth: AuthService
  ) { }

  closeTarifas() {
    this.tarifas_temp = JSON.parse(JSON.stringify(this.tarifas));
    this.show_tarifas_noche = false;
    this.show_tarifas_dia = false;
  }

  actualizarTarifas() {
    this.isLoading = true;
    this.tarifas = JSON.parse(JSON.stringify(this.tarifas_temp));

    this.updateTarifas(this.tarifas).then(() => {
      this.isLoading = false;
      this.show_tarifas_noche = false;
      this.show_tarifas_dia = false;
      this.getTarifas();
      this.toastr.success('Se han actualizado las tarifas con éxito', 'Tarifas actualizadas');
    });
  }

  getTarifas() {
    const url = `${this._config.apiURL}/tarifas/get-all`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });
    this.http.get(url, { headers }).toPromise().then(tarifas => {
      this.tarifas = tarifas;
      this.tarifas_temp = JSON.parse(JSON.stringify(this.tarifas));
    })
  }

  updateTarifas(body) {
    const url = `${this.apiURL}/tarifas/update`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });
    return this.http.put(url, body, { headers }).toPromise();
  }

  updateTarifasHorario(body) {
    const url = `${this.apiURL}/tarifas/horario-update`;
    const headers = new HttpHeaders({ token: this._auth.token, version: this._config.version });
    return this.http.put(url, body, { headers }).toPromise();
  }

}
