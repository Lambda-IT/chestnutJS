import { Either, left, right } from 'fp-ts/lib/Either';
import { ErrorType } from '@shared/bind-functions/error-types';
import { of, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

export const bindRemoteCall = <T>(f: () => Observable<T>): Observable<Either<ErrorType, T>> =>
    f().pipe(
        map(x => right<ErrorType, T>(x)),
        catchError((err: HttpErrorResponse) =>
            of(
                left<ErrorType, T>(
                    ErrorType.APIErrorResponse({
                        apiErrorResponse: {
                            status: err.status,
                            statusText: err.statusText,
                            error: err.error,
                        },
                    })
                )
            )
        )
    );
