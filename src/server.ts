import * as express from 'express'
import * as http from 'http'
import * as log4js from 'log4js'
import * as fs from 'fs'
import * as path from 'path'

import * as ap from './api/sample';

const logger = log4js.getLogger('application');

export class Server {
    private static _DEFAULT_PORT = 8080;

    private _server: express.Express;
    private _port = Server._DEFAULT_PORT;
    private _apiDir = path.join(__dirname, '/api');;

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
                        if (m.routor) {
                            logger.info(`API module loading: ${targetPath}`);
                            let handlers = this._createHandlers(require(targetPath).parser, restrictHandler);
                            handlers.push(require(targetPath).routor);
                            this._server.use('/api/', handlers);
                        }
                    }).catch((err) => {
                        logger.error(err);
                    });
                }
            }
        }
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
        this._loadApi();
        http.createServer(this._server).listen(this._port, '0.0.0.0', () => {
            logger.info(`[${process.pid}] Server started.`);
        });
        logger.info(`[${process.pid}] Server listen at port ${this._port}`);
    }

}