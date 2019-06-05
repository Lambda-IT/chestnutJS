import * as array from 'fp-ts/lib/Array';
import { Predicate } from 'fp-ts/lib/function';

export const updateOrAppend = <A>(as: A[], a: A, predicate: Predicate<A>): A[] =>
    array
        .findIndex(as, predicate)
        .map(i => array.unsafeUpdateAt(i, a, as))
        .getOrElse([...as, a]);
