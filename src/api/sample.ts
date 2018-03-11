
import { Server, AbstractApi } from '../abstract-api';
import * as bodyparser from 'body-parser'
import * as express from 'express';

@Server.Api(bodyparser.json())
class Sample extends AbstractApi {

    @Server.Route.GET('/sample')
    static getHello(req: express.Request, res: express.Response) {
        res.send("Hello World");
    }

    @Server.Route.POST('/sample')
    static postHello(req: express.Request, res: express.Response) {
        res.send(req.body.message);
    }
}
