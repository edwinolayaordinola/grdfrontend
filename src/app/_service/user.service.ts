import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserExportDto } from '../_dto/userExportDto';
import { UserFilterDTO } from '../_dto/userFilterDTO';
import { User } from '../_model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  url : string = `${environment.HOST}`;

  constructor(
    private http : HttpClient
  ) { }

  insert(user : User){
    return this.http.post<User>(`${this.url}/sunass/user/insert`,user);
  }

  update (user : User){
    return this.http.post<User>(`${this.url}/sunass/user/update`,user);
  }

  findby(filter : UserFilterDTO){
    return this.http.post<any>(`${this.url}/sunass/user/findby`,filter);
  }

  findone(id : number){
    return this.http.get<any>(`${this.url}/sunass/user/findone?id=`+id);
  }

  findAll(){
    return this.http.get<any>(`${this.url}/sunass/user/findall?withdefault=false&defaultText=%20`);
  }

  findonldapby(userName : string){
    return this.http.get<any>(`${this.url}/admin/user/findonldapby?userName=`+userName);
  }

  delete(id : number){
    return this.http.get<any>(`${this.url}/sunass/user/delete?id=`+id);
  }

  disabled(id : number){
    return this.http.get<any>(`${this.url}/sunass/user/disable?id=`+id);
  }

  enabled(id : number){
    return this.http.get<any>(`${this.url}/sunass/user/enable?id=`+id);
  }

  export(dto : UserExportDto){
    return this.http.post(`${this.url}/sunass/user/export`,dto, {
      responseType: 'blob'
    });
  }

  findbyusername(nombre : string){
    return this.http.get<any>(`${this.url}/sunass/user/findbyusername?userName=`+nombre);
  }
  
  /*findByLdap(userName : string){*/
    /*
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      'Authorization': `${this.token}`
    });
    */
    //const requestOptions = { headers: headers };
    /*const data = 'userName=' + userName;*/
    //return this.http.request('GET', this.url + "admin/user/findonldapby"+ '?' + data, { responseType : 'json' });
    /*return this.http.get(this.url + "admin/user/findonldapby"+ '?' + data, { headers: new HttpHeaders({'Authorization': 'Bearer ' + this.token})} );*/
  /*}*/

}
