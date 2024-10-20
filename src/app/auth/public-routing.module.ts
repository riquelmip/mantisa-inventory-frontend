import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResetPaswordComponent } from './pages/reset-pasword/reset-pasword.component';
import { ForgotPaswordComponent } from './pages/forgot-pasword/forgot-pasword.component';

const routes: Routes = [
  {
    path: 'reset-password',
    component: ResetPaswordComponent,
  },
  { path: 'forgot-password', component: ForgotPaswordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}
