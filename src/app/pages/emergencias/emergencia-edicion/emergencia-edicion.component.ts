import { map, switchMap } from 'rxjs/operators';
import { Component, OnInit, Type } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Departamento } from 'src/app/_model/departamento';
import { Distrito } from 'src/app/_model/distrito';
import { Provincia } from 'src/app/_model/provincia';
import { DepartamentoService } from 'src/app/_service/departamento.service';
import { DistritoService } from 'src/app/_service/distrito.service';
import { ProvinciaService } from 'src/app/_service/provincia.service';
import { AfectacionservicioService } from 'src/app/_service/afectacionservicio.service';
import { AfectacionServicio } from 'src/app/_model/afectacionServicio';
import { TipofenomenoService } from 'src/app/_service/tipofenomeno.service';
import { TipoFenomento } from 'src/app/_model/tipoFenomeno';
import { TipoPrestador } from 'src/app/_model/tipoPrestador';
import { TipoprestadorService } from 'src/app/_service/tipoprestador.service';
import { Prestador } from 'src/app/_model/prestador';
import { PrestadorService } from 'src/app/_service/prestador.service';
import { Feature, Map } from 'ol';
import { View } from 'ol';
import Projection from 'ol/proj/Projection';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import TileLayer from 'ol/layer/Tile';
import OSM  from 'ol/source/OSM';
import Draw from 'ol/interaction/Draw';
import VectorSource from 'ol/source/Vector';
import VectorLayer  from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { EmergenciaService } from 'src/app/_service/emergencia.service';
import swal  from 'sweetalert2';
import { TipocomponenteService } from 'src/app/_service/tipocomponente.service';
import { typeComponent } from 'src/app/_model/tipoComponente';
import { AffectationService } from 'src/app/_service/affectation.service';
import { Emergencia } from './../../../_model/emergencia';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import CircleStyle from 'ol/style/Circle';
import { Affectation } from './../../../_model/affectation';
import { DocumentDto } from './../../../_dto/documentDto';
import { ImagesDto } from 'src/app/_dto/imagesDto';
import { DistricDto } from 'src/app/_dto/districtDto';
import { DatasEmergenciasDto } from 'src/app/_dto/datasEmergenciaDto';
import { ComponentDto } from 'src/app/_dto/componentDto';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import LineString from 'ol/geom/LineString';


@Component({
  selector: 'app-emergencia-edicion',
  templateUrl: './emergencia-edicion.component.html',
  styleUrls: ['./emergencia-edicion.component.css']
})

export class EmergenciaEdicionComponent implements OnInit {

  departamentoSelected : number;
  provinciaSelected : number;
  distritoSelected : Distrito;
  localidad : string;
  hechos : string;
  fuenteInformacion : string;
  fechaIncidente : Date;
  zonaAfectada : string;
  nroUsuariosAfectados : number;
  cantidadPoblacionAfectada : number;
  hechosInput : string;
  fuenteInfoInput : string;
  fechaIncidenteInput : string;
  zonaAfectadaInput : string;
  nroUsuarioInput : number;
  cantidadPoblacionAfectadaInput : number;
  afectacionServicioSelected : number;
  typePhenomenonSelected : number;
  tipoFenomenoOtro : string;
  typeProviderSelected : number;
  prestadorSelected : number;
  tipoPrestadorOtro : string;
  actionsTakenInput : string;
  descriptionSupportInput : string;
  highestRequirement : string;
  tipoComponenteSelected  : typeComponent;
  nombreTipoComponente : string;
  afectationSelected : Affectation;
  descripcionAfectacion : string;
  componentes : any[] =  [];
  componenteEmergencia : ComponentDto[] = [];
  emergencia : Emergencia;

  departamentos : Departamento[];
  provincias : Provincia[];
  distritos : Distrito[] = [];
  distritosAdd : Distrito[] = [];
  localidades : any[] = [];
  afectacionServicios : AfectacionServicio[] = [];
  tiposFenomenos : TipoFenomento[] = [];
  tiposPrestadores : TipoPrestador[] = [];
  prestadores : Prestador[] = [];
  tiposcomponentes : typeComponent[] = [];
  afectation : Affectation[] = [];

  map : Map;
  projection: Projection;
  view: View;
  source : any;
  raster : any = TileLayer;
  vector : any = VectorLayer;

  datasEmergencia : DatasEmergenciasDto[] = [];
  districtAdd : DistricDto[] = [];
  nombreDocumentos : DocumentDto[] = [];
  nombreFotos : ImagesDto[] = [];

  hiddenTipoFenomenoOtro : boolean = true;
  hiddenTipoPrestadorEps : boolean = true;
  hiddenTipoPrestadorOtro : boolean = true;
  hiddenModalError : boolean = true;

  fotos : File[] = [];
  archivos : File[] = [];

  feature : any;
  polygon : any;
  draw : any;
  msjError : string;
  model : any;

  typeGeometry : string = 'Point';
  placement = 'bottom';

  formDataArchivos : FormData;
  formDataFotos : FormData;

  param_id : number = 0;

  guid : string;
  featureEdit : any;

  constructor(
    private router : Router,
    private departamentoService  : DepartamentoService,
    private provinciaService  : ProvinciaService,
    private distritoService : DistritoService,
    private afectacionservicioService : AfectacionservicioService,
    private tipoFenomenoService : TipofenomenoService,
    private tipoPrestadorService : TipoprestadorService,
    private prestadorService : PrestadorService,
    private tipoComponenteService : TipocomponenteService,
    private emergenciaService : EmergenciaService,
    private affectationService : AffectationService,
    private route : ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.departamentoService.findAll()
      .pipe(
        map((data)=>{
          return JSON.parse(JSON.stringify(data)).items;
        })
      )
      .pipe( //el pipe permite operar el resultado del observable final
        switchMap((datadepa)=>{
          this.departamentos = datadepa;
          return this.afectacionservicioService.findAll().pipe(map((data)=>{
            return JSON.parse(JSON.stringify(data)).items;
          }))
        })
      )
      .pipe(
        switchMap((dataafectacion)=>{
          this.afectacionServicios = dataafectacion;
            return this.tipoFenomenoService.findAll().pipe(map((data)=>{
              return JSON.parse(JSON.stringify(data)).items;
          }))
        })
      )
      .pipe(
        switchMap((datatipofenomeno)=>{
          this.tiposFenomenos = datatipofenomeno;
          return this.tipoPrestadorService.findAll().pipe(map((data)=>{
            return JSON.parse(JSON.stringify(data)).items;
          }))
        })
      )
      .pipe(
        switchMap((datatipoprestador)=>{
          this.tiposPrestadores = datatipoprestador;
            return this.prestadorService.findAll().pipe(map((data)=>{
              return JSON.parse(JSON.stringify(data)).items;
            }))
          }
        )
      )
      .pipe(
        switchMap((dataprestador)=>{
          this.prestadores = dataprestador;
            return this.tipoComponenteService.findAll().pipe(map((data)=>{
              return JSON.parse(JSON.stringify(data)).items;
            }))
          }
        )
      ).pipe(
        switchMap((datatipocomponente)=>{
          this.tiposcomponentes = datatipocomponente;
          return this.affectationService.finall().pipe(map((data)=>{
            return JSON.parse(JSON.stringify(data)).items;
          }))
        })
      )
      .subscribe((dataafectation)=>{
        this.afectation = dataafectation;
        proj4.defs(
          'EPSG:32718',
          '+proj=utm +zone=18 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs'
        );
        register(proj4);
        this.view = new View({
          projection: 'EPSG:32718',
          zoom: 5,
          center: [333895.3178185496, 9033417.657545477]
        });
        this.view.setMinZoom(5);
        this.raster = new TileLayer({
          source : new OSM()
        });
        this.vector = new VectorLayer({
          source: new VectorSource(),
          style: new Style({
            fill: new Fill({
              //color: 'rgba(250,250,250,0.2)'
              color: '#AACCDD',
            }),
            stroke: new Stroke({
              color: '#ffcc33',
              width: 5
            }),
            image: new CircleStyle({
              radius: 5,
              fill: new Fill({
                color: '#ffcc33'
              }),
              stroke : new Stroke({
                width: 5,
                color: '#ffcc33'
              })
            })
          })
        });
        this.map = new Map({
          view: this.view,
          layers: [
            this.raster,
            this.vector
          ],
          target: 'map',
        });
        this.addInteraction('Point');

        this.route.params.subscribe((params: Params) => {
          this.param_id = params['id'];
          if(this.param_id!=undefined){
            this.emergenciaService.findone(this.param_id).subscribe(data=>{
              console.log(data);
              const emergencia = JSON.parse(JSON.stringify(data)).item;
              this.departamentoSelected = emergencia.department.id;
              this.provinciaService.findprovincesbydepartment(emergencia.department.id).subscribe(data=>{
                this.provincias = JSON.parse(JSON.stringify(data)).items;
                this.provinciaSelected = emergencia.department.province.id;
              });
              const arrayDistritos = emergencia.department.province.districts;
              for(var i=0;i<arrayDistritos.length;i++){
                this.distritosAdd.push(arrayDistritos[i]);
              }
              this.localidades = emergencia.locales;
              this.hechosInput = emergencia.facts;
              this.fuenteInfoInput = emergencia.dataSource;
              this.fechaIncidenteInput = emergencia.data;
              this.zonaAfectadaInput = emergencia.affectedArea;
              this.nroUsuarioInput = emergencia.data.datauseraffecteds;
              this.cantidadPoblacionAfectadaInput = emergencia.data.datapeopleaffecteds;
              this.afectacionServicioSelected = emergencia.serviceAffectation.id;
              this.typePhenomenonSelected = emergencia.phenomenonType.id;
              this.tipoFenomenoOtro = emergencia.descriptionPhenomenon;
              this.typeProviderSelected = emergencia.provider.providerType.id;
              this.prestadorSelected = emergencia.provider.id;
              this.actionsTakenInput = emergencia.actionsTaken;
              this.descriptionSupportInput = emergencia.descriptionSupport;
              this.highestRequirement = emergencia.requestRequirements;
              const arrayComponentes = emergencia.components;
              for(var i=0;i<arrayComponentes.length;i++){
                this.componentes.push({
                  componentType : arrayComponentes[i].componentType.name,
                  name : arrayComponentes[i].name,
                  afectacion :  arrayComponentes[i].affectation.name,
                  descripcion : ''
                });
              }
              console.log(emergencia.geometry);
              switch(emergencia.geometry.type){
                case 'Point' :
                                this.featureEdit = new Feature({
                                  geometry: new Point(emergencia.geometry.coordinates),
                                });
                                break;
                case 'Polygon' :
                                this.featureEdit = new Feature({
                                  geometry: new Polygon(emergencia.geometry.coordinates),
                                });
                                break;
                case 'LineString' :
                                this.featureEdit = new Feature({
                                  geometry: new LineString(emergencia.geometry.coordinates),
                                });
                                break;
              }
              //console.log(this.featureEdit);
              const vectorSourcexx = new VectorSource({
                features: [this.featureEdit],
              });
              const vectorLayerxx = new VectorLayer({
                source: vectorSourcexx,
              });
              this.map.addLayer(vectorLayerxx);
              //this.vector.addFeatures(this.featureEdit);

              //this.vector.setSource(this.featureEdit);

              /*if (geometria !== 'None') {
                this.vector.getSource().clear();
                this.draw = new Draw({
                  source: this.vector.getSource(),
                  type: geometria
                });
                this.vector.getSource().clear();
                this.map.addInteraction(this.draw);
              }*/


            });
          }
        });
      });
  }

  selectedDepartamento(){
    this.provinciaService.findprovincesbydepartment(this.departamentoSelected).subscribe(data=>{
      this.provincias = JSON.parse(JSON.stringify(data)).items;
    });
  }

  selectedProvincia(){
    this.distritoService.finddistrictsbyprovince(this.provinciaSelected).subscribe(data=>{
      this.distritos = JSON.parse(JSON.stringify(data)).items;
    });
  }

  selectedDistrito(){
    this.distritoService.findgeometrybyid(this.distritoSelected.id).subscribe(data=>{
      let geojson = data;
      const vectorSource = new VectorSource({
        features: new GeoJSON().readFeatures(geojson),
      });

      this.feature = vectorSource.getFeatures()[0];
      this.polygon  = this.feature.getGeometry();

      this.view.fit(this.polygon, {padding : [1,1,1,1]});
      this.view.setZoom(12);
    });
  }

  agregarDistrito(){
    const rpta = this.distritosAdd.indexOf(this.distritoSelected);
    if(rpta === -1){
      this.distritosAdd.push(this.distritoSelected);
    }
  }

  eliminarDistrito(idDistrito : number){
    this.distritosAdd.forEach((element,index)=>{
      if(element.id === idDistrito){
        this.distritosAdd.splice(index,1);
      }
    });
  }

  agregarLocalidad(){
    const rpta = this.localidades.indexOf(this.localidad);
    if(rpta === -1){
      this.localidades.push({ name :this.localidad });
    }
    this.localidad = '';
  }

  eliminarLocalidad(loc: string){
    this.localidades.forEach((element,index)=>{
      if(element === loc){
        this.localidades.splice(index,1);
      }
    });
  }

  selectedTypePhenomenon(){
    if(this.typePhenomenonSelected == 13){
      this.hiddenTipoFenomenoOtro = false;
    } else {
      this.hiddenTipoFenomenoOtro = true;
    }
  }

  selectedTypeProvider(){
    if(this.typeProviderSelected == 1){
      this.hiddenTipoPrestadorEps = false;
      this.hiddenTipoPrestadorOtro = true;
    } else{
      this.hiddenTipoPrestadorOtro = false;
      this.hiddenTipoPrestadorEps = true;
    }
  }

  selectedArchivos(e : any){
    if(e.target.files.length>3){
      swal.fire(
        'Cancelado',
        'Debe adjuntar 3 archivos como máximo',
        'error'
      );
      return;
    } else {
      for(var i=0;i<e.target.files.length;i++){
        if( ((e.target.files[i].size)/1024) > 10000 ){
          swal.fire(
            'Debe pesar menos de 10 MB',
            e.target.files[i].name,
            'error'
          );
          return;
        }
        if( !(e.target.files[i].name.split('.')[1] =="pdf" ||
            e.target.files[i].name.split('.')[1] =="xlsx" ||
            e.target.files[i].name.split('.')[1] =="docx" )
        ){
          swal.fire(
            'Debe tener formato PDF XLS WORD',
            e.target.files[i].name,
            'error'
          );
          return;
        }
      }

      this.archivos = e.target.files;
      this.formDataArchivos = new FormData();
      for(var i=0;i<this.archivos.length;i++){
        this.guid = this.uuid();
        this.formDataArchivos.append(this.guid.toString(),this.archivos[i]);
      }
    }
  }

  selectedFotos(e : any){
    if(e.target.files.length>10){
      swal.fire(
        'Cancelado',
        'Debe adjuntar 10 fotos como máximo',
        'error'
      );
      return;
    } else {
      for(var i=0;i<e.target.files.length;i++){
        if( ((e.target.files[i].size)/1024) > 3000 ){
          swal.fire(
            'Debe pesar menos de 3 MB',
            e.target.files[i].name,
            'error'
          );
          return;
        }
        if( !(e.target.files[i].name.split('.')[1] =="jpeg" ||
            e.target.files[i].name.split('.')[1] =="png" ||
            e.target.files[i].name.split('.')[1] =="tiff" ||
            e.target.files[i].name.split('.')[1] =="bpm" ||
            e.target.files[i].name.split('.')[1] =="gif" ||
            e.target.files[i].name.split('.')[1] =="png")
        ){
          swal.fire(
            'Debe tener formato JPEG PNG TIFF BPM GIF PNG',
            e.target.files[i].name,
            'error'
          );
          return;
        }
      }

      this.fotos = e.target.files;
      this.formDataFotos = new FormData();
      for(var i=0;i<this.fotos.length;i++){
        this.guid = this.uuid();
        this.formDataFotos.append(this.guid,this.fotos[i]);
      }
    }
  }

  selectedAfectation(){

  }

  dibujarPunto(){
    this.typeGeometry = 'Point';
    this.map.removeInteraction(this.draw);
    this.addInteraction('Point');
  }

  dibujarLinea(){
    this.typeGeometry = 'LineString';
    this.map.removeInteraction(this.draw);
    this.addInteraction('LineString');
  }

  dibujarPoligono(){
    this.typeGeometry = 'Polygon';
    this.map.removeInteraction(this.draw);
    this.addInteraction('Polygon');
  }

  addInteraction(geometria : string) {
    if (geometria !== 'None') {
      this.vector.getSource().clear();
      this.draw = new Draw({
        source: this.vector.getSource(),
        type: geometria
      });
      this.vector.getSource().clear();
      this.map.addInteraction(this.draw);
    }
  }

  limpiarMapa(){
    this.vector.getSource().clear();
  }

  selectedTipoComponente(){
    
  }

  agregarComponente(){

    if( this.tipoComponenteSelected != undefined &&
        this.nombreTipoComponente != undefined &&
        this.nombreTipoComponente.trim() != "" &&
        this.afectationSelected != undefined &&
        this.descripcionAfectacion != undefined &&
        this.descripcionAfectacion.trim() != "" 
      ){
        this.componentes.push({
          componentType : this.tipoComponenteSelected.name,
          componentTypeId : this.tipoComponenteSelected.id,
          name : this.nombreTipoComponente,
          afectacion : this.afectationSelected.name,
          afectacionId : this.afectationSelected.id,
          descripcion : this.descripcionAfectacion
        });
      } 
    else {
      swal.fire(
        'Debe completar todos los campos de componentes',
        ' ',
        'error'
      );
    }

  }

  eliminarComponente(i : number){
    this.componentes.forEach((element,index)=>{
      if(index === i){
        this.componentes.splice(index,1);
      }
    });
  }

  uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  guardarEmergencia(){
    
    this.emergenciaService.upload(this.formDataArchivos).pipe(map((data)=>{
      return data;
    })).pipe(switchMap((data)=>{
        return this.emergenciaService.upload(this.formDataFotos).pipe(map((datae)=>{
          return datae;
        }))
    })).pipe(switchMap((data)=>{
        console.log(data);
        this.distritosAdd.forEach(datad=>{
          this.districtAdd.push({id : datad.id});
        });
        this.formDataArchivos.forEach((value,key)=>{
          this.nombreDocumentos.push({ guid : key });
        });
        this.formDataFotos.forEach((value,key)=>{
          this.nombreFotos.push({ guid : key });
        });
        this.datasEmergencia.push({ value : 1 , variable :  { id :1 } });
        this.datasEmergencia.push({ value : 2 , variable :  { id :2 } });
  
        this.componentes.forEach(data=>{
          this.componenteEmergencia.push({
            name : data.name,
            componentType : {
              id : data.componentTypeId
            },
            description : data.descripcion,
            affectation : {
              id : data.afectacionId
            }
          })
        });
        const objectFechaIncidenteInput = JSON.parse(JSON.stringify(this.fechaIncidenteInput));
        this.emergencia = {
          id : 0,
          provider : {
            name : this.tipoPrestadorOtro,
            id: this.prestadorSelected,
            providerType:{
              id: this.typeProviderSelected
            }
          },
          date : this.formatoFecha(objectFechaIncidenteInput.year + '-'+ objectFechaIncidenteInput.month + '-' + objectFechaIncidenteInput.day),
          dataSource: this.fuenteInfoInput,
          locales : this.localidades,
          facts : this.hechosInput,
          affectedArea : this.zonaAfectadaInput,
          actionsTaken : this.actionsTakenInput,
          descriptionSupport: "dfgdfgdf",
          requestRequirements : this.highestRequirement,
          descriptionPhenomenon : this.tipoFenomenoOtro,
          geometry:{
            type : this.typeGeometry,
            coordinates : [ 43301.657559495885 , 9317750.498009142 ],
            srid: 32718
          },
          phenomenonType : {
            id : this.typePhenomenonSelected
          },
          spatialReference : {
            id : 32718
          },
          serviceAffectation : {
            id : this.afectacionServicioSelected
          },
          emergencyStatus: {
            id : 1
          },
          datas : this.datasEmergencia,
          documents:  this.nombreDocumentos,
          images : this.nombreFotos,
          districts : this.districtAdd,
          components : this.componenteEmergencia
        };
        return this.emergenciaService.insert(this.emergencia).pipe(map((data)=>{
          return data;
        }));
      //}
    })).subscribe(data=>{
      console.log(data);
      if(data.success){

      } else {

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

  cancelarEmergencia(){
    this.router.navigate(['inicio/emergencias']);
  }
}
