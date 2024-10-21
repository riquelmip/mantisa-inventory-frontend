import { computed, inject, Injectable, signal } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, from, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginGeneralResponse } from '../interfaces/login.interface';
import { AuthStatus } from '../interfaces/auth-status.enum';
import { ValidateTokenGeneralResponse } from '../interfaces/validate-token.interface';
import { ForgotPasswordGeneralResponse } from '../interfaces/forgot-password.interface';
import { ResetPasswordGeneralResponse } from '../interfaces/reset-password.interface';
import { Router } from '@angular/router';
import { GetUserGeneralResponse } from '../interfaces/get-user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl: string = environment.baseUrl;
  private _currentUser = signal<String | null>(null); //Usando signals para tener el usuario logueado
  private _authStatus = signal<AuthStatus>(AuthStatus.checking); //Usando signals para conocer el estado de la autenticación

  public currentUser = computed(() => this._currentUser()); //Señal computada, para que no se pueda cambiar
  public authStatus = computed(() => this._authStatus());

  private router = inject(Router);
  constructor() {
    this.checkAuthStatus().subscribe(); //Cada vez que se inicie el servicio tiene que verificar el estado
  }

  private roleSubject = new BehaviorSubject<string>(
    this.getRolFromLocalStorage()
  );

  get role$() {
    return this.roleSubject.asObservable();
  }

  setRole(role: string): void {
    localStorage.setItem('rol', role);
    this.roleSubject.next(role); // Emitir el nuevo rol
  }

  getRolFromLocalStorage(): string {
    return localStorage.getItem('rol') || '';
  }

  login(username: string, password: string): Observable<LoginGeneralResponse> {
    const url = `${this.baseUrl}/auth/login`;

    const body = {
      username,
      password,
    };

    return from(axios.post<LoginGeneralResponse>(url, body)).pipe(
      map((response) => response.data),
      catchError((error) => {
        return throwError(
          () => error.response?.data.message || 'Error desconocido'
        );
      })
    );
  }

  getUser(username: string, token: string): Observable<GetUserGeneralResponse> {
    const url = `${this.baseUrl}/admin/users/get-by-username`;

    // mandar el usuario por form data
    const body = new FormData();
    body.append('username', username);

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return from(
      axios.post<GetUserGeneralResponse>(url, body, { headers })
    ).pipe(
      map((response) => response.data),
      catchError((error) => {
        return throwError(
          () => error.response?.data.message || 'Error desconocido'
        );
      })
    );
  }

  forgotPassword(email: string): Observable<ForgotPasswordGeneralResponse> {
    const url = `${this.baseUrl}/auth/password-recovery`;

    return from(
      axios.post<ForgotPasswordGeneralResponse>(url, {
        email: email,
      })
    ).pipe(
      map((response) => response.data),
      catchError((error) => {
        return throwError(
          () => error.response?.data.message || 'Error desconocido'
        );
      })
    );
  }

  resetPassword(
    token: string,
    password: string
  ): Observable<ResetPasswordGeneralResponse> {
    const url = `${this.baseUrl}/auth/reset-password`;

    return from(
      axios.post<ResetPasswordGeneralResponse>(url, {
        token: token,
        new_password: password,
      })
    ).pipe(
      map((response) => response.data),
      catchError((error) => {
        return throwError(
          () => error.response?.data.message || 'Error desconocido'
        );
      })
    );
  }

  setAuthentication(user: string, token: string): boolean {
    //console.log('_authStatus ');
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);

    return true;
  }
  checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/validate-token`;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    const formData = new URLSearchParams();
    formData.append('token', token);

    return from(
      axios.post<ValidateTokenGeneralResponse>(url, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
    ).pipe(
      map((response) => {
        this.setAuthentication(
          response.data.data.username,
          response.data.data.jwt
        );
        return true; // Autenticación exitosa
      }),
      catchError((error) => {
        this.logout(); // Si hay error, cerrar sesión
        return of(false);
      })
    );
  }

  logout(): boolean {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
    return true;
  }

  logoutAndRedirect(): void {
    this.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
