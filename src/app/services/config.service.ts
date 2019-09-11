import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  apiURL: string;
  version = '1.0.1'
  ENTORNO = 'PROD';

  constructor() {
    this.setApi();
   }

  setApi() {

    if (this.ENTORNO == 'DEV') {
      this.apiURL = `http://localhost:3000/v${this.version}`;
    }

    if (this.ENTORNO == 'PROD') {
      this.apiURL = `https://joopiterweb.com/v${this.version}`;
    }
    
  }

}
