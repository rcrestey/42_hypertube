import { Express } from 'express';

import AuthRoutes from './auth';
import UserRoutes from './user';
import HomeRoutes from './home';
import MovieRoutes from './movie';

export default function Routes(server: Express) {
    server
        .use('/auth', AuthRoutes())
        .use('/user', UserRoutes())
        .use('/home', HomeRoutes())
        .use('/movie', MovieRoutes());
}
