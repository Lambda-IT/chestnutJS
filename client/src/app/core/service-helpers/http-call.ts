import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { jsonDecodeString } from 'decode-ts';
import * as either from 'fp-ts/lib/Either';
import Either = either.Either;
import * as t from 'io-ts';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { RemoteDataError } from '../remote-data';

type Params = { [param: string]: string | string[] } | null;

export const defaultHeaders = new HttpHeaders().append('Content-Type', 'application/json');

export function makeValidatedHttpGetCall<A, O>(
    http: HttpClient,
    url: string,
    type: t.Type<A, O>,
    withCredentials = false,
    params?: Params
): Observable<Either<RemoteDataError, A>> {
    return http
        .get(url, {
            responseType: 'text',
            withCredentials: withCredentials,
            params,
        })
        .pipe(handleHttpResponse(type));
}

export function makeValidatedHttpPostCall<A, O, B, P>(
    http: HttpClient,
    url: string,
    payloadType: t.Type<B, P>,
    body: any,
    responseType: t.Type<A, O>,
    headers: HttpHeaders = defaultHeaders,
    params?: any
): Observable<Either<RemoteDataError, A>> {
    const encodedBody = payloadType.encode(body);
    return payloadType.decode(encodedBody).fold(
        validationErrors =>
            of(either.left<RemoteDataError, A>(RemoteDataError.PayloadDecodeError({ validationErrors }))),
        () =>
            http
                .post(url, encodedBody, {
                    headers: headers,
                    responseType: 'text',
                    withCredentials: false,
                    params,
                })
                .pipe(handleHttpResponse(responseType))
    );
}

export function makeValidatedHttpDeleteCall<A, O, B, P>(
    http: HttpClient,
    url: string,
    payloadType: t.Type<B, P>,
    body: any,
    responseType: t.Type<A, O>,
    headers: HttpHeaders = defaultHeaders
): Observable<Either<RemoteDataError, A>> {
    const encodedBody = payloadType.encode(body);
    return payloadType.decode(encodedBody).fold(
        validationErrors =>
            of(either.left<RemoteDataError, A>(RemoteDataError.PayloadDecodeError({ validationErrors }))),
        () =>
            http
                .request('delete', url, {
                    headers: headers,
                    responseType: 'text',
                    body: encodedBody,
                    withCredentials: false,
                })
                .pipe(handleHttpResponse(responseType))
    );
}

export function handleHttpResponse<A, O>(type: t.Type<A, O>) {
    return (source: Observable<string>): Observable<Either<RemoteDataError, A>> =>
        source.pipe(
            map(
                (bodyText): Either<RemoteDataError, A> =>
                    jsonDecodeString<A, O>(type)(bodyText).mapLeft(decodeError =>
                        RemoteDataError.DecodeError({ decodeError })
                    )
            ),
            catchError((err: HttpErrorResponse) =>
                of(
                    either.left<RemoteDataError, A>(
                        RemoteDataError.APIErrorResponse({
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
}
