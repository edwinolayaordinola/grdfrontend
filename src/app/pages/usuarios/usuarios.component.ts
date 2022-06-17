import { Component, OnInit, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/_service/user.service';
import { UserFilterDTO } from './../../_dto/userFilterDTO';
//import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap'
import { ModuleService } from './../../_service/module.service';
import { AreaService } from 'src/app/_service/area.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  userFilterDTO : UserFilterDTO;
  filaPagina : number;
  rptaList : any;
  valueInicialPage : number = 5;
  rowPage : number[] = [10,20,50];
  title = 'appBootstrap';
  closeResult: string = '';
  ids : number[] = [];
  modalFiltrar : any;
  userSelected : string;
  usuariosLdap : any[] = [];
  hideenListUsers : boolean = true;
  modulos : any[] = [];
  areas : any[] = [];
  moduloSelected : number;
  areaSelected : number;
  userId : number;

  /**Paginacion */
  nroPaginacion : number;
  itemsPaginacion : number[] = [];
  nroPagina : number;
  total : number;

  constructor(
    private router : Router, //para navegar
    public route : ActivatedRoute, //lo que viene por url
    private userService : UserService,
    private moduloService : ModuleService,
    private areaService : AreaService,
  public modal : NgbModal
  ) { }

  ngOnInit(): void {

    this.userFilterDTO = { module : { id : 0 },
                            id : 0,
                            ids : [0],
                            area : { id : 0 },
                            paginator : {
                              offset : 0,
                              sort : 'asc',
                              order : 'username',
                              limit : 10
                            }
                          };
    this.userService.findby(this.userFilterDTO).subscribe(data=>{
      console.log(data);
      this.rptaList = JSON.parse(JSON.stringify(data)).items;
      this.nroPagina = 0;
      this.total = JSON.parse(JSON.stringify(data)).total;
      this.nroPaginacion = Math.ceil(this.total/this.userFilterDTO.paginator.limit);
      for(let i=0; i<this.nroPaginacion;i++){
        this.itemsPaginacion.push(i);
      }
    });

    this.moduloService.findAll().subscribe(data=>{
      this.modulos = JSON.parse(JSON.stringify(data)).items;
    });

    /*this.areaService.findall().subscribe(data=>{
      console.log(data);
      this.areas = JSON.parse(JSON.stringify(data)).items;
    });*/
    this.areas.push(
                    { id : 1, nombre: 'Sin Area' , activo:1},
                    { id : 3, nombre: 'OTI' , activo:1},
                    { id : 21, nombre: 'DF' , activo:1},
                    { id : 22, nombre: 'OCI' , activo:1},
                    { id : 43, nombre: 'OAF-UT' , activo:1},
                    { id : 44, nombre: 'DPN' , activo:1},
                    { id : 45, nombre: 'DAP' , activo:1},
                    { id : 48, nombre: 'TRASS' , activo:1},
                    { id : 49, nombre: 'ODS-PAS' , activo:1},
                    { id : 50, nombre: 'LIMA' , activo:1}
                  );
  }

  selectedPaginator(){
    this.itemsPaginacion.splice(0,this.itemsPaginacion.length);
    this.userFilterDTO = { module : { id : 0 },
                            id : 0,
                            ids : [0],
                            area : { id : 0 },
                            paginator : {
                              offset : 0,
                              sort : 'asc',
                              order : 'username',
                              limit : 10
                            }
                          };

    this.userFilterDTO.paginator.offset = 0;
    this.userFilterDTO.paginator.limit = this.filaPagina;
    this.userService.findby(this.userFilterDTO).subscribe(data=>{
      this.rptaList = JSON.parse(JSON.stringify(data)).items;
      this.nroPagina = 0;
      this.total = JSON.parse(JSON.stringify(data)).total;
      this.nroPaginacion = Math.ceil(this.total/this.userFilterDTO.paginator.limit);
      for(let i=0; i<this.nroPaginacion;i++){
        this.itemsPaginacion.push(i);
      }
    });
  }

  open(contenido : any){
    this.modal.open(contenido, { size : 'xl'}); //medidas son sm,lg,xl
  }

  desactivar(id : number){

    swal.fire({
      title: '¿Esta seguro de Inhabilitar al usuario?',
      text: "",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if(result.isConfirmed){

        this.userService.disabled(id).subscribe(data=>{
          if(data.success){
            this.userService.findby(this.userFilterDTO).subscribe(data=>{
              this.rptaList = JSON.parse(JSON.stringify(data)).items;
              swal.fire(
                'Se Inhabilito el usuario',
                ' ',
                'success'
              );
            });
          } else {
            swal.fire(
              'Error al Inhabilitar usuario',
              ' ',
              'error'
            );
          }
        });
      }
    });
  }

  activar(id : number){

    swal.fire({
      title: '¿Esta seguro de Habilitar al usuario?',
      text: "",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if(result.isConfirmed){

        this.userService.enabled(id).subscribe(data=>{
          if(data.success){
            this.userService.findby(this.userFilterDTO).subscribe(data=>{
              this.rptaList = JSON.parse(JSON.stringify(data)).items;
              swal.fire(
                'Se Habilito el usuario',
                ' ',
                'success'
              );
            });
          } else {
            swal.fire(
              'Error al Habilitar usuario',
              ' ',
              'error'
            );
          }
        });
      }
    });
    
  }

  addUserDescargar(id : number){
    if(this.ids.length>0){
      const index = this.ids.indexOf(id);
      if( index >=0){
        this.ids.splice(index,1);
      } else {
        this.ids.push(id);
      }
    } else {
      this.ids.push(id);
    }
  }

  descargarUsuarios(){
    this.userFilterDTO.ids = this.ids;
    this.userFilterDTO.paginator.limit = 0;
    this.userService.export(this.userFilterDTO).subscribe(data=>{
      var fileURL = window.URL.createObjectURL(data);
      var a = document.createElement("a");
      a.href = fileURL;
      a.download = 'archivo';
      a.click();
    });
  }

  keypressUser(e : any){
    this.hideenListUsers = false;
    this.userService.findonldapby(e.target.value).subscribe(data=>{
      this.usuariosLdap = data.items;
    });
  }

  selectedUser(uldap : any){
    //console.log(uldap.key.split('@')[0]);
    //console.log(this.userSelected);
    this.userSelected = uldap.key.split('@')[0];
    this.hideenListUsers = true;
    this.userService.findbyusername(this.userSelected).subscribe(data=>{
      //console.log(data.items);
      this.userId = JSON.parse(JSON.stringify(data)).items[0].id;
    });
  }

  mostrarFiltro(){
    //this.modalFiltrar.modal('show');
  }

  buscarUser(){


    this.userFilterDTO = { module : { id : this.moduloSelected },
                            id : this.userId,
                            ids : [0],
                            area : { id : this.areaSelected },
                            paginator : {
                              offset : 0,
                              sort : 'asc',
                              order : 'username',
                              limit : 10
                            }
                          };
    this.userService.findby(this.userFilterDTO).subscribe(data=>{
      this.rptaList = JSON.parse(JSON.stringify(data)).items;
    });
  }

  limpiarUser(){
    this.moduloSelected = 0;
    this.areaSelected = 0;
    this.userSelected = "";
    this.userId = 0;
    this.userFilterDTO = { module : { id : 0 },
                            id : 0,
                            ids : [0],
                            area : { id : 0 },
                            paginator : {
                              offset : 0,
                              sort : 'asc',
                              order : 'username',
                              limit : 10
                            }
                          };
    this.userService.findby(this.userFilterDTO).subscribe(data=>{
      this.rptaList = JSON.parse(JSON.stringify(data)).items;
    });
  }

  paginar(index : number){
    this.userFilterDTO = { module : { id : 0 },
                            id : 0,
                            ids : [0],
                            area : { id : 0 },
                            paginator : {
                              offset : index * (this.userFilterDTO.paginator.limit),
                              sort : 'asc',
                              order : 'username',
                              limit : 10
                            }
                          };
    this.userService.findby(this.userFilterDTO).subscribe(data=>{
      this.rptaList = JSON.parse(JSON.stringify(data)).items;
      this.nroPagina = index;
    });
  }

}
