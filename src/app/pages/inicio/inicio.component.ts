import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from './../../../environments/environment';
import { LoginService } from 'src/app/_service/login.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  userName : string;
  token : any;

  constructor(
    private loginService : LoginService
  ) {
  }

  ngOnInit(): void {
    const helper = new JwtHelperService();
    this.token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken =  helper.decodeToken(this.token);
    this.userName = decodedToken.email;
  }

  registrarUsuario(){
    
  }

  cerrarSession1(){
    this.loginService.cerrarSession();
    return false;
  }
  

}
