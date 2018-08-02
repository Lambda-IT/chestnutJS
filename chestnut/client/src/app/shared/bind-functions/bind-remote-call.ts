import { Either, left, right } from 'fp-ts/lib/Either';
import { ErrorType } from '@shared/bind-functions/error-types';
import { of, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

export const bindRemoteCall = (f: () => Observable<string>): Observable<Either<ErrorType, string>> =>
    f().pipe(
        map(x => right<ErrorType, string>(x)),
        catchError((err: HttpErrorResponse) =>
            of(
                left<ErrorType, string>(
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
