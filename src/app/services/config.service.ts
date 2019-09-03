import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  apiURL: string;
  version = '1.0.0'
  ENTORNO = 'DEV';

  constructor() {
    this.setApi();
   }

  setApi() {

    if (this.ENTORNO == 'DEV') {
      this.apiURL = `http://localhost:3000/dashboard/v${this.version}`;
    }

    if (this.ENTORNO == 'PROD') {
      this.apiURL = `https://joopiterweb.com/dashboard/v${this.version}`;
    }
    
  }

}
