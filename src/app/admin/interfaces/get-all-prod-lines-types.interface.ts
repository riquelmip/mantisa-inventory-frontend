export interface GetAllProductionsLineTypesGeneralResponse {
  isSuccess: boolean;
  status: string;
  message: string;
  data: GetAllProductionsLineTypesResponse[];
}

export interface GetAllProductionsLineTypesResponse {
  productLineTypeId: number;
  name: string;
}
