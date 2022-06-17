import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipofenomenoService {

  url = environment.HOST;

  constructor(
    private http : HttpClient
  ) { }

  findAll(){
    return this.http.get<any>(`${this.url}/sunass/phenomenontype/findall?withdefault=false&defaultText=%20`);
  }
}
