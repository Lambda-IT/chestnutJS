import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { Injector, Injectable } from '@angular/core';
import { LoginService } from 'app/login/services/login-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private injector: Injector) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const loginService = this.injector.get(LoginService);
        const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token') || '{}') : {};
        return next.handle(setBearerTokenHeader(req, token)).pipe(
            catchError((err: any) => {
                if (err instanceof HttpErrorResponse) {
                    const refreshToken = JSON.parse(localStorage.getItem('token') || '{}').refresh_token;
                    if (err.status === 401 && !!token) {
                        return loginService
                            .tokenLogin(refreshToken)
                            .pipe(mergeMap(x => (x.isRight ? next.handle(setBearerTokenHeader(req, x.value)) : null)));
                    }
                    throw err;
                }
            })
        );
    }
}

export const setBearerTokenHeader = (req: HttpRequest<any>, token: any) => {
    return req.clone({
        headers: req.headers.set('Authorization', 'bearer ' + (token ? token.access_token : '')),
    });
};
