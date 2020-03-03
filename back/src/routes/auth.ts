import { Router } from 'express';
import passport from 'passport';
import { FRONT_ENDPOINT } from '../constants';

export const authCheck = (req: any, res: any, next: any) => {
    if (req.user === undefined) {
        res.status(403);
        res.json({ status: 'FORBIDDEN' });
    } else {
        next();
    }
};

export default function AuthRoutes(): Router {
    const router = Router();

    // LOCAL STRAT
    router.post('/login', passport.authenticate('local'), (req, res) => {
        res.send(req.user);
    });

    // GOOGLE STRAT
    router.get(
        '/google',
        passport.authenticate('google', { scope: ['email', 'profile'] })
    );

    router.get('/google/cb', passport.authenticate('google'), (req, res) => {
        res.redirect(FRONT_ENDPOINT);
    });

    // 42 STRAT
    router.get('/42', passport.authenticate('42'));

    router.get('/42/cb', passport.authenticate('42'), (req, res) => {
        res.redirect(FRONT_ENDPOINT);
    });

    // LOGOUT
    router.get('/logout', (req, res) => {
        req.logout();
        res.sendStatus(403);
    });
    return router;
}
