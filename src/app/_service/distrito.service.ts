import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DistritoService {

  url = environment.HOST;

  constructor(
    private http : HttpClient
  ) { }

  finddistrictsbyprovince(idprov : number){
    return this.http.get<any>(`${this.url}/geometry/ubigeo/finddistrictsbyprovince?id=${idprov}&withdefault=false&defaultText=%20`);
  }

  findgeometrybyid(id : number){
    return this.http.get<any>(`${this.url}/geometry/ubigeo/findgeometrybyid?id=${id}&type=geojson`)
  }
}
