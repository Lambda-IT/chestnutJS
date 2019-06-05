import { Injectable } from '@angular/core';
import { Either } from 'fp-ts/lib/Either';
import { Observable } from 'rxjs';
import { RemoteDataError } from '@core/remote-data';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import {
    makeValidatedHttpDeleteCall,
    makeValidatedHttpGetCall,
    makeValidatedHttpPostCall,
} from '@core/service-helpers';
import { AppConfigService } from '@shared/services/app-config.service';
import * as t from 'io-ts';
import { LoadFileResponse, SaveFileResponse } from '../types';

@Injectable()
export class ModelService {
    constructor(private httpClient: HttpClient, private appConfig: AppConfigService) {}

    saveFileToDb(file: File): Observable<Either<RemoteDataError, SaveFileResponse>> {
        const headers = new HttpHeaders()
            .append('Content-Type', 'multipart/form-data')
            .append('File-Name', file.name)
            .append('Mime-Type', file.type);

        return makeValidatedHttpPostCall(
            this.httpClient,
            this.appConfig.buildApiUrl('/file'),
            t.unknown,
            file,
            SaveFileResponse,
            headers,
            { reportProgress: true }
        );
    }
    deleteFileFromDb(fileId: string): Observable<Either<RemoteDataError, null>> {
        const headers = new HttpHeaders().append('Content-Type', 'multipart/form-data');
        return makeValidatedHttpDeleteCall(
            this.httpClient,
            this.appConfig.buildApiUrl('/file', fileId),
            t.unknown,
            null,
            null,
            headers
        );
    }
}
