import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/services/auth.service';
import { AuthStatus } from './auth/interfaces/auth-status.enum';
import { LastRouteService } from './shared/services/last-route.service';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'mantisa-inventory-frontend';

  //INYECCIONES
  private authService = inject(AuthService);
  private router = inject(Router);
  private lastRouteService = inject(LastRouteService);

  //SIGNAL COMPUTADA PARA VERIFICAR AUTH
  public finishedAuthCheck = computed<boolean>(() => {
    //console.log(this.authService.authStatus());
    if (this.authService.authStatus() === AuthStatus.checking) {
      return false;
    }

    return true;
  });

  constructor() {}

  // EFECTO DISPARADO CUANDO ALGUNA SEÑAL CAMBIE EN AUTHSTATUS
  public authStatusChangedEffect = effect(() => {
    console.log('authStatusChangedEffect:', this.authService.authStatus());

    switch (this.authService.authStatus()) {
      case AuthStatus.checking:
        return;

      case AuthStatus.authenticated:
        console.log('User authenticated');
        const lastRoute = this.lastRouteService.getLastRoute();
        if (lastRoute) {
          this.router.navigateByUrl(lastRoute);
        }
        return;

      case AuthStatus.notAuthenticated:
        //VERIFICO SI EN LA RUTA A LA QUE QUIERO DIRIGIRME ES PUBLICA, Y SI NO LO ES, QUE LO DIRIJA AL LOGIN
        this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
            const currentUrl = event.url;
            // Verificar si la URL contiene la palabra 'public'
            if (currentUrl.includes('public')) {
              // Si la URL contiene 'public', no realizar verificación de autenticación
              return;
            } else {
              this.router.navigateByUrl('/auth/login');
            }
          }
        });

        return;
    }
  });
}
