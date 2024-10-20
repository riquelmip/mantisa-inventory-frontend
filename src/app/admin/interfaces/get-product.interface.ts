import { Unit } from './get-products.interface';

export interface GetProductGeneralResponse {
  isSuccess: boolean;
  status: string;
  message: string;
  data: GetProductResponse;
}

export interface GetProductResponse {
  productId: number;
  code: string;
  name: string;
  description: string;
  productType: number;
  unit: Unit;
  stock: number;
  status: boolean;
}
