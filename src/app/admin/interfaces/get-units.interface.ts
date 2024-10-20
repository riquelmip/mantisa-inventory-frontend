export interface GetUnitsGeneralResponse {
  isSuccess: boolean;
  status: string;
  message: string;
  data: GetUnitsResponse[];
}

export interface GetUnitsResponse {
  unitId: number;
  name: string;
}
