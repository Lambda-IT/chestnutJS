import { Chestnut, Response, Request } from '.';

export function createHomeController(server: Chestnut) {
    server.expressApp.get('/', getHome);
    server.expressApp.post('/', postHome);

    function getHome(req: Request, res: Response, next) {
        res.locals.testText = 'Hello World';

        server.models.User.find({}).then(users => {
            res.locals.users = users;
            res.render('test');
            next();
        });
    }

    function postHome(req: Request, res: Response, next) {
        res.locals.testText = 'POST SUCCESS';
        res.locals.users = [];
        res.render('test');
        next();
    }
}
