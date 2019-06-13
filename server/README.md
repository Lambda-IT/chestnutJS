# chestnutJS

Headless CMS with Angular 7.2 Admin UI and GraphQL, mongoose (typegoose) backend

## Installation and usage

Using npm:

```sh
npm install --save chestnutjs-server
npm install --save chestnutjs-client
```

After installing **chestnutJS** the following function can be used to bootup the entire chestnut ecosystem: `initChestnut`. The configuration parameter is declared as:

```typescript
export declare type ChestnutOptions = {
    port: number;
    models: {
        // The models that chestnutJS should be able to handle
        [name: string]: any;
    };
    mongoDb: string; // The mongoDb connection string
    modelName?: {
        // Optional parameters how the model names should be handled, if nothing is given the
        // collection names of the mongoDB will and need to exactly match the models names
        prefix?: string; // If the modelnames should be prefixed as DB collection name
        pluralize?: true; // If the modelnames should be pluralized as DB collection name
        kebabCase?: true; // If the modelnames should get kebabcased as DB collection name
    };
    publicFolder?: string;
    sessionSecret: string;
    apiUrl: string;
};

// Example
import * as cModels from './models';
// It is also possible to only expose some of the models
// import * as cModels from './models/Person';
const PORT = parseInt(process.env.PORT || '9000', 10);
initChestnut(
    {
        port: PORT,
        models: cModels,
        apiUrl: `http://localhost:${PORT}`,
        sessionSecret: 'supersecret1234',
        mongoDb: 'mongodb://localhost:27017/example-app',
    },
    initExampleApp
);
```

Where the second parameter (`initExampleApp` in the example) is an optional callback which gets the **chestnutJS** environment as parameter and needs to return a promise.  
This can be used to configure the custom API endpoints or replace an already existing nodeJS mongoDB environment.

```typescript
export declare type Chestnut = {
    expressApp: express.Express;
    store: Store;
    logger: Log;
    server: Server;
};

// Example
export async function initExampleApp(chestnut: Chestnut): Promise<void> {
    try {
        const { expressApp: app, server } = chestnut;

        const connection = await mongoose.createConnection(URL, {
            useMongoClient: true,
        });

        createModels(connection);

        app.use('/api', customApiRoutes);

        // Additional server features like websockets can be attached via the server object
        // ...
    } catch (e) {
        console.error('Error', e);
        chestnut.logger.error(e);
    }
}
```
