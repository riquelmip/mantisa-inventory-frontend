import { Component, inject } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';
import { AuthStatus } from '../../../auth/interfaces/auth-status.enum';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private sharedService = inject(SharedService);
  private loading = inject(NgxSpinnerService);
  private authService = inject(AuthService);

  checkStatusAuth(): boolean {
    //console.log(this.authService.authStatus());
    return this.authService.authStatus() === AuthStatus.authenticated;
  }

  logout() {
    this.authService.logoutAndRedirect();
    this.sharedService.successAlert('Se ha deslogueado correctamente');
  }
}
