import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigService } from './config.service';
import { ToastrService } from 'ngx-toastr';

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
    private toastr: ToastrService

  ) {

    this.apiURL = this._config.apiURL;
    this.getTarifas();
  }

  getTarifas() {
    const url = `${this.apiURL}/global/tarifas-get-all`;
    this.http.get(url).toPromise().then(tarifas => {
      this.tarifas = tarifas;
      this.tarifas_temp = JSON.parse(JSON.stringify(this.tarifas));
    })
  }

  updateTarifas(body) {
    const url = `${this.apiURL}/global/tarifas-update`;
    return this.http.put(url, body).toPromise();
  }

  updateTarifasHorario(body) {
    const url = `${this.apiURL}/global/tarifas-horario-update`;
    return this.http.put(url, body).toPromise();
  }


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

}
