import { Server } from './server'
import * as log4js from 'log4js'
import * as sourcemap from 'source-map-support';

sourcemap.install();
log4js.configure('config/log/local.json');

var app = new Server();

app.run();