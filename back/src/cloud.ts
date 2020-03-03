import { Client } from 'minio';

export class Cloud extends Client {
    constructor() {
        const {
            CLOUD_HOST,
            CLOUD_PORT,
            MINIO_ACCESS_KEY,
            MINIO_SECRET_KEY,
        } = process.env;

        super({
            endPoint: String(CLOUD_HOST),
            port: Number(CLOUD_PORT),
            useSSL: false,
            accessKey: String(MINIO_ACCESS_KEY),
            secretKey: String(MINIO_SECRET_KEY),
        });
    }
}
