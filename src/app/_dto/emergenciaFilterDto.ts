export class EmergenciaFilterDto {
    year: number;
    phenomenonType: {
        id: number
    };
    emergencyStatus: {
        id: number
    };
    startDate: string;
    endDate: string;
    ods: {
        id: number
    };
    providerType: {
        id: number
    };
    district: {
        id: number,
        province: {
            id: number,
            department: {
                id: number
            }
        }
    };
    paginator: {
        offset: number,
        sort: string,
        order: string,
        limit: number
    }
}