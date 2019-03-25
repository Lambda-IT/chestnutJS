import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '@shared/services/app-config.service';
import { MetadataDto } from '../../../common/metadata';

export const loadCatalog = (http: HttpClient, appConfig: AppConfigService) =>
    http.get<MetadataDto>(appConfig.buildApiUrl('/metadata'));
