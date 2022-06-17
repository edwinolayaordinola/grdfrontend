import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url : string = environment.HOST;
  
  httpOptions = {
    headers : new HttpHeaders({
      'Content-type' : 'accept: application/json'
    })
  };

  constructor(
    private http : HttpClient,
    private router : Router
  ) { }

  login(user : string, password : string){
    const data = 'userName=' + user + '&password=' + password ;
    return this.http.request('POST', this.url + "/admin/user/login"+ '?' + data, { responseType : 'json' });
  }

  estaLogeado(){
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    return token!=null;
  }

  cerrarSession(){
    sessionStorage.clear();
    this.router.navigate(['']);
  }
}
