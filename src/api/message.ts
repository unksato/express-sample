import { Server, AbstractApi } from '../abstract-api';
import * as bodyparser from 'body-parser'
import * as express from 'express';
import { DynamoDBUtil } from '../util/dynamodb-util'
import * as config from 'config'

declare module Dynamo.Schema {
    export interface IMessage {
        id: string,
        idleId: string,
        publishedAt: number,
    }
}

@Server.Api(bodyparser.json())
class Message extends AbstractApi {

    static dynamoClient = new DynamoDBUtil<Dynamo.Schema.IMessage>(
        config.get("aws.accessKeyId"),
        config.get("aws.secretKey"),
        config.get("aws.region"));

    @Server.Route.GET('/message')
    static getMessage(req: express.Request, res: express.Response) {

    }

    @Server.Route.GET('/message')
    static postMessage(req: express.Request, res: express.Response) {

    }

}