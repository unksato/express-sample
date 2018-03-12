
import { Server } from '../api-decorator';
import * as bodyparser from 'body-parser'
import * as express from 'express';

@Server.Api(bodyparser.json())
export default class Sample {

    @Server.Route.GET('/sample')
    static getHello(req: express.Request, res: express.Response) {
        res.send("Hello World");
    }

    @Server.Route.POST('/sample')
    static postHello(req: express.Request, res: express.Response) {
        res.send(req.body.message);
    }
}
