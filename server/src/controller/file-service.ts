import { Express, Request, Response } from 'express';
import { ObjectID } from 'bson';
import * as sharp from 'sharp';

import { Store } from '../store';
import { HttpStatusCode } from '../utils/http-util';
import { createFileRepository } from '../gridfs-repository';

export function createFileUploadController(app: Express, store: Store, baseUrl: string) {
    const fileRepository = createFileRepository({ connection: store.connection } as any);

    const imageCache = {};

    app.post(baseUrl + '/file', (req: Request, res: Response) => {
        res.header('Access-Control-Allow-Origin', '*');

        const fileName = req.headers['file-name'];
        const mimeType = req.headers['mime-type'];

        if (!fileName || !mimeType) {
            return res.send(HttpStatusCode.BadRequest).end();
        }

        const chunks = [];
        req.on('data', (chunk) => {
            chunks.push(chunk);
        });

        req.on('end', () => {
            const data = Buffer.concat(chunks);

            fileRepository
                .insertFileAsync(data, mimeType.toString(), fileName.toString())
                .then((x) => {
                    res.send({ fileId: x });
                })
                .catch((error) => res.send(error));
        });
    });

    app.delete(baseUrl + '/file/*', (req: Request, res: Response) => {
        res.header('Access-Control-Allow-Origin', '*');

        if (req.params.length > 1) {
            return res.send(HttpStatusCode.BadRequest).end();
        }

        const objectID: ObjectID = new ObjectID(req.params[0]);

        fileRepository
            .deleteFileAsync(objectID)
            .then(() => res.send(HttpStatusCode.OK))
            .catch((error) => res.send(error));
    });

    app.get(baseUrl + '/file/*', async (req: Request, res: Response) => {
        res.header('Access-Control-Allow-Origin', '*');

        if (req.params.length > 1) {
            return res.send(HttpStatusCode.BadRequest).end();
        }

        const objectID: ObjectID = new ObjectID(req.params[0]);

        const accept = req.headers.accept;
        const acceptWebp = accept && accept.indexOf('image/webp') !== -1;

        const width = +req.query.width;
        const lossless = req.query.lossless ? req.query.lossless.toLowerCase() === 'true' : true;
        const imageName = `${acceptWebp}_${objectID}_${width || '0'}`;

        if (imageCache[imageName]) {
            if (acceptWebp) res.contentType('image/webp');
            return res.send(imageCache[imageName]);
        }

        if (width || acceptWebp) {
            const filestreamReadable = await fileRepository.getFilestreamAsync(objectID);
            let sharpImgTransformer = sharp();
            if (width) sharpImgTransformer = sharp().resize(width);
            if (acceptWebp) {
                res.contentType('image/webp');
                sharpImgTransformer = sharpImgTransformer.webp({
                    lossless,
                    quality: 90,
                    smartSubsample: true,
                });

                sharpImgTransformer.on('info', function (info) {
                    console.log('Image height is ' + info.height);
                });
            }

            const bufs: any[] = [];
            sharpImgTransformer.on('data', (d: any) => {
                console.log('data', bufs.length);
                bufs.push(d);
            });

            sharpImgTransformer.on('end', () => {
                imageCache[imageName] = Buffer.concat(bufs);
                return res.end();
            });

            return filestreamReadable.pipe(sharpImgTransformer).pipe(res);
        }

        const filestream = await fileRepository.getFilestreamAsync(objectID);
        let imageData = await streamToBufferAsync(filestream);
        res.send(imageData);
    });
}

export async function streamToBufferAsync(readableStream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise<any>((resolve, reject) => {
        const bufs: any[] = [];
        readableStream.on('data', (d: any) => {
            bufs.push(d);
        });
        readableStream.on('end', () => {
            const result = Buffer.concat(bufs);
            resolve(result);
        });
        readableStream.on('error', reject);
    });
}
