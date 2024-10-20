import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductionOrdersComponent } from './pages/production-orders/production-orders.component';
import { ProductionLinesComponent } from './pages/production-lines/production-lines.component';

const routes: Routes = [
  {
    path: 'home',
    component: DashboardComponent,
  },
  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'prodution-orders',
    component: ProductionOrdersComponent,
  },
  {
    path: 'prodution-lines',
    component: ProductionLinesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
