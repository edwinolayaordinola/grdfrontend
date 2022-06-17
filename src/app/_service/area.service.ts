import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  url : string = environment.HOST;

  constructor(
    private http : HttpClient
  ) { }

  findall(){
    return this.http.get<any>(`${this.url}/sunass/area/findall?withdefault=false&defaultText=%20`);
  }
}
