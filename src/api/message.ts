import { Server } from '../api-decorator';
import * as bodyparser from 'body-parser'
import * as express from 'express';
import { DynamoDBUtil } from '../util/dynamodb-util'
import * as config from 'config'
import * as aws from 'aws-sdk'
import * as url from 'url'

declare module Dynamo.Schema {
    export interface IMessage {
        publisherId: string,
        message: string,
        publishedAt: number,
    }
}

@Server.Api(bodyparser.json())
export default class Message {

    static TABLE_NAME = "Messages";
    static TICKET_EXPIRE = 10;

    static dynamoClient = new DynamoDBUtil<Dynamo.Schema.IMessage>(
        config.get("aws.accessKeyId"),
        config.get("aws.secretKey"),
        config.get("aws.region"),
        config.get("aws.dynamo.endpoint"));

    @Server.Route.GET('/messages')
    static getAllMessages(req: express.Request, res: express.Response) {
        res.status(501).send("Not Implemented");
    }

    @Server.Route.GET('/messages/:publisherId')
    static getPublisherMessages(req: express.Request, res: express.Response) {

        let query = url.parse(req.url, true).query;

        let params: aws.DynamoDB.DocumentClient.QueryInput = {
            TableName: Message.TABLE_NAME,
            KeyConditionExpression: 'publisherId = :publisherId',
            ExpressionAttributeValues: {':publisherId': req.params.publisherId}
        }

        let tickets = query.ticket ? Array.isArray(query.ticket) ? query.ticket : [query.ticket] : [];
        let ticketCondition = '';
        for (let i in tickets) {
            if (ticketCondition)
                ticketCondition = ticketCondition + ' OR ';
            ticketCondition = ticketCondition + `(publishedAt >= :ticket_${i} AND publishedAt < :ticket_expire_${i})`;
            params.ExpressionAttributeValues[`:ticket_${i}`] = Number(tickets[i]);
            params.ExpressionAttributeValues[`:ticket_expire_${i}`] = Number(tickets[i]) + Message.TICKET_EXPIRE;
        }
        if (ticketCondition)
            params.FilterExpression = ticketCondition;

        Message.dynamoClient.query(params).then((datas)=>{
            res.send(datas);
        }).catch((err)=>{
            res.status(500).send(err);
        });
    }

    @Server.Route.POST('/messages')
    static postMessage(req: express.Request, res: express.Response) {
        if(req.body.publisherId){
            let params: aws.DynamoDB.DocumentClient.PutItemInput = {
                TableName: Message.TABLE_NAME,
                Item: {
                    "publisherId": req.body.publisherId,
                    "publishedAt": (req.body.publishedAt ? new Date(req.body.publishedAt) : new Date()).getTime(),
                    "message": req.body.message
                }
            };
            
            Message.dynamoClient.put(params).then((data)=>{
                res.send(data);
            }).catch((err)=>{
                res.status(500).send(err);
            })
        }else{
            res.status(400).send("Bad Request")
        }
    }
}