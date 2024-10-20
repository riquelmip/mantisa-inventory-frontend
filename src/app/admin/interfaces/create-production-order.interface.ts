import { Unit } from './get-products.interface';

export interface CreateProductionOrderGeneralResponse {
  isSuccess: boolean;
  status: string;
  message: string;
  data: CreateProductionOrderResponse;
}

export interface CreateProductionOrderResponse {
  productId: number;
  orderNumber: number;
  customerName: string;
  deliveryDate: Date;
  quantity: number;
  requestedProduct: RequestedProduct;
  status: number;
  orderDetails: null;
}

export interface RequestedProduct {
  productId: number;
  code: string;
  name: string;
  description: string;
  productType: number;
  unit: Unit;
  stock: number;
  status: boolean;
}
