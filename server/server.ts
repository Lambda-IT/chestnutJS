import * as express from 'express';
import * as bodyParser from 'body-parser';

import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { schema } from './app/graphql-schema';

const PORT = process.env.PORT || 9000;
const WS_GQL_PATH = '/subscriptions';

const app = express();

app.use('/graphql', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.listen(PORT, () => console.log(`simple-todos-server listening on port ${PORT}`));
