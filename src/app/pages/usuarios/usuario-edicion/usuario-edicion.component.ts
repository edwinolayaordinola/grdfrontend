import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import { UserService } from 'src/app/_service/user.service';
import { ModuleService } from 'src/app/_service/module.service';
import { ProfileService } from 'src/app/_service/profile.service';
import { map, switchMap } from 'rxjs/operators';
import  swal  from 'sweetalert2';

@Component({
  selector: 'app-usuario-edicion',
  templateUrl: './usuario-edicion.component.html',
  styleUrls: ['./usuario-edicion.component.css']
})
export class UsuarioEdicionComponent implements OnInit {

  userSelected : string;
  nameSelected : string;
  surnameSelected : string;
  mailSelected: string;
  positionSelected:string;
  areaSelected:string;

  usuariosLdap : any[];
  usuarioLdap : any[];
  profiles: any[] = [];
  modules: any[] = [];
  modulesProfiles : any[] = [];

  rptaInsert : any;

  token = sessionStorage.getItem(environment.TOKEN_NAME);
  url : string = environment.HOST;

  param_id : number;
  idEdit : number = 0;
  flagEdicion : boolean = false;

  hideenListUsers : boolean = true;
  userEdit : any = null;
  modulesProfilesEdit : any[] = [];

  constructor(
    private router : Router,
    private http : HttpClient,
    private userService : UserService,
    private moduleService : ModuleService,
    private profileService : ProfileService,
    private route : ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.moduleService.findAll().pipe(map((datamodules)=>{
      this.modules = JSON.parse(JSON.stringify(datamodules)).items;
      return this.modules;
    })).pipe(
      switchMap((datamodules)=>{
        return this.profileService.findAll().pipe(map((data)=>{
          this.profiles = JSON.parse(JSON.stringify(data)).items ;
          return this.profiles;
        }))
      })  
    ).subscribe(data=>{});

    this.route.params.subscribe((params: Params) => {
      this.param_id = params['id'];
      if(this.param_id!=undefined){
        this.flagEdicion = true;
        this.userService.findone(this.param_id).subscribe(data=>{
          this.userEdit = JSON.parse(JSON.stringify(data)).item;
          this.idEdit = this.userEdit.id;
          this.modulesProfiles = this.userEdit.modules;
          this.userSelected = this.userEdit.userName;
          this.nameSelected = this.userEdit.names;
          this.surnameSelected = this.userEdit.surNames;
          this.mailSelected = this.userEdit.mail;
          this.positionSelected = this.userEdit.positionName;
          this.areaSelected = this.userEdit.areaName;
        });
      }
    });
  }

  keypressUser(e : any){
    this.limpiarCampos();
    this.hideenListUsers = false;
    this.userService.findonldapby(e.target.value).subscribe(data=>{
      this.usuariosLdap = data.items;
    });  
  }

  limpiarCampos(){
    this.nameSelected = '';
    this.surnameSelected = '';
    this.mailSelected = '';
    this.positionSelected = '';
    this.areaSelected = '';
  }

  selectedUser(uldap : any){
        this.userSelected = uldap.attributes.mail.split('@')[0];
        this.nameSelected = uldap.attributes.givenName;
        this.surnameSelected = uldap.attributes.sn;
        this.mailSelected = uldap.attributes.mail;
        this.positionSelected = uldap.attributes.title;
        this.areaSelected = uldap.attributes.physicalDeliveryOfficeName;
        this.hideenListUsers = true;
  }
  
  selectProfile(codigo : any){
    let idModule = parseInt(codigo.target.name);
    let idProfile = codigo.target.id;
    idProfile = parseInt(idProfile.split('-')[1]);
    let lentghModulesProfiles = this.modulesProfiles.length;
    if(lentghModulesProfiles>0){
      for(var i=0;i<lentghModulesProfiles;i++){
        if(this.modulesProfiles[i].id == idModule){
          this.modulesProfiles.splice(i,1);
          break;
        }
      }
    }
    this.modulesProfiles.push({
      id : idModule,
      profile : {
        id : idProfile
      }
    });
    console.log(this.modulesProfiles);
  }

  guardarUsuario(){

    if(
        this.userSelected != undefined && 
        this.userSelected.trim() != '' &&
        this.nameSelected !=  undefined &&
        this.nameSelected.trim() != '' && 
        this.surnameSelected!=undefined &&
        this.surnameSelected.trim() != '' &&
        this.mailSelected != undefined &&
        this.mailSelected.trim() != '' &&
        this.positionSelected != undefined &&
        this.positionSelected.trim() != '' &&
        this.areaSelected != undefined &&

        this.modulesProfiles.length>0
      ){

      swal.fire({
        title: '¿Esta seguro de registrar el usuario?',
        text: "",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.isConfirmed) {
          let jsonUsuario = {
            id : this.idEdit,
            active : true,
            names: this.nameSelected,
            password : '12345678',
            modules : this.modulesProfiles,
            userName : this.mailSelected.split('@')[0],
            surNames : this.surnameSelected,
            inLdap: true,
            mail: this.mailSelected,
            positionName:this.positionSelected,
            areaName: this.areaSelected
          };

          if(this.flagEdicion){
            this.userService.update(jsonUsuario).subscribe(data=>{
              this.rptaInsert =  JSON.parse(JSON.stringify(data));
              if(this.rptaInsert.success){
                swal.fire(
                  'Se ha registrado correctamente el usuario',
                  ' ',
                  'success'
                );
                this.nameSelected = '';
                this.surnameSelected = '';
                this.mailSelected = '';
                this.positionSelected = '';
                this.areaSelected = '';
                this.modulesProfiles = [];
                this.router.navigate(['inicio/usuarios']);
              } else {
                swal.fire(
                  this.rptaInsert.message,
                  'success'
                );
              }
            });
          } else {
            this.userService.insert(jsonUsuario).subscribe(data=>{
              this.rptaInsert =  JSON.parse(JSON.stringify(data));
              if(this.rptaInsert.success){
                swal.fire(
                  'Se ha registrado correctamente el usuario',
                  ' ',
                  'success'
                );
                this.nameSelected = '';
                this.surnameSelected = '';
                this.mailSelected = '';
                this.positionSelected = '';
                this.areaSelected = '';
                this.modulesProfiles = [];
                this.router.navigate(['inicio/usuarios']);
              } else {
                swal.fire(
                  this.rptaInsert.message,
                  'success'
                );
              }
            });
          }
        }
      });

    } else{
      swal.fire(
        'Debe completar todos los campos obligatorios.',
        ' ',
        'error'
      );
    }
  }

  cancelarUsuario(){
    this.router.navigate(['inicio/usuarios']);
  }

}
