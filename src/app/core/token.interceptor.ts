import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { CommonServicesService } from '../services/common-services.service';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
  constructor(public common: CommonServicesService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes('user/varify/')) {
      return next.handle(request);
    }
    if (request.url.includes('token/refresh/')) {
      return next.handle(request);
    }
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.common.getToken()}`
      }
    });
    return next.handle(request);
  }
}
