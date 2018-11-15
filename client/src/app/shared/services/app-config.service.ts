import { Injectable } from '@angular/core';
import * as urljoin from 'url-join';

@Injectable({
    providedIn: 'root',
})
export class AppConfigService {
    public buildApiUrl(path: string, ...params: string[]): string {
        return urljoin(window['__apiBaseUrl'], path, ...params);
    }

    public buildIdentityUrl(path: string, ...params: string[]): string {
        return urljoin(window['__identityBaseUrl'], path, ...params);
    }
}
