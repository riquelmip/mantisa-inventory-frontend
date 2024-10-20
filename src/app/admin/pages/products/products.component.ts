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

import {
  GetProductsGeneralResponse,
  GetProductsResponse,
} from '../../interfaces/get-products.interface';
import { ProductService } from '../../services/product.service';
import {
  GetUnitsGeneralResponse,
  GetUnitsResponse,
} from '../../interfaces/get-units.interface';
import { CreateProductGeneralResponse } from '../../interfaces/create-product.interface';
import { DeleteProductGeneralResponse } from '../../interfaces/delete-product.interface';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  private sharedService = inject(SharedService);
  private productService = inject(ProductService);
  private loading = inject(NgxSpinnerService);
  private fb = inject(FormBuilder);

  public listProducts: GetProductsResponse[] = [];
  public listUnits: GetUnitsResponse[] = [];

  public tableColumns: TableColumn[] = [
    { label: 'ID', def: 'productId', dataKey: 'productId' },
    { label: 'Codigo', def: 'code', dataKey: 'code' },
    { label: 'Nombre', def: 'name', dataKey: 'name' },
    { label: 'Descripcion', def: 'description', dataKey: 'description' },
    { label: 'Stock', def: 'stock', dataKey: 'stock' },
    {
      label: 'Estado',
      def: 'status',
      dataKey: 'status',
      dataType: 'status',
      formatt: 'Activo/Inactivo',
    },

    { label: 'Opciones', def: 'actionsBtn', dataKey: 'actionsBtn' },
  ];
  public modalTitle: string = 'Crear Producto';
  public isEdit: boolean = false;

  productsForm: FormGroup = this.fb.group({});
  public isModalOpen: boolean = false;

  ngOnInit(): void {
    this.initializeForm();
    this.getProducts();
  }

  initializeForm(): void {
    this.productsForm = this.fb.group({
      productId: [0, []],
      description: ['', []],
      name: ['', [Validators.required]],
      productType: ['', [Validators.required]],
      status: ['', Validators.required],
      stock: ['', Validators.required],
      fkUnitId: ['', Validators.required],
    });
  }

  getProducts(): void {
    this.loading.show();
    this.productService.getProducts().subscribe({
      next: (response: GetProductsGeneralResponse) => {
        this.loading.hide();
        if (!response.isSuccess) {
          this.sharedService.errorAlert(response.message);
          return;
        }

        this.listProducts = response.data;
      },
      error: (message: any) => {
        this.loading.hide();
        this.sharedService.errorAlert(message);
      },
    });
  }

  createProduct(): void {
    if (this.productsForm.valid) {
      const formValues = this.productsForm.value;
      const productId = formValues.productId;
      const description = formValues.description;
      const name = formValues.name;
      const productType = formValues.productType;
      const status = formValues.status;
      const stock = formValues.stock;
      const fkUnitId = formValues.fkUnitId;

      this.loading.show();
      this.productService
        .createProduct(
          productId,
          description,
          name,
          productType,
          status,
          stock,
          fkUnitId
        )
        .subscribe({
          next: (response: CreateProductGeneralResponse) => {
            this.loading.hide();
            if (!response.isSuccess) {
              this.sharedService.errorAlert(response.message);
              return;
            }

            this.sharedService.successAlert(response.message);
            this.getProducts();
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

  deleteProduct(rowId: any): void {
    let id = parseInt(rowId);

    // mostrar alerta sweetalert para confirmar eliminación
    this.sharedService.confirmAlert(
      '¿Está seguro de que desea eliminar este producto?',
      'Si',
      'No',
      () => {
        this.loading.show();
        this.productService.deleteProduct(id).subscribe({
          next: (response: DeleteProductGeneralResponse) => {
            this.loading.hide();
            if (!response.isSuccess) {
              this.sharedService.errorAlert(response.message);
              return;
            }
            this.sharedService.successAlert(response.message);
            this.getProducts();
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

  getUnits(): void {
    this.loading.show();
    this.productService.getUnits().subscribe({
      next: (response: GetUnitsGeneralResponse) => {
        this.loading.hide();
        if (!response.isSuccess) {
          this.sharedService.errorAlert(response.message);
          return;
        }

        this.listUnits = response.data;
      },
      error: (message: any) => {
        this.loading.hide();
        this.sharedService.errorAlert(message);
      },
    });
  }

  // --- METODOS DE MODAL --- //
  openModal(): void {
    this.modalTitle = 'Crear Producto';
    this.isEdit = false;
    this.getUnits();
    this.isModalOpen = true;
    this.productsForm.reset();
    this.productsForm.markAsPristine();
  }

  openEditModal(rowId: any): void {
    this.modalTitle = 'Editar Producto';
    this.isEdit = true;
    this.getUnits();
    let id = parseInt(rowId);

    if (id != 0) {
      this.loading.show();
      this.productService.getProduct(id).subscribe({
        next: (user) => {
          this.loading.hide();
          if (!user.isSuccess) {
            this.sharedService.errorAlert(user.message);
            return;
          }

          this.productsForm.patchValue({
            productId: user.data.productId,
            description: user.data.description,
            name: user.data.name,
            productType: user.data.productType,
            status: user.data.status ? 1 : 0,
            stock: user.data.stock,
            fkUnitId: user.data.unit.unitId,
          });

          this.isModalOpen = true;
        },
        error: (message) => {
          this.loading.hide();
          this.sharedService.errorAlert(message);
        },
      });
    } else {
      this.sharedService.errorAlert('ID no válido');
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.productsForm.reset();
    this.productsForm.markAsPristine();
  }

  // --- METODOS DE VALIDACION --- //
  isValidField(field: string): boolean | null {
    return this.sharedService.isValidField(this.productsForm, field);
  }

  getFieldError(field: string): string | null {
    return this.sharedService.getFieldError(this.productsForm, field);
  }
}
