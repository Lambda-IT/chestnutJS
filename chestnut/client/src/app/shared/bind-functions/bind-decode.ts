import { jsonDecodeString } from 'decode-ts';
import { Either, left } from 'fp-ts/lib/Either';
import { ErrorType } from '@shared/bind-functions/error-types';
import * as t from 'io-ts';


export const bindDecode = <A, O>(type: t.Type<A, O>, f: jsonDecodeString) => (either: Either<ErrorType, string>) =>
    either.fold(left, r => f(type)(r).mapLeft(err => ErrorType.DecodeError({ decodeError: err })));
