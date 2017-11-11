import * as moment from 'moment';
import { Model } from 'mongoose';
import { Store } from '../store';
import { verifyUser } from './password-service';
import { AuthUser, AuthClient, AuthToken } from './models';

const waitTimeToUnlockUser = 5;
const maxFailedLoginAttempts = 5;

export function validateUserAsync(email: string, password: string, store: Store) {
    return store.models.authUser.findOne({ email: email }).then((user: AuthUser & { _id: string }) => {
        if (!user) {
            throw Error('Username invalid.');
        }

        try {
            const result = verifyUser(password, user);

            if (user.locked) {
                if (
                    user.lastLoginAttempt >
                    moment
                        .utc()
                        .subtract({ minutes: waitTimeToUnlockUser })
                        .toDate()
                ) {
                    throw Error('User locked');
                }
            }
            user.locked = false;
            user.failedLoginAttemps = 0;
            user.lastLoginAttempt = moment.utc().toDate();

            return store.models.authUser.update({ _id: user._id }, user).then(() => user);
        } catch (e) {
            user.failedLoginAttemps = !!user.failedLoginAttemps ? user.failedLoginAttemps + 1 : 1;
            user.lastLoginAttempt = moment.utc().toDate();
            user.locked = user.failedLoginAttemps >= maxFailedLoginAttempts;
            return store.models.authUser.update({ _id: user._id }, user).then(() => {
                throw Error('Login failed');
            });
        }
    });
}
