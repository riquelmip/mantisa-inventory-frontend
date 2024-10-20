export interface GetProductsGeneralResponse {
  isSuccess: boolean;
  status: string;
  message: string;
  data: GetProductsResponse[];
}

export interface GetProductsResponse {
  productId: number;
  code: string;
  name: string;
  description: null | string;
  productType: number;
  unit: Unit;
  stock: number;
  status: boolean;
}

export interface Unit {
  unitId: number;
  name: string;
}
