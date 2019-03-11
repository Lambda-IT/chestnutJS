// libs
import { Promise as bluebird } from 'bluebird';
import { transform } from 'lodash/fp';
import * as mongoose from 'mongoose';
import * as kebabCase from 'kebab-case';
import { HttpStatusCode } from '../../../common/http-status-code';
import { ErrorType } from '../error-type';
import { Request, Response, NextFunction } from 'express';
import { Log } from '../../typings/log';

/**
 * Parses comma separated string field names into mongodb projection object.
 */
export function parseFields(rawFields: string | any): any {
    if (!rawFields) return {};

    return rawFields
        .split(',')
        .map((cur: string) => String(cur).trim())
        .reduce((acc: Array<any>, cur: any) => {
            acc[cur] = 1;

            return acc;
        }, {});
}

const parseQueryValue = (queryValue: string) => {
    queryValue = decodeURIComponent(queryValue).trim();

    if (queryValue.toLowerCase() === 'null')
        // tslint:disable-next-line
        return null;
    if (queryValue.toLowerCase() === 'undefined') return undefined;
    if (queryValue.toLowerCase() === 'true') return true;
    else if (queryValue.toLowerCase() === 'false') return false;
    else if (queryValue === '0') return 0;
    else if (Number(queryValue) !== 0 && !isNaN(Number(queryValue))) return Number(queryValue);
    else return { $regex: queryValue, $options: 'i' };
};

/**
 * Parses the query string into mongodb criteria object.
 */
export function parseQuery(rawQuery: string | any): any {
    const res = {};

    if (!rawQuery) return res;

    rawQuery.split(',').forEach((segment: string) => {
        if (!segment) return {};

        const parts = segment.match(/([^,]+):([^,]+|)?/);

        if (!(parts && parts.length > 0)) return {};

        const path = parts[1].match(/([^.]+)/g);

        let current = res;

        (path as Array<string>).forEach((m, i) => {
            if (!current[m]) current[m] = {};

            if (i === (path as Array<string>).length - 1) current[m] = !parts[2] ? '' : parseQueryValue(parts[2]);
            else current = current[m];
        });
    });

    return res;
}

const appendObject = (obj: any, path: string) => {
    const keys: Array<any> = path.split(':');
    const lastKey = keys.pop();
    const lastObj = keys.reduce((acc, cur) => (acc[cur] = acc[cur] || {}), obj);

    lastObj[lastKey] = 'path';

    return obj;
};

const toPopulation = (obj: any) =>
    (transform as any).convert({ cap: false })(
        (res: Array<any>, value: Array<any>, key: string) => {
            if (typeof value === 'object')
                res.push({
                    path: key,
                    populate: toPopulation(value),
                });
            else res.push({ path: key });
        },
        [],
        obj
    );

/**
 * Parses comma separated string populate names into mongodb population object.
 */
export function parsePopulation(rawPopulation: string | any): any {
    if (!rawPopulation) return '';

    let obj = {};

    for (const item of rawPopulation.split(',')) obj = appendObject(obj, item);

    return toPopulation(obj);
}

/**
 * Parses comma separated string sort names into mongodb population object.
 */
export function parseSort(rawSort: string | any): any {
    return rawSort.replace(/,/g, ' ');
}

const getErrorResponse = (err: any) => {
    let status: HttpStatusCode | number = HttpStatusCode.InternalServerError;
    let type: ErrorType | string = '';

    if (err.name === 'MongoError' && err.code === 11000) {
        status = HttpStatusCode.Conflict;
        type = ErrorType.AlreadyExists;
    } else if (err.name === 'ValidationError') {
        status = HttpStatusCode.UnprocessableEntity;
        type = ErrorType.MissingField;
    }

    return {
        status,
        body: {
            type,
            message: err.message,
        },
    };
};

/**
 * Clears an existing collection using recursive retries.
 */
export function clearCollection(instance: mongoose.Mongoose, name: string): Promise<any> {
    const collection = instance.connection.collections[name];

    return collection.drop().catch(() => clearCollection(instance, name));
}

export interface HttpResponse {
    status: HttpStatusCode;
    body?: any;
}

export enum HttpMethod {
    /**
     * Represents an HTTP GET protocol method.
     */
    Get = 'GET',
    /**
     * Represents an HTTP POST protocol method that is used to post a new entity as an addition to a URI.
     */
    Post = 'POST',
    /**
     * Represents an HTTP DELETE protocol method.
     */
    Delete = 'DELETE',
    /**
     * Represents an HTTP HEAD protocol method.
     */
    Head = 'HEAD',
    /**
     * Represents an HTTP PATCH protocol method that is used to replace partially an entity identified by a URI.
     */
    Patch = 'PATCH',
    /**
     * Represents an HTTP PUT protocol method that is used to replace an entity identified by a URI.
     */
    Put = 'PUT',
    /**
     * Represents an HTTP OPTIONS protocol method.
     */
    Options = 'OPTIONS',
    /**
     * Represents an HTTP TRACE protocol method.
     */
    Trace = 'TRACE',
}

export interface HttpRequest {
    originalUrl?: string;
    method: HttpMethod;
    query?: { [key: string]: any };
    headers?: { [key: string]: any };
    body?: any;
    params?: { [key: string]: any };
    rawBody?: any;
}

export function createApi(
    authHandler: { ensureAuthorized: (request: Request, response: Response, next: NextFunction) => Promise<any> },
    app,
    store,
    logger: Log
) {
    Object.keys(store.models).forEach(modelName => {
        const mongooser = new Mongooser(store.models[modelName]);

        app.get(
            `/api/${kebabCase(modelName)}`,
            authHandler.ensureAuthorized,
            async (request: Request, response: Response, next: NextFunction) => {
                const query = request.body || {
                    criteria: {},
                    projection: {},
                    population: [],
                    page: null,
                    perPage: 10,
                    sort: null,
                };

                try {
                    const dbResponse = await mongooser.getMany(
                        query.criteria,
                        query.projection,
                        query.population,
                        query.page,
                        query.perPage,
                        query.sort
                    );
                    logger.info(dbResponse);
                    response.status(dbResponse.status).send(dbResponse.body);
                } catch (ex) {
                    logger.error(ex);
                    response.status(500).send('' + ex);
                }
            }
        );

        app.get(
            `/api/${kebabCase(modelName)}/:id`,
            authHandler.ensureAuthorized,
            async (request: Request, response: Response, next: NextFunction) => {
                const query = request.body || {
                    projection: null,
                    population: null,
                };

                try {
                    const dbResponse = await mongooser.getOne(request.params.id, query.projection, query.population);
                    response.status(dbResponse.status).send(dbResponse.body);
                } catch (ex) {
                    logger.error(ex);
                    response.status(500).send('' + ex);
                }
            }
        );

        app.post(
            `/api/${kebabCase(modelName)}/create`,
            authHandler.ensureAuthorized,
            async (request: Request, response: Response, next: NextFunction) => {
                try {
                    const dbResponse = await mongooser.insertMany(request);
                    response.status(dbResponse.status).send(dbResponse.body);
                } catch (ex) {
                    logger.error(ex);
                    response.status(500).send('' + ex);
                }
            }
        );

        app.post(
            `/api/${kebabCase(modelName)}/update/:id`,
            authHandler.ensureAuthorized,
            async (request: Request, response: Response, next: NextFunction) => {
                try {
                    const dbResponse = await mongooser.updateOne(request, request.params.id);
                    response.status(dbResponse.status).send(dbResponse.body);
                } catch (ex) {
                    logger.error(ex);
                    response.status(500).send('' + ex);
                }
            }
        );

        app.delete(
            `/api/${kebabCase(modelName)}/:id`,
            authHandler.ensureAuthorized,
            async (request: Request, response: Response, next: NextFunction) => {
                try {
                    const dbResponse = await mongooser.deletebyId(request.params.id);
                    response.status(dbResponse.status).send(dbResponse.body);
                } catch (ex) {
                    logger.error(ex);
                    response.status(500).send('' + ex);
                }
            }
        );
    });
}

/**
 * The mongoose-based RESTful API implementation.
 */
export class Mongooser<T extends mongoose.Document> {
    constructor(private readonly model: mongoose.Model<T>) {}

    /**
     * Retrieves an existing item by id.
     */
    getOne(
        id: any,
        projection?: any,
        population?: mongoose.ModelPopulateOptions | Array<mongoose.ModelPopulateOptions>
    ): Promise<HttpResponse> {
        const query$ = this.model
            .findOne({ _id: id }, projection)
            .populate(population)
            .lean();

        return query$
            .then((doc: T) => {
                if (!doc)
                    return Promise.resolve({
                        status: HttpStatusCode.NotFound,
                    });

                const data: T = doc;
                data._id = String(doc._id);

                return {
                    status: HttpStatusCode.OK,
                    body: {
                        _id: data._id,
                        ...JSON.parse(JSON.stringify(data)),
                    },
                };
            })
            .catch(getErrorResponse);
    }

    /**
     * Retrieves existing items.
     */
    getMany(
        criteria?: any,
        projection?: any,
        population?: mongoose.ModelPopulateOptions | Array<mongoose.ModelPopulateOptions>,
        page?: number | any,
        perPage?: number | any,
        sort?: string | any,
        showInactive?: boolean | any
    ): Promise<HttpResponse> {
        const count$ = this.model.find(criteria, projection).count() as any;

        const query$ = this.model
            .find(criteria, projection)
            .sort(sort)
            .skip(Number(page) >= 0 && Number(perPage) > 0 ? Number(page) * Number(perPage) : 0)
            .limit(Number(page) >= 0 && Number(perPage) > 0 ? Number(perPage) : 0)
            .populate(population)
            .lean() as any;

        return Promise.all([count$, query$])
            .then((res: Array<any>) => {
                const totalCount = res[0];
                const docs = res[1];
                const data: Array<T> = [];

                for (const item of docs as Array<T>) {
                    item._id = String(item._id);
                    data.push({
                        _id: item._id,
                        ...JSON.parse(JSON.stringify(item)),
                    });
                }

                return {
                    status: HttpStatusCode.OK,
                    body: {
                        data,
                        hasMore:
                            Number(page) >= 0 && Number(perPage) > 0
                                ? totalCount > (Number(page) + 1) * Number(perPage)
                                : false,
                        totalCount,
                    },
                };
            })
            .catch(getErrorResponse);
    }

    /**
     * Inserts new items.
     */
    insertMany(req: Request): Promise<HttpResponse> {
        const contentType = req.headers ? req.headers['content-type'] : undefined;

        if (!(contentType && contentType.indexOf('application/json') >= 0))
            return Promise.resolve({
                status: HttpStatusCode.BadRequest,
                body: {
                    type: ErrorType.Invalid,
                },
            });

        if (!(req.body && Object.keys(req.body).length))
            return Promise.resolve({
                status: HttpStatusCode.BadRequest,
                body: {
                    type: ErrorType.Invalid,
                },
            });

        const query$ = this.model.insertMany(req.body);

        return query$
            .then((docs: any) => {
                const data: Array<T> = [];

                for (const item of docs as Array<T>) {
                    item._id = String(item._id);
                    data.push({
                        _id: item._id,
                        ...JSON.parse(JSON.stringify(item)),
                    });
                }

                return {
                    status: HttpStatusCode.Created,
                    body: {
                        data,
                        hasMore: false,
                        totalCount: data.length,
                    },
                };
            })
            .catch(getErrorResponse);
    }

    /**
     * Updates (patches) an existing item.
     */
    updateOne(req: Request, id: any): Promise<HttpResponse> {
        const contentType = req.headers ? req.headers['content-type'] : undefined;

        if (!(contentType && contentType.indexOf('application/json') >= 0))
            return Promise.resolve({
                status: HttpStatusCode.BadRequest,
                body: {
                    type: ErrorType.Invalid,
                },
            });

        if (!(req.body && Object.keys(req.body).length))
            return Promise.resolve({
                status: HttpStatusCode.BadRequest,
                body: {
                    type: ErrorType.Invalid,
                },
            });

        if (!id)
            return Promise.resolve({
                status: HttpStatusCode.BadRequest,
                body: {
                    type: ErrorType.Invalid,
                },
            });

        const query$ = this.model.findOneAndUpdate({ _id: id }, req.body, { new: true }).lean();

        return query$
            .then((doc: T) => {
                if (!doc)
                    return {
                        status: HttpStatusCode.BadRequest,
                        body: {
                            type: ErrorType.Missing,
                        },
                    };
                else {
                    const data: T = doc;
                    data._id = String(doc._id);

                    return {
                        status: HttpStatusCode.OK,
                        body: {
                            _id: data._id,
                            ...JSON.parse(JSON.stringify(data)),
                        },
                    };
                }
            })
            .catch(getErrorResponse);
    }

    /**
     * Deactivates an existing item.
     */
    deletebyId(id: any): Promise<HttpResponse> {
        if (!id)
            return Promise.resolve({
                status: HttpStatusCode.BadRequest,
                body: {
                    type: ErrorType.Missing,
                },
            });

        const query$ = this.model.remove({ _id: id }).lean();

        return query$
            .then((doc: T) => {
                if (!doc)
                    return {
                        status: HttpStatusCode.BadRequest,
                    };
                else
                    return {
                        status: HttpStatusCode.OK,
                        body: {
                            deactivated: true,
                            _id: String(doc._id),
                        },
                    };
            })
            .catch(getErrorResponse);
    }
}
