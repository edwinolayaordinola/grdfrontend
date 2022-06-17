
import { ComponentDto } from '../_dto/componentDto';
import { DatasEmergenciasDto } from '../_dto/datasEmergenciaDto';
import { DistricDto } from '../_dto/districtDto';
import { DocumentDto } from '../_dto/documentDto';
import { ImagesDto } from '../_dto/imagesDto';
import { Componente } from './componente';

export class Emergencia {

    id : number;
    provider : {
        name : string;
        id:number;
        providerType:{
            id: number;
        }
    };
    date : string;
    dataSource: string;
    locales : string[];
    facts : string;
    affectedArea : string;
    actionsTaken : string;
    descriptionSupport: string;
    requestRequirements : string;
    descriptionPhenomenon : string;
    geometry:{
        type : string,
        coordinates : {},
        srid: number
    };
    phenomenonType : {
        id : number
    };
    spatialReference : {
        id : number
    };
    serviceAffectation : {
        id : number
    };
    emergencyStatus: {
        id : number
    };
    datas: DatasEmergenciasDto[];
    documents: DocumentDto[];
    images : ImagesDto[];
    districts : DistricDto[];
    components : ComponentDto[];
}