import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '@shared/services/app-config.service';
import { Observable, of } from 'rxjs';

export interface PasswordLoginDto {
    client_id: string;
    grant_type: 'password';
    password: string;
    username: string;
}

export interface RefreshTokenLoginDto {
    client_id: string;
    grant_type: 'refresh_token';
    refresh_token: string;
}

export interface TokenResultDto {
    token_type: string;
    access_token: string;
    expires_in: number;
    refresh_token: string;
}

export const userLogin = (http: HttpClient, appConfig: AppConfigService) => (data: PasswordLoginDto): Observable<TokenResultDto> =>
    http.post<TokenResultDto>(appConfig.buildIdentityUrl('/token'), data);

export const tokenLogin = (http: HttpClient, appConfig: AppConfigService) => (data: RefreshTokenLoginDto): Observable<TokenResultDto> =>
    http.post<TokenResultDto>(appConfig.buildIdentityUrl('/token'), data);

export const fakeLogin = (http: HttpClient, appConfig: AppConfigService) => (data: PasswordLoginDto): Observable<TokenResultDto> =>
    of({
        token_type: 'bearer',
        access_token:
            // tslint:disable-next-line:max-line-length
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiMGVmYTA0Ny00YzYzLTRiZWUtYmIzZS01NDdhY2RhNDVkMzEiLCJpc3MiOiJodHRwOi8vMTcyLjMwLjMxLjUyIiwic3ViIjoiNWE1MzMyNGQyMzE3Yzk2MmUyOWU3NWM3IiwiZXhwIjoxNTM2MDU4Njk3LCJpYXQiOjE1MzYwNTUwOTcsIm5hbWUiOiJyb2dlci5ydWRpbkBsYW1iZGEtaXQuY2giLCJyb2xlcyI6WyJGb3RvQmV0cmFjaHRlciIsIkZvdG9SZWRha3RvciIsIlZpZGVvUmVkYWt0b3IiLCJUaGVtZW53ZWx0UmVkYWt0b3IiLCJNYW5kYW50ZW5BZG1pbmlzdHJhdG9yIiwiU3lzdGVtQWRtaW5pc3RyYXRvciJdLCJtYW5kYW50IjoiemVtIn0.078T1m4FyVZxWZw0R1V3 - H9XmboDwR1Umi0zR0cLgLQ',
        expires_in: 3600,
        refresh_token: 'acbaa5e4c774bd209d46e1fd911addd06771554b',
    });

export const fakeTokenLogin = (http: HttpClient, appConfig: AppConfigService) => (data: RefreshTokenLoginDto): Observable<TokenResultDto> =>
    of({
        token_type: 'bearer',
        access_token:
            // tslint:disable-next-line:max-line-length
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiMGVmYTA0Ny00YzYzLTRiZWUtYmIzZS01NDdhY2RhNDVkMzEiLCJpc3MiOiJodHRwOi8vMTcyLjMwLjMxLjUyIiwic3ViIjoiNWE1MzMyNGQyMzE3Yzk2MmUyOWU3NWM3IiwiZXhwIjoxNTM2MDU4Njk3LCJpYXQiOjE1MzYwNTUwOTcsIm5hbWUiOiJyb2dlci5ydWRpbkBsYW1iZGEtaXQuY2giLCJyb2xlcyI6WyJGb3RvQmV0cmFjaHRlciIsIkZvdG9SZWRha3RvciIsIlZpZGVvUmVkYWt0b3IiLCJUaGVtZW53ZWx0UmVkYWt0b3IiLCJNYW5kYW50ZW5BZG1pbmlzdHJhdG9yIiwiU3lzdGVtQWRtaW5pc3RyYXRvciJdLCJtYW5kYW50IjoiemVtIn0.078T1m4FyVZxWZw0R1V3 - H9XmboDwR1Umi0zR0cLgLQ',
        expires_in: 3600,
        refresh_token: 'acbaa5e4c774bd209d46e1fd911addd06771554b',
    });
