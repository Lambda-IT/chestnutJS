import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export class AuthInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token') || '{}') : {};
        return next.handle(setBearerTokenHeader(req, token));
    }
}

export const setBearerTokenHeader = (req: HttpRequest<any>, token: any) => {
    return req.clone({
        headers: req.headers.set('Authorization', 'bearer ' + (token ? token.access_token : '')),
    });
};
