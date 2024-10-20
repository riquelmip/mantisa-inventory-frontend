import { Unit } from './get-products.interface';

export interface FinishLineGeneralResponse {
  isSuccess: boolean;
  status: string;
  message: string;
  data: FinishLineResponse;
}

export interface FinishLineResponse {
  productionOrderId: number;
  orderNumber: number;
  customerName: string;
  deliveryDate: Date;
  quantity: number;
  requestedProduct: RequestedProductFinishLineResponse;
  status: number;
  orderDetails: any[];
}

export interface RequestedProductFinishLineResponse {
  productId: number;
  code: string;
  name: string;
  description: string;
  productType: number;
  unit: Unit;
  stock: number;
  status: boolean;
}
