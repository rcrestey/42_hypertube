import { Pool } from 'pg';

export class Database extends Pool {
    constructor() {
        const {
            DATABASE_USER,
            DATABASE_HOST,
            DATABASE_NAME,
            DATABASE_PASSWORD,
            DATABASE_PORT,
        } = process.env;

        super({
            user: DATABASE_USER!,
            host: DATABASE_HOST!,
            database: DATABASE_NAME!,
            password: DATABASE_PASSWORD!,
            port: Number(DATABASE_PORT),
        });
    }
}
