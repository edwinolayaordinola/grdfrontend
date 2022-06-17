import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './../../_service/login.service';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user : string;
  password : string;
  rptaLogin : any[];
  msjError : string = "";

  constructor(
    private router : Router,
    private loginService  : LoginService
  ) { }

  ngOnInit(): void {
    this.user = "";
    this.password ="";
  }

  iniciarSesion(){
    return this.loginService.login(this.user, this.password).subscribe(data=>{
      this.rptaLogin = Object.values(data);
      if(this.rptaLogin[1]){
        this.msjError = "";
        sessionStorage.setItem(environment.TOKEN_NAME, this.rptaLogin[0]);
        this.router.navigate(['inicio/usuarios']);
      } else {
        this.msjError = this.rptaLogin[0];
      }
    });
  }

  eyePaswword(){
    
  }

}
