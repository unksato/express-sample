import * as express from 'express'
import * as http from 'http'
import * as log4js from 'log4js'
import * as fs from 'fs'
import * as path from 'path'

import * as ap from './api/sample';
import * as expressJwt from 'express-jwt'
import * as config from 'config'
import * as bodyparser from 'body-parser'

import * as aws from 'aws-sdk'
import { DynamoDBUtil } from './util/dynamodb-util'
import * as tokenUtil from './util/token-util' 

const logger = log4js.getLogger('application');

declare module Dynamo.Schema {
    export interface IUser {
        userId: string,
        tickets: number[]
    }
}

export class Server {
    private static _DEFAULT_PORT = 8080;
    private static _USER_TABLE_NAME = "Users"

    private _server: express.Express;
    private _port = Server._DEFAULT_PORT;
    private _apiDir = path.join(__dirname, '/api');

    static dynamoClient = new DynamoDBUtil<Dynamo.Schema.IUser>(
        config.get("aws.accessKeyId"),
        config.get("aws.secretKey"),
        config.get("aws.region"),
        config.get("aws.dynamo.endpoint"));

    constructor() {
        this._server = express();
        this._server.use(log4js.connectLogger(log4js.getLogger('access'), { level: 'info' }))
    }

    set apiDir(value: string) {
        this._apiDir = value;
    }

    set port(value: number) {
        this._port = value;
    }

    private _loadApi(targetDir = this._apiDir, restrictHandler?: express.RequestHandler) {
        let fileList = fs.readdirSync(targetDir);
        for (let file of fileList) {
            let targetPath = path.join(this._apiDir, file);
            if (fs.statSync(targetPath).isDirectory()) {
                this._loadApi(targetPath, restrictHandler);
            } else {
                if (targetPath.indexOf('.js', targetPath.length - '.js'.length) != -1) {
                    import(targetPath).then((m) => {
                        if (m.default.router) {
                            logger.info(`API module loading: ${targetPath}`);
                            let handlers = this._createHandlers(m.default.parser, restrictHandler);
                            handlers.push(m.default.router);
                            this._server.use('/api/', handlers);
                        }else{
                            logger.error(`Router not found: ${targetPath}`);
                        }
                    }).catch((err) => {
                        logger.error(err);
                    });
                }
            }
        }
    }

    private _createTokenHandler() {
        this._server.post('/auth', bodyparser.json(), this._authenticate);
    }

    private _authenticate(req: express.Request, res: express.Response) {
        let params: aws.DynamoDB.DocumentClient.GetItemInput = {
            TableName: Server._USER_TABLE_NAME,
            Key: {
                userId: req.body.userId
            }
        }

        Server.dynamoClient.get(params).then((data)=>{
            res.send({token: tokenUtil.createToken(data, config.get("secret"))})
        }).catch((err)=>{
            res.status(500).send(err);
        });
    }

    private _createHandlers(handler?: express.RequestHandler, restrictHandler?: express.RequestHandler): express.RequestHandler[] {
        let handlers: express.RequestHandler[] = [];
        if (restrictHandler) {
            handlers.push(restrictHandler);
        }
        if (handler) {
            handlers.push(handler);
        }
        return handlers;
    }

    public run() {
        this._createTokenHandler();
        this._loadApi(undefined, expressJwt({ secret: config.get('secret')}));
        http.createServer(this._server).listen(this._port, '0.0.0.0', () => {
            logger.info(`[${process.pid}] Server started.`);
        });
        logger.info(`[${process.pid}] Server listen at port ${this._port}`);
    }

}