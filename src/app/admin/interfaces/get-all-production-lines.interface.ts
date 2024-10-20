import { Unit } from './get-products.interface';

export interface GetAllProductionsLineGeneralResponse {
  isSuccess: boolean;
  status: string;
  message: string;
  data: GetAllProductionsLineResponse[];
}

export interface GetAllProductionsLineResponse {
  productionLineId: number;
  productionLineType: ProductionLineTypeGetAllProductionsLineResponse;
  productionOrder: ProductionOrderGetAllProductionsLineResponse;
  status: number;
  startDate: Date;
  endDate: null;
}

export interface ProductionLineTypeGetAllProductionsLineResponse {
  productLineTypeId: number;
  name: string;
}

export interface ProductionOrderGetAllProductionsLineResponse {
  productionOrderId: number;
  orderNumber: number;
  customerName: string;
  deliveryDate: Date;
  quantity: number;
  requestedProduct: RequestedProductGetAllProductionsLineResponse;
  status: number;
  orderDetails: any[];
}

export interface RequestedProductGetAllProductionsLineResponse {
  productId: number;
  code: string;
  name: string;
  description: string;
  productType: number;
  unit: Unit;
  stock: number;
  status: boolean;
}
