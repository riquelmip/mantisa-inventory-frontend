export interface GetProductionsOrdersGeneralResponse {
  isSuccess: boolean;
  status: string;
  message: string;
  data: GetProductionsOrdersResponse[];
}

export interface GetProductionsOrdersResponse {
  productionOrderId: number;
  orderNumber: number;
  customerName: string;
  deliveryDate: Date;
  quantity: number;
  fkRequestedProductId: number;
  requestedProductName: string;
  status: number;
  orderDetails: OrderDetail[];
}

export interface OrderDetail {
  productId: number;
  quantity: number;
}
