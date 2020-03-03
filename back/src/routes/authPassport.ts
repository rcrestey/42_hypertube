import passport from 'passport';
import { OAuth2Strategy as google } from 'passport-google-oauth';
import { Strategy as fortyTow } from 'passport-42';
import { Strategy as local } from 'passport-local';
import { uuid } from 'uuidv4';
import { verify } from 'argon2';

import { GOOGLE_CB, FORTYTOW_CB } from '../constants';
import { getUser } from './utils';
import { Database } from '../database';

export interface User {
    uuid: string;
    providerId: number;
    provider: string;
    username: string;
    email: string;
    givenName: string;
    familyName: string;
    photo: string;
    preferedLg: string;
    seenMovies: number[];
}

const db = new Database();

passport.serializeUser((user: User, done) => {
    done(null, user.uuid);
});

passport.deserializeUser(async (uuid: string, done) => {
    done(null, await getUser(uuid));
});

// LOCAL
passport.use(
    new local(async (username, password, done) => {
        try {
            const {
                rows: [user],
            } = await db.query(
                `SELECT uuid, password FROM users WHERE username = $1 AND users.state = 'ON'`,
                [username]
            );
            if (user !== undefined && (await verify(user.password, password))) {
                done(null, await getUser(user.uuid));
            } else return done(null, false);
        } catch (e) {
            return done({ type: 'Auth', details: 'Failed', e });
        }
    })
);

// GOOGLE
passport.use(
    new google(
        {
            clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID!,
            clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET!,
            callbackURL: GOOGLE_CB,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const {
                    sub: id,
                    name: username,
                    email,
                    picture: photo,
                    given_name: givenName,
                    family_name: familyName,
                } = profile._json;

                const uuid1 = uuid();
                const {
                    rows: [user],
                } = await db.query(
                    `SELECT * FROM oauth_register($1, $2, $3, $4, $5, $6, $7, $8)`,
                    [
                        uuid1,
                        id,
                        'GOOGLE',
                        username,
                        email,
                        givenName,
                        familyName === undefined ? '' : familyName,
                        photo,
                    ]
                );
                done(null, await getUser(user.uuid));
            } catch (e) {
                return done({ type: 'Auth', details: 'Failed', e });
            }
        }
    )
);

// 42
passport.use(
    new fortyTow(
        {
            clientID: process.env.PASSPORT_42_CLIENT_ID!,
            clientSecret: process.env.PASSPORT_42_CLIENT_SECRET!,
            callbackURL: FORTYTOW_CB,
        },
        async (
            accessToken: any,
            refreshToken: any,
            profile: any,
            done: any
        ) => {
            try {
                const {
                    id,
                    login: username,
                    email,
                    image_url: photo,
                    first_name: givenName,
                    last_name: familyName,
                } = profile._json;

                const uuid1 = uuid();
                const {
                    rows: [user],
                } = await db.query(
                    `SELECT * FROM oauth_register($1, $2, $3, $4, $5, $6, $7, $8)`,
                    [
                        uuid1,
                        id,
                        '42',
                        username,
                        email,
                        givenName,
                        familyName,
                        photo,
                    ]
                );
                done(null, await getUser(user.uuid));
            } catch (e) {
                return done({ type: 'Auth', details: 'Failed', e });
            }
        }
    )
);

export { passport };
