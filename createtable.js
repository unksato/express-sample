var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-west-2",
    accessKeyId: "myKeyId",
    secretAccessKey: "secretkey",
    endpoint: "http://localhost:7777"
});

var dynamodb = new AWS.DynamoDB();

var messagesTable = {
    TableName: "Messages",
    KeySchema: [
        { AttributeName: "messageId", KeyType: "HASH" },
        { AttributeName: "publishedAt", KeyType: "RANGE" }
    ],
    AttributeDefinitions: [
        { AttributeName: "messageId", AttributeType: "S" },
        { AttributeName: "publisherId", AttributeType: "S" },
        { AttributeName: "publishedAt", AttributeType: "N" }
    ],
    GlobalSecondaryIndexes: [
        {
            IndexName: "index_publisher_date",
            KeySchema: [
                { AttributeName: "publisherId", KeyType: "HASH" },
                { AttributeName: "publishedAt", KeyType: "RANGE" }
            ],
            Projection: {
                ProjectionType: "KEYS_ONLY"
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
            }
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    }
};

dynamodb.createTable(messagesTable, function (err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});


var usersTable = {
    TableName: "Users",
    KeySchema: [
        { AttributeName: "userId", KeyType: "HASH" }
    ],
    AttributeDefinitions: [
        { AttributeName: "userId", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(usersTable, function (err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));

        var user = {
            TableName: "Users",
            Item: {
                "userId": "USER01",
                "tickets": [new Date('2018-01-01').getTime(),
                new Date('2018-02-01').getTime(),
                new Date('2018-03-01').getTime()]
            }
        };
        
        var docClient = new AWS.DynamoDB.DocumentClient();
        
        docClient.put(user, function(err, data) {
            if (err) {
                console.error("Unable to put data. Error JSON:", JSON.stringify(err, null, 2));
            }else{
                console.log("Put data successful:", JSON.stringify(data, null, 2));
            }
        });
    }
});
