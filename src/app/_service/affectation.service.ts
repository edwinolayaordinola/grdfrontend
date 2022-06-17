import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AffectationService {

  url : string = environment.HOST;

  constructor(
    private  http : HttpClient
  ) { }

  finall(){
    return this.http.get<any>(`${this.url}/sunass/affectation/findall?withdefault=false&defaultText=%20`);
  }
}
