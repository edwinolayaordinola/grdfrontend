import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmergenciaFilterDto } from '../_dto/emergenciaFilterDto';
import { Emergencia } from '../_model/emergencia';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmergenciaService {

  url = environment.HOST;

  constructor(
    private http : HttpClient
  ) { }

  insert(emergencia : Emergencia){
    return this.http.post<any>(`${this.url}/sunass/emergency/insert`,emergencia);
  }

  upload(formData : FormData){
    return this.http.post<any>(`${this.url}/sunass/emergency/upload`,formData);
  }

  findby(dto : EmergenciaFilterDto){
    return this.http.post<any>(`${this.url}/sunass/emergency/findby`,dto);
  }

  findone(id : number){
    return this.http.get<any>(`${this.url}/sunass/emergency/findone?id=`+id);
  }

  delete(id : number){
    return this.http.get<any>(`${this.url}/sunass/emergency/delete?id=`+id);
  }

  disable(id : number){
    return this.http.get<any>(`${this.url}/sunass/emergency/disable?id=`+id);
  }

  updateStatus(id : number){
    return this.http.get<any>(`${this.url}/sunass/emergency/updatestatus?id=`+id);
  }

  reopen(id : number){
    return this.http.get<any>(`${this.url}/sunass/emergency/reopen?id=`+id);
  }

}
