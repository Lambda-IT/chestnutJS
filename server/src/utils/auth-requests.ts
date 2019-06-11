export interface PasswordTokenRequest {
    username: string;
    password: string;
    client_id: string;
    grant_type: 'password';
}

export interface RefreshTokenRequest {
    refresh_token: string;
    grant_type: 'refresh_token';
    client_id: string;
}
