import { bootstrap }                                  from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS }                             from '@angular/http';
import { disableDeprecatedForms, provideForms }       from '@angular/forms';

import { AppComponent }                               from './app.component';
import { appRouterProviders }                         from './app.routes';
import { httpInterceptorAuthenticateServiceProvider } from './http-interceptor-authenticate.service';

bootstrap(AppComponent, [
  disableDeprecatedForms(),
  provideForms(),
  appRouterProviders,
  HTTP_PROVIDERS,
  httpInterceptorAuthenticateServiceProvider('api/auth/SignIn')
])
.catch(err => console.error(err));
