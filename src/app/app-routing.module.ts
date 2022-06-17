import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmergenciaEdicionComponent } from './pages/emergencias/emergencia-edicion/emergencia-edicion.component';
import { EmergenciasComponent } from './pages/emergencias/emergencias.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoginComponent } from './pages/login/login.component';
import { ModalComponent } from './pages/modal/modal.component';
import { UsuarioEdicionComponent } from './pages/usuarios/usuario-edicion/usuario-edicion.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';

const routes : Routes = [
  { path : '', component : LoginComponent },
  { path : 'inicio', component : InicioComponent , children : [
    { path : 'usuarios', component : UsuariosComponent , children : [
      { path : "nuevo" , component : UsuarioEdicionComponent },
      { path : "edicion/:id" , component : UsuarioEdicionComponent }
    ]},
    { path : 'emergencias', component : EmergenciasComponent, children : [
      { path: "nuevo", component : EmergenciaEdicionComponent },
      { path : "edicion/:id" , component : EmergenciaEdicionComponent }
    ] },
    { path : 'modal', component: ModalComponent }
  ]}/*,
  { path: '', redirectTo: 'login', pathMatch: 'full' },*/
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
