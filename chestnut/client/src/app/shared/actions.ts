import { Either } from 'fp-ts/lib/Either';
import { ErrorType } from '@shared/bind-functions';
import { ModelDescription } from '../../../../common/metadata';

export interface MetadataDto {
    models: ModelDescription[];
}

export class MetadataLoaded {
    readonly type = 'CATALOG_DATA_LOADED';
    constructor(public payload: Either<ErrorType, MetadataDto>) {}
}

export class MetadataLoading {
    readonly type = 'CATALOG_DATA_LOADING';
}
