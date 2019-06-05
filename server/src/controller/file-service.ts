import { Express, Request, Response } from 'express';
import { Store } from '../store';
import { HttpStatusCode } from '../utils/http-util';
import { createFileRepository } from '../gridfs-repository';
import { ObjectID } from 'bson';

export function createFileUploadController(app: Express, store: Store, baseUrl: string) {
    const fileRepository = createFileRepository({ connection: store.connection } as any);

    app.post(baseUrl + '/file', (req: Request, res: Response) => {
        res.header('Access-Control-Allow-Origin', '*');

        const fileName = req.headers['file-name'];
        const mimeType = req.headers['mime-type'];

        if (!fileName || !mimeType) {
            return res.send(HttpStatusCode.BadRequest).end();
        }

        const chunks = [];
        req.on('data', chunk => {
            chunks.push(chunk);
        });

        req.on('end', () => {
            const data = Buffer.concat(chunks);

            fileRepository
                .insertFileAsync(data, mimeType.toString(), fileName.toString())
                .then(x => {
                    res.send({ fileId: x });
                })
                .catch(error => res.send(error));
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
            .catch(error => res.send(error));
    });

    app.get(baseUrl + '/file/*', async (req: Request, res: Response) => {
        res.header('Access-Control-Allow-Origin', '*');

        if (req.params.length > 1) {
            return res.send(HttpStatusCode.BadRequest).end();
        }

        const objectID: ObjectID = new ObjectID(req.params[0]);

        const filestream = await fileRepository.getFilestreamAsync(objectID);

        const imageData = await streamToBufferAsync(filestream);
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
