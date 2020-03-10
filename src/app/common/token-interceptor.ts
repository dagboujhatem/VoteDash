import {Injectable, Injector} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {AuthorizationService} from './authorization.service';
import {Observable} from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public injector: Injector) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const  authenticationService = this.injector.get(AuthorizationService);
    request = request.clone({
      setHeaders: {
        Authorization: `${authenticationService.getAccesToken()}`
      }
    });
    return next.handle(request);
  }
}
