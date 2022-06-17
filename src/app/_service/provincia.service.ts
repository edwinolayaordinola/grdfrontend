import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {

  url = environment.HOST;

  constructor(
    private http : HttpClient
  ) { }

  findprovincesbydepartment(iddep : number){
    return this.http.get<any>(`${this.url}/geometry/ubigeo/findprovincesbydepartment?id=${iddep}&withdefault=false&defaultText=%20`);
  }
}
