import { CLOUD_ENDPOINT, PROFILE_PICTURES_BUCKET } from '../constants';
import { Database } from '../database';
import fetch from 'node-fetch';
import * as path from 'path';
import pump from 'pump';
import rangeParser from 'range-parser';
import ffmpeg from 'fluent-ffmpeg';
import request from 'request';
import mkdirp from 'mkdirp';
import extract from 'extract-zip';
import streamZip from 'node-stream-zip';
import fs from 'fs';
import srt2vtt from 'srt-to-vtt';

export function publicSrc(photo: string, photoKind: string) {
    if (photoKind === 'EXTERN') return photo;
    else return `${CLOUD_ENDPOINT}/${PROFILE_PICTURES_BUCKET}/${photo}`;
}

export async function getUser(uuid: string) {
    try {
        const db = new Database();

        const {
            rows: [result],
        } = await db.query(`SELECT * FROM get_user_by_uuid($1)`, [uuid]);
        const user = {
            ...result,
            photo: publicSrc(result.photo, result.photoKind),
        };
        return user;
    } catch (e) {
        return null;
    }
}

export async function getExternalUser(uuid: string) {
    try {
        const db = new Database();

        const {
            rows: [result],
        } = await db.query(`SELECT * FROM get_user_by_uuid($1)`, [uuid]);
        const user = {
            username: result.username,
            givenName: result.givenName,
            familyname: result.familyName,
            photo: publicSrc(result.photo, result.photoKind),
            seenMovies: result.seenMovies,
        };
        return user;
    } catch (e) {
        return null;
    }
}

export async function getHash(id: string) {
    const result = await fetch(
        `https://yts.mx/api/v2/movie_details.json?movie_id=${id}`
    )
        .then(res => res.json())
        .then(res => res);
    if (result === null || result.data.movie.torrents[0].hash === undefined) {
        return null;
    }
    return {
        hash: result.data.movie.torrents[0].hash,
        url: result.data.movie.slug,
        lang: result.data.movie.language,
    };
}

// VIDEO
export const getTorrentStream = (engine: any) => {
    return new Promise((resolve, _reject) => {
        engine.on('ready', () => {
            engine.files.forEach((file: any) => {
                const type = path.extname(file.name).slice(1);
                if (type === 'mkv' || type === 'mp4' || type === 'webm') {
                    file.type = type;
                    resolve(file);
                }
            });
        });
    });
};

export const beginStream = (file: any, req: any, res: any) => {
    res.setHeader('Content-Length', file.length);
    res.setHeader('Content-Type', `video/${file.type}`);
    const ranges: any = rangeParser(file.length, req.headers.range, {
        combine: true,
    });
    if (ranges === -1) {
        res.statusCode = 416;
        return res.end();
    } else {
        res.statusCode = 206;
        res.setHeader('Content-Length', 1 + ranges[0].end - ranges[0].start);
        res.setHeader(
            'Content-Range',
            `bytes ${ranges[0].start}-${ranges[0].end}/${file.length}`
        );
        let flux = file.createReadStream(ranges[0]);
        // debug
        let progressBar: number = 0;
        flux.on('data', (chunk: any) => {
            progressBar += chunk.length;
            // console.log(
            //     file.name +
            //         ': ' +
            //         Math.round((100 * progressBar) / file.length) +
            //         ' % '
            // );
        });
        return pump(flux, res);
    }
};

export const convertStream = (file: any, res: any) => {
    if (file.type !== 'mkv') {
        return;
    }
    let flux = file.createReadStream();
    /* Uncomment to see downloading logs */

    let progressBar: number = 0;
    flux.on('data', (chunk: any) => {
        progressBar += chunk.length;
        // console.log(
        //     file.name +
        //         ': ' +
        //         Math.round((100 * progressBar) / file.length) +
        //         ' % '
        // );
    });
    const convertedFlux: any = ffmpeg(flux)
        .on('error', (err: any) => console.log(null))
        .audioBitrate(128)
        .audioCodec('libvorbis')
        .format('webm')
        .outputOptions([
            '-cpu-used 3',
            '-threads 4',
            '-deadline realtime',
            '-error-resilient 1',
        ])
        .videoBitrate(1024)
        .videoCodec('libvpx');

    res.writeHead(200, {
        'Cache-Control': 'no-cache, no-store',
        'Content-Length': file.length,
        'Content-Type': 'video/webm',
    });

    return pump(convertedFlux, res);
};

// SUBS

// follow the docs
export const downloadSub = (url: any, imdbId: string) => {
    return new Promise(async function(resolve, reject) {
        mkdirp('./tmp/', (e: any) => {
            if (e) return reject(e);

            request(url)
                .pipe(fs.createWriteStream(`./tmp/${imdbId}.zip`))
                .on('close', function() {
                    resolve(`./tmp/${imdbId}.zip`);
                });
        });
    });
};

export const extSub = (zip: any) => {
    return new Promise((resolve, reject) => {
        extract(zip, { dir: __dirname + '/../../tmp' }, (err: any) => {
            if (err) return reject(err);
            const zipStream: any = new streamZip({
                file: zip,
                storeEntries: true,
            });

            zipStream.on('ready', () => {
                const file: any = Object.values(zipStream.entries());
                if (path.extname(file[0].name).substr(1) !== 'srt') {
                    reject(new Error('SUBTITLE_ERROR'));
                }
                zipStream.close();
                resolve(file[0].name);
            });
        });
    });
};

export const convSub = (srt: any, imdbId: string, lang: string) => {
    return new Promise((resolve, reject) => {
        const srtPath = __dirname + '/../../tmp/' + srt;
        fs.access(srtPath, fs.constants.F_OK, err => {
            if (err) {
                return reject(new Error('SUBTITLES_ERROR'));
            }
            const writestream = fs.createWriteStream(
                __dirname + '/../../tmp/' + imdbId + '-' + lang + '.vtt'
            );
            fs.createReadStream(srtPath)
                .pipe(srt2vtt())
                .pipe(writestream);
            writestream.on('finish', () => {
                resolve();
            });
        });
    });
};

export const getSubtitles = (
    imdbId: string,
    language: string,
    singleSub: boolean
) => {
    return new Promise(async (resolve, reject) => {
        const response: any = {
            en: '',
        };
        const path = __dirname + `/../../tmp/${imdbId}-en.vtt`;
        const languagePath = __dirname + `/../../tmp/${imdbId}-${language}.vtt`;
        fs.access(path, fs.constants.F_OK, err => {
            if (err) return reject(new Error('PATH_ERROR'));
            else {
                fs.readFile(path, 'utf8', (err, data) => {
                    if (err) return reject(err);
                    const base64data = Buffer.from(data);
                    response.en = base64data.toString('base64');
                    if (language === 'en') {
                        resolve(response);
                    }
                    if (singleSub === false) {
                        fs.access(languagePath, fs.constants.F_OK, err => {
                            if (err) return reject(new Error('PATH_ERROR'));
                            else {
                                fs.readFile(
                                    languagePath,
                                    'utf8',
                                    (err, data) => {
                                        if (err) return reject(err);
                                        const base64data = Buffer.from(data);
                                        if (language === 'FR') {
                                            response[
                                                'fr'
                                            ] = base64data.toString('base64');
                                        } else if (language === 'ES') {
                                            response[
                                                'es'
                                            ] = base64data.toString('base64');
                                        }
                                        resolve(response);
                                    }
                                );
                            }
                        });
                    } else {
                        resolve(response);
                    }
                });
            }
        });
    });
};
