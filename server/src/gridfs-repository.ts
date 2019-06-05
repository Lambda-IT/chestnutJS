import * as _fs from 'fs';
import * as mongodb from 'mongodb';
import * as stream from 'stream';
import * as mime from 'mime-types';
import * as bluebirdPromise from 'bluebird';

import { ObjectID, GridFSBucket } from 'mongodb';
import { promisifyAll } from 'bluebird';
import uuid = require('uuid');
import { Store } from './store';

promisifyAll(stream);
const fs: any = promisifyAll(_fs);

export type GridFsStore = Store & { gridfs: GridFSBucket };

async function replaceFileAsync(
    filepath: string | Buffer,
    filename: string,
    store: GridFsStore,
    mimeType?: string
): Promise<string> {
    const found = await store.gridfs.find({ filename }).toArray();
    await bluebirdPromise.mapSeries(found, async (file: { _id: any }) => {
        await new Promise((resolve, reject) => store.gridfs.delete(file._id, err => (err ? reject(err) : resolve())));
    });

    const contentType = mimeType || mime.lookup(filename) || 'binary/octet-stream';
    const readstream = fs.createReadStream(filepath);
    const writestream = await store.gridfs.openUploadStream(filename, { contentType });
    const fileId = writestream.id;
    readstream.pipe(writestream);
    await readstream.onAsync('close');

    return fileId.toString();
}

async function insertFileAsync(
    file: string | Buffer,
    store: GridFsStore,
    mimeType: string | undefined,
    filename?: string
): Promise<string> {
    // remove file when already exists
    // const found = await _store.gridfs.existAsync({ filename: filename });
    // if (found) {
    //     await _store.gridfs.removeAsync({ filename: filename });
    // };

    let writestream: any;

    if (filename) {
        const contentType = mimeType || mime.lookup(filename) || 'binary/octet-stream';

        writestream = await store.gridfs.openUploadStream(filename, { contentType });
    } else {
        writestream = await store.gridfs.openUploadStream(`temp_${uuid.v4()}.tmp`, {
            contentType: 'binary/octet-stream',
        });
    }

    const fileId = writestream.id;

    if (typeof file === 'string') {
        const readstream = fs.createReadStream(file);
        readstream.pipe(writestream);
        await readstream.onAsync('close');
    } else {
        await new Promise((resolve, reject) => {
            writestream.on('error', (err: Error) => {
                reject(err);
            });
            writestream.on('finish', () => {
                setTimeout(resolve, 10);
            });
            writestream.end(file);
        });
    }

    return fileId.toString();
}

async function findMetadataAsync(fileId: string, store: GridFsStore): Promise<MetadataFile> {
    return await store.gridfs.find({ _id: new ObjectID(fileId) }).next();
}

async function getAllMetadataAsync(fileIds: string[], store: GridFsStore): Promise<MetadataFile[]> {
    return await store.gridfs.find({ _id: { $in: fileIds.map(x => new ObjectID(x)) } }).toArray();
}

async function getFilestreamAsync(fileId: ObjectID, store: GridFsStore): Promise<NodeJS.ReadableStream> {
    return store.gridfs.openDownloadStream(fileId);
}

async function deleteFileAsync(fileId: ObjectID, store: GridFsStore): Promise<any> {
    return new Promise((resolve, reject) => store.gridfs.delete(fileId, err => (err ? reject(err) : resolve())));
}

async function deleteFilesAsync(fileIds: string[], store: GridFsStore): Promise<any> {
    return bluebirdPromise.mapSeries(fileIds, (x: any) => deleteFileAsync(x, store));
}

export type MetadataFile = {
    filename: string;
    _id: ObjectID;
    length: number;
    chunkSize: number;
    uploadDate: Date;
    md5: string;
    contentType: string;
    aliases: string[];
    metadata: any;
};

export type FileRepository = {
    insertFileAsync: (filepath: string | Buffer, mimeType: string, filename?: string) => Promise<string>;
    replaceFileAsync: (filepath: string | Buffer, filename: string, mimeType?: string) => Promise<string>;
    findMetadataAsync: (fileId: string) => Promise<MetadataFile>;
    getAllMetadataAsync: (fileIds: string[]) => Promise<MetadataFile[]>;
    getFilestreamAsync: (fileId: ObjectID) => Promise<NodeJS.ReadableStream>;
    deleteFileAsync: (fileId: ObjectID) => Promise<void>;
    deleteFilesAsync: (fileIds: string[]) => Promise<void>;
};

export function createFileRepository(store: GridFsStore): FileRepository {
    store.gridfs = new GridFSBucket(store.connection.db);

    return {
        insertFileAsync: (filepath: string | Buffer, filename?: string, mimeType?: string) =>
            insertFileAsync(filepath, store, filename, mimeType),
        replaceFileAsync: (filepath: string | Buffer, filename: string, mimeType?: string): Promise<string> =>
            replaceFileAsync(filepath, filename, store, mimeType),
        findMetadataAsync: (fileId: string) => findMetadataAsync(fileId, store),
        getAllMetadataAsync: (fileIds: string[]) => getAllMetadataAsync(fileIds, store),
        getFilestreamAsync: (fileId: ObjectID) => getFilestreamAsync(fileId, store),
        deleteFileAsync: (fileId: ObjectID) => deleteFileAsync(fileId, store),
        deleteFilesAsync: (fileIds: string[]) => deleteFilesAsync(fileIds, store),
    };
}
