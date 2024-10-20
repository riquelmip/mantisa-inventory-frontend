import { Unit } from './get-products.interface';

export interface AssignProductionsOrdersToProdGeneralResponse {
  isSuccess: boolean;
  status: string;
  message: string;
  data: AssignProductionsOrdersToProdResponse;
}

export interface AssignProductionsOrdersToProdResponse {
  productionOrderId: number;
  orderNumber: number;
  customerName: string;
  deliveryDate: Date;
  quantity: number;
  requestedProduct: RequestedProductAssignProductionsOrdersToProdResponse;
  status: number;
  orderDetails: any[];
}

export interface RequestedProductAssignProductionsOrdersToProdResponse {
  productId: number;
  code: string;
  name: string;
  description: string;
  productType: number;
  unit: Unit;
  stock: number;
  status: boolean;
}
