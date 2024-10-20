import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../environments/environments';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GetProductsGeneralResponse } from '../interfaces/get-products.interface';
import { GetUnitsGeneralResponse } from '../interfaces/get-units.interface';
import { CreateProductGeneralResponse } from '../interfaces/create-product.interface';
import { DeleteProductGeneralResponse } from '../interfaces/delete-product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly baseUrl: string = environment.baseUrl;

  constructor() {}

  getProducts(): Observable<GetProductsGeneralResponse> {
    const url = `${this.baseUrl}/admin/products/get-all`;
    const token = localStorage.getItem('token') || '';

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return from(
      axios.post<GetProductsGeneralResponse>(url, {}, { headers })
    ).pipe(
      map((response) => response.data),
      catchError((error) => {
        return throwError(
          () => error.response?.data.message || 'Error desconocido'
        );
      })
    );
  }

  getUnits(): Observable<GetUnitsGeneralResponse> {
    const url = `${this.baseUrl}/admin/products/get-all-units`;
    const token = localStorage.getItem('token') || '';

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return from(axios.post<GetUnitsGeneralResponse>(url, {}, { headers })).pipe(
      map((response) => response.data),
      catchError((error) => {
        return throwError(
          () => error.response?.data.message || 'Error desconocido'
        );
      })
    );
  }

  createProduct(
    productId: number,
    description: string,
    name: string,
    productType: number,
    status: number,
    stock: number,
    fkUnitId: number
  ): Observable<CreateProductGeneralResponse> {
    const url = `${this.baseUrl}/admin/products/create`;
    const token = localStorage.getItem('token') || '';
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return from(
      axios.post(
        url,
        {
          productId: productId,
          description: description,
          name: name,
          productType: productType,
          status: status == 1 ? true : false,
          stock: stock,
          fkUnitId: fkUnitId,
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

  deleteProduct(id: number): Observable<DeleteProductGeneralResponse> {
    id = parseInt(id.toString(), 10);
    const url = `${this.baseUrl}/admin/products/delete`;
    const token = localStorage.getItem('token') || '';
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const formData = new FormData();
    formData.append('id', id.toString());

    return from(axios.post(url, formData, { headers })).pipe(
      map((response) => response.data),
      catchError((error) => {
        return throwError(
          () => error.response?.data.message || 'Error desconocido'
        );
      })
    );
  }

  getProduct(id: number): Observable<CreateProductGeneralResponse> {
    const url = `${this.baseUrl}/admin/products/get-by-id`;
    const token = localStorage.getItem('token') || '';
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const formData = new FormData();
    formData.append('id', id.toString());

    return from(axios.post(url, formData, { headers })).pipe(
      map((response) => response.data),
      catchError((error) => {
        return throwError(
          () => error.response?.data.message || 'Error desconocido'
        );
      })
    );
  }

  getAllByProductType(
    productType: number
  ): Observable<GetProductsGeneralResponse> {
    const url = `${this.baseUrl}/admin/products/get-all-by-type`;
    const token = localStorage.getItem('token') || '';
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const formData = new FormData();
    formData.append('type', productType.toString());

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
