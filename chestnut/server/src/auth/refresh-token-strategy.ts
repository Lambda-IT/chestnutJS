import * as crypto from 'crypto';
import * as express from 'express';
import * as http from 'http';
import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { BasicStrategy } from 'passport-http';
import { Strategy as ClientPasswordStrategy } from 'passport-oauth2-client-password';
import { Strategy as BearerStrategy } from 'passport-http-bearer';

import { validateUserAsync } from './user-service';
import { Store } from '../store';
import { AuthUser, AuthClient, AuthToken, TokenType } from './models';

export function createRefreshTokenStrategy(store: Store, app: express.Express) {
    passport.use(
        new LocalStrategy((username, password, done) => {
            validateUserAsync(username, password, store)
                .then(done)
                .catch(done);
        }),
    );

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
        store.models.authUser.findById(id, done);
    });

    function verifyClient(clientId, clientSecret, done) {
        store.models.authClient.findOne({ clientId: clientId }, (error, client) => {
            if (error) return done(error);
            if (!client) return done(null, false);
            if (client.clientSecret !== clientSecret) return done(null, false);
            return done(null, client);
        });
    }

    passport.use(new BasicStrategy(verifyClient));

    passport.use(new ClientPasswordStrategy(verifyClient));

    passport.use(
        new BearerStrategy((accessToken, done) => {
            store.models.accessTokens.findOne({ token: accessToken, type: TokenType.access }, (error, token) => {
                if (error) return done(error);
                if (!token) return done(null, false);
                if (token.userId) {
                    store.models.accessUser.findById(token.userId, (error, user) => {
                        if (error) return done(error);
                        if (!user) return done(null, false);
                        done(null, user, { scope: '*' });
                    });
                } else {
                    store.models.authClient.findOne({ clientId: token.clientId }, (error, client) => {
                        if (error) return done(error);
                        if (!client) return done(null, false);
                        done(null, client, { scope: '*' });
                    });
                }
            });
        }),
    );
}
