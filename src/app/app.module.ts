import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmergenciaEdicionComponent } from './pages/emergencias/emergencia-edicion/emergencia-edicion.component';
import { EmergenciasComponent } from './pages/emergencias/emergencias.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoginComponent } from './pages/login/login.component';
import { UsuarioEdicionComponent } from './pages/usuarios/usuario-edicion/usuario-edicion.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from './../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HashLocationStrategy } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

export function tokenGetter(){
  return sessionStorage.getItem(environment.TOKEN_NAME)
}

@NgModule({
  declarations: [
    AppComponent,
    UsuariosComponent,
    InicioComponent,
    LoginComponent,
    UsuarioEdicionComponent,
    EmergenciasComponent,
    EmergenciaEdicionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    JwtModule.forRoot({
      config : { 
        tokenGetter : tokenGetter,
        allowedDomains : ['10.10.3.30'],
        disallowedRoutes : ['http://10.10.3.30/restgrd/admin/user/login']
      }
    })
  ],
  providers: [
    { provide : HashLocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
