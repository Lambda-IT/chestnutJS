import { Injectable } from '@angular/core';
import * as urljoin from 'url-join';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AppConfigService {
    public buildApiUrl(path: string, ...params: string[]): string {
        return urljoin(environment.apiBaseUrl, path, ...params);
    }
}
