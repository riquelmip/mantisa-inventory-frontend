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

@Component({
  selector: 'app-production-orders',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './production-orders.component.html',
  styleUrl: './production-orders.component.css',
})
export class ProductionOrdersComponent {
  private sharedService = inject(SharedService);
  private productionOrderService = inject(ProductionOrderService);
  private productService = inject(ProductService);
  private loading = inject(NgxSpinnerService);
  private fb = inject(FormBuilder);

  public listProductionOrders: GetProductionsOrdersResponse[] = [];
  public listUnits: GetUnitsResponse[] = [];
  public listTerminateProducts: GetProductsResponse[] = [];
  public listMPProducts: GetProductsResponse[] = [];
  public listSelectMPProducts: OrderDetailDTO[] = [];
  public listProdLinesTypes: GetAllProductionsLineTypesResponse[] = [];

  public tableColumns: TableColumn[] = [
    { label: 'ID', def: 'productionOrderId', dataKey: 'productionOrderId' },
    { label: 'Num Order', def: 'orderNumber', dataKey: 'orderNumber' },
    { label: 'Cliente', def: 'customerName', dataKey: 'customerName' },
    {
      label: 'Fecha entrega',
      def: 'deliveryDate',
      dataKey: 'deliveryDate',
      dataType: 'date',
      formatt: 'dd MMM yyyy',
    },
    { label: 'Cantidad', def: 'quantity', dataKey: 'quantity' },
    {
      label: 'Producto solicitado',
      def: 'requestedProductName',
      dataKey: 'requestedProductName',
    },
    {
      label: 'Estado',
      def: 'status',
      dataKey: 'status',
      dataType: 'order-status',
    },

    { label: 'Opciones', def: 'actionsBtn', dataKey: 'actionsBtn' },
  ];
  public modalTitle: string = 'Crear Orden de Producción';
  public isEdit: boolean = false;

  productionOrderForm: FormGroup = this.fb.group({});
  public isModalOpen: boolean = false;
  public isConfirmModalOpen: boolean = false;
  public isReportModalOpen: boolean = false;

  ngOnInit(): void {
    this.initializeForm();
    this.getProductionOrders();
  }

  initializeForm(): void {
    this.productionOrderForm = this.fb.group({
      productionOrderId: [0, []],
      customer: ['', [Validators.required]],
      deliveryDate: ['', [Validators.required]],
      fkRequestedProductId: ['', [Validators.required]],
      quantity: ['', Validators.required],
    });
  }

  getProductionOrders(): void {
    this.loading.show();
    this.productionOrderService.getProductionsOrders().subscribe({
      next: (response: GetProductionsOrdersGeneralResponse) => {
        this.loading.hide();
        if (!response.isSuccess) {
          this.sharedService.errorAlert(response.message);
          return;
        }

        this.listProductionOrders = response.data;
      },
      error: (message: any) => {
        this.loading.hide();
        this.sharedService.errorAlert(message);
      },
    });
  }

  createOrder(): void {
    if (this.productionOrderForm.valid) {
      const formValues = this.productionOrderForm.value;
      const productionOrderId = formValues.productionOrderId;
      const customer = formValues.customer;
      const deliveryDate = formValues.deliveryDate;
      const fkRequestedProductId = formValues.fkRequestedProductId;
      const quantity = formValues.quantity;

      if (this.listSelectMPProducts.length === 0) {
        this.sharedService.errorAlert(
          'Por favor, seleccione al menos un producto.'
        );
        return;
      }

      if (quantity <= 0) {
        this.sharedService.errorAlert('La cantidad debe ser mayor a 0.');
        return;
      }

      const orderDetails: OrderDetail[] = this.listSelectMPProducts.map(
        (product) => {
          return {
            productId: product.productId,
            quantity: product.quantity,
          };
        }
      );

      this.loading.show();
      this.productionOrderService
        .createProductionOrder(
          customer,
          deliveryDate,
          fkRequestedProductId,
          quantity,
          orderDetails
        )
        .subscribe({
          next: (response: CreateProductionOrderGeneralResponse) => {
            this.loading.hide();
            if (!response.isSuccess) {
              this.sharedService.errorAlert(response.message);
              return;
            }

            this.sharedService.successAlert(response.message);
            this.getProductionOrders();
            this.closeModal();
          },
          error: (message: any) => {
            this.loading.hide();
            this.sharedService.errorAlert(message);
          },
        });
    } else {
      this.sharedService.errorAlert(
        'Por favor, complete los campos requeridos'
      );
    }
  }

  // Asignar a produccion
  handleThirdBtn(rowId: any): void {
    let id = parseInt(rowId);

    const order = this.listProductionOrders.find(
      (order) => order.productionOrderId === id
    );

    if (!order) {
      this.sharedService.errorAlert('Orden de producción no válida.');
      return;
    }

    if (order.status !== 0) {
      this.sharedService.errorAlert(
        'La orden de producción no se encuentra en estado pendiente.'
      );
      return;
    }

    const orderIdElement = document.getElementById(
      'productionOrderIdToSendProd'
    );
    if (orderIdElement) {
      (orderIdElement as HTMLInputElement).value =
        order.productionOrderId.toString();
    }

    console.log('order', (orderIdElement as HTMLInputElement).value);
    this.getProdLinesTypes();
    this.isConfirmModalOpen = true;
  }

  getTerminateProducts(): void {
    this.loading.show();
    this.productService.getAllByProductType(1).subscribe({
      next: (response: GetProductsGeneralResponse) => {
        this.loading.hide();
        if (!response.isSuccess) {
          this.sharedService.errorAlert(response.message);
          return;
        }

        this.listTerminateProducts = response.data;
      },
      error: (message: any) => {
        this.loading.hide();
        this.sharedService.errorAlert(message);
      },
    });
  }

  getMPProducts(): void {
    this.loading.show();
    this.productService.getAllByProductType(2).subscribe({
      next: (response: GetProductsGeneralResponse) => {
        this.loading.hide();
        if (!response.isSuccess) {
          this.sharedService.errorAlert(response.message);
          return;
        }

        this.listMPProducts = response.data;
      },
      error: (message: any) => {
        this.loading.hide();
        this.sharedService.errorAlert(message);
      },
    });
  }

  getProdLinesTypes(): void {
    this.loading.show();
    this.productionOrderService.getProductionLinesTypes().subscribe({
      next: (response: GetAllProductionsLineTypesGeneralResponse) => {
        this.loading.hide();
        if (!response.isSuccess) {
          this.sharedService.errorAlert(response.message);
          return;
        }

        this.listProdLinesTypes = response.data;
      },
      error: (message: any) => {
        this.loading.hide();
        this.sharedService.errorAlert(message);
      },
    });
  }

  // --- METODOS DE MODAL --- //
  openModal(): void {
    this.modalTitle = 'Crear Orden de Producción';
    this.isEdit = false;
    this.getTerminateProducts();
    this.getMPProducts();
    this.isModalOpen = true;
    this.productionOrderForm.reset();
    this.productionOrderForm.markAsPristine();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.productionOrderForm.reset();
    this.productionOrderForm.markAsPristine();
  }

  closeConfirmModal(): void {
    this.isConfirmModalOpen = false;
  }

  // --- METODOS DE VALIDACION --- //
  isValidField(field: string): boolean | null {
    return this.sharedService.isValidField(this.productionOrderForm, field);
  }

  getFieldError(field: string): string | null {
    return this.sharedService.getFieldError(this.productionOrderForm, field);
  }

  addMPProduct(): void {
    const selectedMPElement = document.getElementById('selectedMP');
    const selectedProductId = selectedMPElement
      ? (selectedMPElement as HTMLInputElement).value
      : null;
    const selectedProduct = this.listMPProducts.find(
      (product) => product.productId === Number(selectedProductId)
    );

    const quantityElement = document.getElementById('quantityMP');
    const quantity = quantityElement
      ? (quantityElement as HTMLInputElement).value
      : null;
    const quantityNum = quantity ? Number(quantity) : 0;

    if (quantityNum === 0 || quantityNum < 0) {
      this.sharedService.errorAlert('Por favor, ingrese una cantidad.');
      return;
    }
    if (selectedProduct) {
      let orderDetailDTO: OrderDetailDTO = {
        productId: selectedProduct.productId,
        productName: selectedProduct.name,
        quantity: Number(quantity),
      };
      this.listSelectMPProducts.push(orderDetailDTO);
    } else {
      this.sharedService.errorAlert('Producto seleccionado no es válido.');
    }
  }

  removeMPProduct(product: OrderDetailDTO): void {
    this.listSelectMPProducts = this.listSelectMPProducts.filter(
      (p) => p.productId !== product.productId
    );
  }

  submitProductionOrder(): void {
    const productionLineTypeElement = document.getElementById(
      'productionLineTypeId'
    );
    let productionLineTypeId = productionLineTypeElement
      ? (productionLineTypeElement as HTMLInputElement).value
      : null;

    if (productionLineTypeId === null || productionLineTypeId === '') {
      this.sharedService.errorAlert(
        'Por favor, seleccione una linea de producción.'
      );
      return;
    }

    let id = parseInt(productionLineTypeId);

    const orderId = document.getElementById('productionOrderIdToSendProd');
    const orderIdValue = orderId ? (orderId as HTMLInputElement).value : null;
    const orderIdNum = orderIdValue ? Number(orderIdValue) : 0;

    if (orderIdNum === 0) {
      this.sharedService.errorAlert('Orden de producción no válida.');
      return;
    }

    this.loading.show();

    this.productionOrderService
      .assignProductionOrdersToProd(orderIdNum, id)
      .subscribe({
        next: (response: AssignProductionsOrdersToProdGeneralResponse) => {
          this.loading.hide();
          if (!response.isSuccess) {
            this.sharedService.errorAlert(response.message);
            return;
          }
          this.sharedService.successAlert(response.message);
          this.getProductionOrders();
          productionLineTypeId = '';
          this.closeConfirmModal();
        },
        error: (message: any) => {
          this.loading.hide();
          this.sharedService.errorAlert(message);
        },
      });
  }

  openReportModal(): void {
    this.isReportModalOpen = true;
  }

  closeReportModal(): void {
    this.isReportModalOpen = false;
  }

  generateReport(): void {
    const statusElement = document.getElementById(
      'statusOrderReport'
    ) as HTMLSelectElement;
    const status = statusElement.value ? parseInt(statusElement.value) : 0;

    if (status == undefined || status == -1) {
      this.sharedService.errorAlert('Seleccione un tipo de reporte');
      return;
    }

    const deliveryDateElement = document.getElementById(
      'reportDeliveryDate'
    ) as HTMLInputElement;
    const deliveryDate = deliveryDateElement.value;

    if (deliveryDate == undefined || deliveryDate == '') {
      this.sharedService.errorAlert('Seleccione una fecha de entrega');
      return;
    }

    console.log('deliveryDate', deliveryDate);

    this.loading.show();
    this.productionOrderService
      .generatePdfReport(status, deliveryDate)
      .subscribe({
        next: (response: any) => {
          this.loading.hide();
          this.closeReportModal();
          this.sharedService.successAlert('Reporte generado correctamente');
        },
        error: (message: any) => {
          this.loading.hide();
          this.sharedService.errorAlert(message);
        },
      });
  }
}
