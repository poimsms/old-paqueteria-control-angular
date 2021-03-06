import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  apiURL: string;
  version = '1.0.1'
  ENTORNO = 'PROD';

  coleccion_riders = '';
  path_riders = '';

  coleccion_coors = '';
  path_coors = '';

  coleccion_modalidad = '';
  path_modalidad = '';

  constructor() {
    this.setApi();
    this.setCollections();
   }

  setApi() {

    switch (this.ENTORNO) {
      case 'DEV':
        this.apiURL = `http://localhost:3000/v1.0.1`;
        break;

      case 'PROD':
        this.apiURL = `https://joopiterweb.com/v1.0.1`;
        break;

      case 'TEST':
        this.apiURL = `https://footballonapp.com/v1.0.1`;
        break;
    }
  }

  setCollections() {

    switch (this.ENTORNO) {
      case 'DEV':
        this.coleccion_riders = 'riders_dev';
        this.path_riders = 'riders_dev/';

        this.coleccion_coors = 'riders_coors_dev';
        this.path_coors = 'riders_coors_dev/';

        this.coleccion_modalidad = 'riders_modalidad_dev';
        this.path_modalidad = 'riders_modalidad_dev/';

        break;

      case 'PROD':
        this.coleccion_riders = 'riders';
        this.path_riders = 'riders/';

        this.coleccion_coors = 'riders_coors';
        this.path_coors = 'riders_coors/';

        this.coleccion_modalidad = 'riders_modalidad';
        this.path_modalidad = 'riders_modalidad/';

        break;

      case 'TEST':
        this.coleccion_riders = 'riders_dev';
        this.path_riders = 'riders_dev/';

        this.coleccion_coors = 'riders_coors_dev';
        this.path_coors = 'riders_coors_dev/';

        this.coleccion_modalidad = 'riders_modalidad_dev';
        this.path_modalidad = 'riders_modalidad_dev/';

        break;
    }
  }



}
