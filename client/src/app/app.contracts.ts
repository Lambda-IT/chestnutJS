import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '@shared/services/app-config.service';
import { MetadataDto } from '../../../common/metadata';

export const loadCatalog = (http: HttpClient, appConfig: AppConfigService) =>
    http.get<MetadataDto>(
        appConfig.buildApiUrl(
            'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYTc0Y2VhMC01YTIwLTQzNDctODM1YS0zYjc2YTdhYWI3NDEiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjkwMDAiLCJzdWIiOiI1Yzg4YjhiMDhiZGIxNTBlMTM4M2QxNWQiLCJleHAiOjE1NTM1MTc1NjgsImlhdCI6MTU1MzUxMzk2OCwibmFtZSI6ImFkbWluQGxhbWJkYS1pdC5jaCIsInBlcm1pc3Npb25zIjoid3JpdGUifQ.dYjtf00LYfwPEVYzvCWdSIpBb43z5gfc2LlVGfTVJ1U'
        )
    );
