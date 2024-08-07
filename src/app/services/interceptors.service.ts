import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Clone the request to add the new header.
    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer YOUR_TOKEN_HERE`),
    });

    // Pass the cloned request instead of the original request to the next handle.
    return next.handle(clonedRequest);
  }
}
