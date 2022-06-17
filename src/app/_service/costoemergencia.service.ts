import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { CostoEmergencia } from './../_model/costoEmergencia';

@Injectable({
  providedIn: 'root'
})
export class CostoemergenciaService {

  url : string = environment.HOST;

  constructor(
    private http : HttpClient
  ) { }

  insertCost(costo : CostoEmergencia){
    return this.http.post<any>(`${this.url}/sunass/emergency/insertcost`, costo);
  }

  updateCost(costo : CostoEmergencia){
    return this.http.post<any>(`${this.url}/sunass/emergency/updatecost`, costo);
  }

  findcosts(idEmergencia : number){
    return this.http.get<any>(`${this.url}/sunass/emergency/findcosts?id=`+idEmergencia);
  }
}
