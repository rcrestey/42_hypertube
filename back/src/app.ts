import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import { createServer } from 'http';
import fileUpload from 'express-fileupload';
import { CronJob } from 'cron';
import findRemoveSync from 'find-remove';

import Routes from './routes';
import { FRONT_ENDPOINT } from './constants';
import { Database } from './database';
import { Cloud } from './cloud';
import passport from 'passport';
export * from './routes/authPassport';

export interface Context {
    db: Database;
    cloud: Cloud;
    user: null;
    isAuthenticated: boolean;
}

async function app() {
    const server = express();
    const httpServer = createServer(server);

    const db = new Database();
    const cloud = new Cloud();

    new CronJob(
        '0 6 * * *',
        await findRemoveSync('public/', { age: { seconds: 2629743 }, dir: '*' })
    ).start();

    server
        .use(
            cors({
                origin: ['http://localhost:3000', FRONT_ENDPOINT],
                credentials: true,
            })
        )
        .use(bodyParser.urlencoded({ extended: false }))
        .use(bodyParser.json())
        .use(fileUpload())
        .use(
            session({
                secret: 'test',
                resave: false,
                cookie: {
                    maxAge: 1e7,
                    httpOnly: true,
                    signed: true,
                },
                saveUninitialized: true,
            })
        )
        .use(passport.initialize())
        .use(passport.session())
        .use(async (req, res, next) => {
            // const user = await getUserByUuid({ db, uuid: req.session!.user });

            const context: Context = {
                db,
                cloud,
                isAuthenticated: req.session!.user !== null,
                user: null,
            };

            res.locals = context;

            next();
        });

    Routes(server);

    httpServer.listen(8080, '0.0.0.0', () => {
        console.log('listening on 8080 ports ');
    });
}

app().catch();
