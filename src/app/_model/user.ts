
import { Profile } from './profile';

export class User {

    id: number;
    active : boolean;
    names : string;
    password:string;
    modules : Profile[];
    userName : string;
    surNames : string;
    inLdap : boolean;
    mail : string;
    positionName : string;
    areaName : string;
}