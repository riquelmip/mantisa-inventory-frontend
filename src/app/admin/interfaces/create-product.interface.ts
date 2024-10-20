export interface CreateProductGeneralResponse {
  isSuccess: boolean;
  status: string;
  message: string;
  data: CreateProductResponse;
}

export interface CreateProductResponse {
  productId: number;
  code: string;
  name: string;
  description: null;
  productType: number;
  unit: UnitCreateProductResponse;
  stock: number;
  status: boolean;
}

export interface UnitCreateProductResponse {
  unitId: number;
  name: string;
}
