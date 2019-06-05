import { fromPredicate } from 'fp-ts/lib/Option';

export const fromNaNNumber = (n: number) => fromPredicate<number>(a => !isNaN(a))(n);
