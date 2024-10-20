import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../environments/environments';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GetProductsGeneralResponse } from '../interfaces/get-products.interface';
import { GetUnitsGeneralResponse } from '../interfaces/get-units.interface';
import { CreateProductGeneralResponse } from '../interfaces/create-product.interface';
import { DeleteProductGeneralResponse } from '../interfaces/delete-product.interface';
import {
  GetProductionsOrdersGeneralResponse,
  OrderDetail,
} from '../interfaces/get-productions-orders.interface';
import { CreateProductionOrderGeneralResponse } from '../interfaces/create-production-order.interface';
import { AssignProductionsOrdersToProdGeneralResponse } from '../interfaces/assign-production-orders-to-prod.interface';
import { GetAllProductionsLineTypesGeneralResponse } from '../interfaces/get-all-prod-lines-types.interface';
import { GetAllProductionsLineGeneralResponse } from '../interfaces/get-all-production-lines.interface';
import { FinishLineGeneralResponse } from '../interfaces/finish-line.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductionOrderService {
  private readonly baseUrl: string = environment.baseUrl;

  constructor() {}

  getProductionsOrders(): Observable<GetProductionsOrdersGeneralResponse> {
    const url = `${this.baseUrl}/admin/production-orders/get-all`;
    const token = localStorage.getItem('token') || '';

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return from(
      axios.post<GetProductionsOrdersGeneralResponse>(url, {}, { headers })
    ).pipe(
      map((response) => response.data),
      catchError((error) => {
        return throwError(
          () => error.response?.data.message || 'Error desconocido'
        );
      })
    );
  }

  createProductionOrder(
    customer: string,
    deliveryDate: string,
    fkRequestedProductId: number,
    quantity: number,
    orderDetails: OrderDetail[]
  ): Observable<CreateProductionOrderGeneralResponse> {
    const url = `${this.baseUrl}/admin/production-orders/create`;
    const token = localStorage.getItem('token') || '';
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return from(
      axios.post(
        url,
        {
          customer,
          deliveryDate,
          fkRequestedProductId,
          quantity,
          orderDetails,
        },
        { headers }
      )
    ).pipe(
      map((response) => response.data),
      catchError((error) => {
        return throwError(
          () => error.response?.data.message || 'Error desconocido'
        );
      })
    );
  }

  assignProductionOrdersToProd(
    productionOrderId: number,
    productionLineTypeId: number
  ): Observable<AssignProductionsOrdersToProdGeneralResponse> {
    const url = `${this.baseUrl}/admin/production-orders/assign-to-production-line
    `;
    const token = localStorage.getItem('token') || '';
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return from(
      axios.post(
        url,
        {
          idOrder: productionOrderId,
          fkProductionLineTypeId: productionLineTypeId,
        },
        { headers }
      )
    ).pipe(
      map((response) => response.data),
      catchError((error) => {
        return throwError(
          () => error.response?.data.message || 'Error desconocido'
        );
      })
    );
  }

  getProductionLinesTypes(): Observable<GetAllProductionsLineTypesGeneralResponse> {
    const url = `${this.baseUrl}/admin/production-orders/get-all-productions-lines-types`;
    const token = localStorage.getItem('token') || '';

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return from(
      axios.post<GetAllProductionsLineTypesGeneralResponse>(
        url,
        {},
        { headers }
      )
    ).pipe(
      map((response) => response.data),
      catchError((error) => {
        return throwError(
          () => error.response?.data.message || 'Error desconocido'
        );
      })
    );
  }

  getProductionLines(): Observable<GetAllProductionsLineGeneralResponse> {
    const url = `${this.baseUrl}/admin/production-orders/get-all-production-lines`;
    const token = localStorage.getItem('token') || '';

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return from(
      axios.post<GetAllProductionsLineGeneralResponse>(url, {}, { headers })
    ).pipe(
      map((response) => response.data),
      catchError((error) => {
        return throwError(
          () => error.response?.data.message || 'Error desconocido'
        );
      })
    );
  }

  finishProductionLine(
    productionLineId: number
  ): Observable<FinishLineGeneralResponse> {
    const url = `${this.baseUrl}/admin/production-orders/finish-production`;
    const token = localStorage.getItem('token') || '';

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const formData = new FormData();
    formData.append('productionLineId', productionLineId.toString());

    return from(axios.post(url, formData, { headers })).pipe(
      map((response) => response.data),
      catchError((error) => {
        return throwError(
          () => error.response?.data.message || 'Error desconocido'
        );
      })
    );
  }
}
