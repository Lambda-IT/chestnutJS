export interface AuthConfiguration {
    issuer: string;
    secretKey: string;
    tokenExpiration: number;
    refreshTokenExpiration: number;
    maxFailedLoginAttempts: number;
    waitTimeToUnlockUser: number;
}
