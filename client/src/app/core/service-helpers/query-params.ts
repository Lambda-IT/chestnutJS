import * as array from 'fp-ts/lib/Array';
import { Option } from 'fp-ts/lib/Option';

export const createQueryParams = (params: Option<string>[]) => {
    const queryParams = array.catOptions(params).join('&');
    return !!queryParams ? `?${queryParams}` : '';
};

export const createQueryParamsWithReferrer = (referrer: Option<string>, params: Option<string>[] = []) =>
    createQueryParams([...params, referrer.map(r => `referrer=${encodeURIComponent(r)}`)]);
