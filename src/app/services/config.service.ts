import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  
  apiURL = 'http://localhost:3000';

  constructor() { }
}
