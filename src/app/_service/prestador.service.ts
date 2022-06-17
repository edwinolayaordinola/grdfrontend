import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrestadorService {

  url = environment.HOST;

  constructor(
    private http : HttpClient
  ) { }

  findAll(){
    return this.http.get<any>(`${this.url}/sunass/provider/findall?withdefault=false&defaultText=%20`);
  }
}
