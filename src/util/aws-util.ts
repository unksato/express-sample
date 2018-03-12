import * as aws from 'aws-sdk'

var proxy = require('proxy-agent')

export class AwsUtil {
    private static _DEFAULT_REGION: string = 'us-east-1';

    protected _ACCESS_KEY_ID: string;
    protected _SECRET_ACCESS_KEY: string;
    protected _REGION: string = AwsUtil._DEFAULT_REGION;

    constructor(accessKey: string, secretKey: string, region?: string) {
        this._ACCESS_KEY_ID = accessKey;
        this._SECRET_ACCESS_KEY = secretKey;
        if (region) {
            this._REGION = region;
        }

        aws.config.update({
            accessKeyId: this._ACCESS_KEY_ID,
            secretAccessKey: this._SECRET_ACCESS_KEY,
            region: this._REGION
        });

        var proxyAddr = this.getProxySetting();

        if (proxyAddr) {
            aws.config.update({
                httpOptions: { agent: proxy(proxyAddr) }
            });
        }
    }

    getProxySetting(): string {
        return process.env.http_proxy;
    }
}