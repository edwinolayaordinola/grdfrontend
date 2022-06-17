import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmergenciaFilterDto } from 'src/app/_dto/emergenciaFilterDto';
import { EmergenciaService } from 'src/app/_service/emergencia.service';
import swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TipogastosService } from './../../_service/tipogastos.service';
import { CostoemergenciaService } from 'src/app/_service/costoemergencia.service';

@Component({
  selector: 'app-emergencias',
  templateUrl: './emergencias.component.html',
  styleUrls: ['./emergencias.component.css']
})
export class EmergenciasComponent implements OnInit {

  emergenciaFilterDto  : EmergenciaFilterDto;
  emergencias : any;
  date : Date = new Date();
  rptaList : any;

  fechaSeguimientoInput : string;
  placement = 'bottom';

  idEmergencia : number;

  /**Seguimiento */
  fechaSeguimiento : string;
  formDataArchivosSeguimiento : FormData;
  formDataFotosSeguimiento : FormData;

  /**costos */
  fechaCostoEmergencia : string;
  tipoGastoCostoEmergencia : number;
  costoRestablecimiento : number;
  fuenteDatoCostoEmergencia : string;
  tiposGastosCostoEmergencia : any[] = [];
  listaCostos : any[] = [];


  /*Paginacion */
  filaPagina : number;
  nroPaginacion : number;
  itemsPaginacion : number[] = [];
  nroPagina : number;
  total : number;

  constructor(
    public route : ActivatedRoute,
    private emergenciaService : EmergenciaService,
    private tipoGastoService : TipogastosService,
    private costoEmergenciaService : CostoemergenciaService,
    public modal : NgbModal
  ) { }

  ngOnInit(): void {

    this.emergenciaFilterDto = {
      year: this.date.getFullYear(),
      phenomenonType: {
          id: 0
      },
      emergencyStatus: {
          id: 1
      },
      startDate: "",
      endDate: "",
      ods: {
          id: 0
      },
      providerType: {
          id: 0
      },
      district: {
          id: 0,
          province: {
              id: 0,
              department: {
                  id: 0
              }
          }
      },
      paginator: {
          offset: 0,
          sort: "",
          order: "",
          limit: 10
      }
    };

    this.emergenciaService.findby(this.emergenciaFilterDto).subscribe(data=>{
      console.log(data);
      this.emergencias = JSON.parse(JSON.stringify(data)).items;
      this.nroPagina = 0;
      this.total = JSON.parse(JSON.stringify(data)).total;
      this.nroPaginacion = Math.ceil(this.total/this.emergenciaFilterDto.paginator.limit);
      for(let i=0; i<this.nroPaginacion;i++){
        this.itemsPaginacion.push(i);
      }
    });

  }

  findby(){

  }

  eliminar(id: number){

    swal.fire({
      title: '¿Esta seguro de eliminar la emrergencia?',
      text: "",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if(result.isConfirmed){

        this.emergenciaService.disable(id).subscribe(data=>{
          if(data.success){
            this.emergenciaService.findby(this.emergenciaFilterDto).subscribe(data=>{
              this.emergencias = JSON.parse(JSON.stringify(data)).items;
              swal.fire(
                'Se elimino la emergencia',
                ' ',
                'success'
              );
            });
          } else {
            swal.fire(
              'Error al eliminar emergencia',
              ' ',
              'error'
            );
          }
        });
      }
    });

  }

  actualizarEstado(id : number){

    swal.fire({
      title: '¿Esta seguro de actualizar el estado de la emrergencia, si realiza esta acción la Emergencia cambiará a Atendida?',
      text: "",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if(result.isConfirmed){

        this.emergenciaService.updateStatus(id).subscribe(data=>{
          if(data.success){
            this.emergenciaService.findby(this.emergenciaFilterDto).subscribe(data=>{
              this.emergencias = JSON.parse(JSON.stringify(data)).items;
              swal.fire(
                'Se actualizo estado de la emergencia',
                ' ',
                'success'
              );
            });
          } else {
            swal.fire(
              'Error al actualizar estado de la emergencia',
              ' ',
              'error'
            );
          }
        });
      }
    });

  } 

  reabrirEmergencia(id : number){

    swal.fire({
      title: '¿Esta seguro de reabrir la emrergencia, si realiza esta acción la Emergencia regresara a su estado anterior?',
      text: "",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if(result.isConfirmed){

        this.emergenciaService.reopen(id).subscribe(data=>{
          if(data.success){
            this.emergenciaService.findby(this.emergenciaFilterDto).subscribe(data=>{
              this.emergencias = JSON.parse(JSON.stringify(data)).items;
              swal.fire(
                'Se reabrio la emergencia',
                ' ',
                'success'
              );
            });
          } else {
            swal.fire(
              'Error al reabrir emergencia',
              ' ',
              'error'
            );
          }
        });
      }
    });

  }

  openFiltrar(contenido : any){
    this.modal.open(contenido, { size : 'xl'}); //medidas son sm,lg,xl
  }

  openDetalleEmergencia(contenido : any){
    this.modal.open(contenido, { size : 'xl'}); //medidas son sm,lg,xl
  }

  openSeguimientoEmergencia(contenido : any,  id : number){
    this.idEmergencia = id;
    this.modal.open(contenido, { size : 'xl'}); //medidas son sm,lg,xl
  }

  openCostosEmergencia(contenido : any,  id : number){
    this.tiposGastosCostoEmergencia.push(
                          { id  : 1, name : 'Alquiler camión cisterna', activo : 1 },
                          { id  : 2, name : 'Alquiler equipos', activo : 1 },
                          { id  : 3, name : 'Compra combustible', activo : 1 }, 
                          { id  : 4, name : 'Compra repuestos/materiales', activo : 1 },
                          { id  : 5, name : 'Servicios reparación', activo : 1 },
                          { id  : 6, name : 'Otros servicios', activo : 1 }
                        );
    this.idEmergencia = id;
    this.costoEmergenciaService.findcosts(id).subscribe(data=>{
      if(data.success){
        this.listaCostos = JSON.parse(JSON.stringify(data)).items;
        console.log(this.listaCostos);
      }else {
        
      }
    });
    this.modal.open(contenido, { size : 'xl'}); //medidas son sm,lg,xl

  }

  selectedArchivosSeguimiento(e : any){

  }

  selectedFotosSeguimiento(e : any){

  }

  paginar(index : number){
    this.emergenciaFilterDto = {
      year: this.date.getFullYear(),
      phenomenonType: {
          id: 0
      },
      emergencyStatus: {
          id: 1
      },
      startDate: "",
      endDate: "",
      ods: {
          id: 0
      },
      providerType: {
          id: 0
      },
      district: {
          id: 0,
          province: {
              id: 0,
              department: {
                  id: 0
              }
          }
      },
      paginator: {
          offset: 0,
          sort: "",
          order: "",
          limit: 10
      }
    };

    this.emergenciaService.findby(this.emergenciaFilterDto).subscribe(data=>{
      this.emergencias = JSON.parse(JSON.stringify(data)).items;
      this.nroPagina = index;
    });
  }

  selectedPaginator(){
    this.itemsPaginacion.splice(0,this.itemsPaginacion.length);
    this.emergenciaFilterDto = {
      year: this.date.getFullYear(),
      phenomenonType: {
          id: 0
      },
      emergencyStatus: {
          id: 1
      },
      startDate: "",
      endDate: "",
      ods: {
          id: 0
      },
      providerType: {
          id: 0
      },
      district: {
          id: 0,
          province: {
              id: 0,
              department: {
                  id: 0
              }
          }
      },
      paginator: {
          offset: 0,
          sort: "asc",
          order: "codigo",
          limit: 10
      }
    };

    this.emergenciaFilterDto.paginator.offset = 0;
    this.emergenciaFilterDto.paginator.limit = this.filaPagina;

    this.emergenciaService.findby(this.emergenciaFilterDto).subscribe(data=>{
      console.log(data);
      this.emergencias = JSON.parse(JSON.stringify(data)).items;
      this.nroPagina = 0;
      this.total = JSON.parse(JSON.stringify(data)).total;
      this.nroPaginacion = Math.ceil(this.total/this.emergenciaFilterDto.paginator.limit);
      for(let i=0; i<this.nroPaginacion;i++){
        this.itemsPaginacion.push(i);
      }
    });
  }

  formatoFecha(fecha : string){
    let arrayFecha = fecha.split('-');
    let anio = arrayFecha[0];
    let mes = arrayFecha[1];
    let dia = arrayFecha[2];
    if(mes.length <2)
      mes = '0'+ mes;
    if(dia.length <2)
      dia = '0'+ dia;
    return anio+'-'+mes+'-'+dia;
  }

  guardarCosto(){
    swal.fire({
      title: '¿Esta seguro de registrar el costo de emergencia?',
      text: "",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.isConfirmed) {
        const objectoFechaCosto = JSON.parse(JSON.stringify(this.fechaCostoEmergencia));
        let data = {
          date : this.formatoFecha(objectoFechaCosto.year + '-'+ objectoFechaCosto.month + '-' + objectoFechaCosto.day),
          dataSource : this.fuenteDatoCostoEmergencia,
          amount :  this.costoRestablecimiento,
          expenseType : {
            id : this.tipoGastoCostoEmergencia
          },
          emergency : {
            id : this.idEmergencia
          }
        }
        this.costoEmergenciaService.insertCost(data).subscribe(data=>{
          if(data.success){
            swal.fire(
              'Se ha registrado correctamente el costo',
              ' ',
              'success'
            );
            this.limpiarFormCostos();
          } else {
            swal.fire(
              'Error al registrar costo',
              ' ',
              'error'
            );
          }
        });
      }
    });
  }

  limpiarFormCostos(){
    this.fechaCostoEmergencia = '';
    this.tipoGastoCostoEmergencia =0;
    this.costoRestablecimiento = 0;
    this.fuenteDatoCostoEmergencia = '';
  }

}
