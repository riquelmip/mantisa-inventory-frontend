import { Component, inject } from '@angular/core';
import { SharedService } from '../../../shared/services/shared.service';
import { AuthService } from '../../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  LoginGeneralResponse,
  LoginResponse,
} from '../../interfaces/login.interface';
import { SharedModule } from '../../../shared/shared.module';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private sharedService = inject(SharedService);
  private authService = inject(AuthService);
  private loading = inject(NgxSpinnerService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  showSearchParams: boolean = false;
  private readonly lastRouteKey: string = environment.last_route;

  loginForm: FormGroup = this.fb.group({});

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      const formValues = this.loginForm.value;
      const username = formValues.username;
      const password = formValues.password;

      // Llamar al método authenticated para hacer la petición al backend
      this.authenticated(username, password);
    } else {
      this.sharedService.errorAlert(
        'Por favor, complete los campos requeridos'
      );
    }
  }

  authenticated(username: string, password: string): void {
    this.loading.show();
    this.authService.login(username, password).subscribe({
      next: (response: LoginGeneralResponse) => {
        this.loading.hide();
        if (!response.isSuccess) {
          this.sharedService.errorAlert(response.message);
          return;
        }

        const loginResponse: LoginResponse = response.data;
        this.authService.setAuthentication(
          loginResponse.username,
          loginResponse.jwt
        );
        // Eliminar el last_route del localStorage
        localStorage.removeItem(this.lastRouteKey);
        // Redirigir a la página de inicio
        this.router.navigateByUrl('/admin/home');
        this.loading.hide();
      },
      error: (message: any) => {
        this.loading.hide();
        this.sharedService.errorAlert(message);
      },
    });
  }
}
