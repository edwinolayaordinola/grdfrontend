import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TipogastosService {

  url : string = environment.HOST;

  constructor(
    private http : HttpClient
  ) { }

  findall(){
    return this.http.get<any>(`${this.url}`);
  }

}
