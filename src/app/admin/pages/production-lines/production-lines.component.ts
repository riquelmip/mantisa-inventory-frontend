import { Component, inject } from '@angular/core';
import { SharedService } from '../../../shared/services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TableColumn } from '../../../shared/interfaces';
import { SharedModule } from '../../../shared/shared.module';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { GetUnitsResponse } from '../../interfaces/get-units.interface';
import { ProductionOrderService } from '../../services/production-order.service';
import {
  GetProductionsOrdersGeneralResponse,
  GetProductionsOrdersResponse,
  OrderDetail,
} from '../../interfaces/get-productions-orders.interface';
import { CreateProductionOrderGeneralResponse } from '../../interfaces/create-production-order.interface';
import { ProductService } from '../../services/product.service';
import {
  GetProductsGeneralResponse,
  GetProductsResponse,
} from '../../interfaces/get-products.interface';
import { OrderDetailDTO } from '../../interfaces/order-detail-dto.interface';
import { AssignProductionsOrdersToProdGeneralResponse } from '../../interfaces/assign-production-orders-to-prod.interface';
import {
  GetAllProductionsLineTypesGeneralResponse,
  GetAllProductionsLineTypesResponse,
} from '../../interfaces/get-all-prod-lines-types.interface';
import {
  GetAllProductionsLineGeneralResponse,
  GetAllProductionsLineResponse,
} from '../../interfaces/get-all-production-lines.interface';
import { FinishLineGeneralResponse } from '../../interfaces/finish-line.interface';

@Component({
  selector: 'app-production-lines',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './production-lines.component.html',
  styleUrl: './production-lines.component.css',
})
export class ProductionLinesComponent {
  private sharedService = inject(SharedService);
  private productionOrderService = inject(ProductionOrderService);
  private loading = inject(NgxSpinnerService);
  private fb = inject(FormBuilder);

  public listProductionLines: GetAllProductionsLineResponse[] = [];

  public tableColumns: TableColumn[] = [
    { label: 'ID', def: 'productionLineId', dataKey: 'productionLineId' },
    {
      label: 'Linea',
      def: 'productionLineType',
      dataKey: 'productionLineType.name',
      dataType: 'object',
    },
    {
      label: 'Orden',
      def: 'productionOrder',
      dataKey: 'productionOrder.productionOrderId',
      dataType: 'object',
    },
    {
      label: 'Producto solicitado',
      def: 'productionOrder',
      dataKey: 'productionOrder.requestedProduct.name',
      dataType: 'object',
    },
    {
      label: 'Cantidad',
      def: 'productionOrder',
      dataKey: 'productionOrder.quantity',
      dataType: 'object',
    },
    {
      label: 'Fecha de inicio',
      def: 'startDate',
      dataKey: 'startDate',
      dataType: 'date',
      formatt: 'dd MMM yyyy',
    },
    {
      label: 'Fecha de fin',
      def: 'endDate',
      dataKey: 'endDate',
      dataType: 'date',
      formatt: 'dd MMM yyyy',
    },
    {
      label: 'Estado',
      def: 'status',
      dataKey: 'status',
      dataType: 'line-status',
    },

    { label: 'Opciones', def: 'actionsBtn', dataKey: 'actionsBtn' },
  ];
  public modalTitle: string = 'Crear Orden de Producción';
  public isEdit: boolean = false;

  productionOrderForm: FormGroup = this.fb.group({});
  public isModalOpen: boolean = false;
  public isConfirmModalOpen: boolean = false;

  ngOnInit(): void {
    this.getProductionLines();
  }

  getProductionLines(): void {
    this.loading.show();
    this.productionOrderService.getProductionLines().subscribe({
      next: (response: GetAllProductionsLineGeneralResponse) => {
        this.loading.hide();
        if (!response.isSuccess) {
          this.sharedService.errorAlert(response.message);
          return;
        }

        this.listProductionLines = response.data;
      },
      error: (message: any) => {
        this.loading.hide();
        this.sharedService.errorAlert(message);
      },
    });
  }

  // Asignar a produccion
  handleThirdBtn(rowId: any): void {
    let id = parseInt(rowId);

    const productionLine = this.listProductionLines.find(
      (x) => x.productionLineId === id
    );

    if (productionLine === undefined || productionLine === null) {
      this.sharedService.errorAlert('No se encontró la línea de producción');
      return;
    }

    if (productionLine.status == 0 || productionLine.status == 2) {
      // No esta en produccion o ya finalizo
      this.sharedService.errorAlert(
        'La línea de producción no se encuentra en producción'
      );
      return;
    }

    this.sharedService.confirmAlert(
      '¿Desea finalizar la producción?',
      'Si',
      'No',
      () => {
        this.loading.show();
        this.productionOrderService.finishProductionLine(id).subscribe({
          next: (response: FinishLineGeneralResponse) => {
            this.loading.hide();
            if (!response.isSuccess) {
              this.sharedService.errorAlert(response.message);
              return;
            }
            this.sharedService.successAlert(response.message);
            this.getProductionLines();
          },
          error: (message: any) => {
            this.loading.hide();
            this.sharedService.errorAlert(message);
          },
        });
      },
      () => {}
    );
  }
}
