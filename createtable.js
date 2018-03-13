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
        { AttributeName: "publisherId", KeyType: "HASH" },
        { AttributeName: "publishedAt", KeyType: "RANGE" }
    ],
    AttributeDefinitions: [
        { AttributeName: "publisherId", AttributeType: "S" },
        { AttributeName: "publishedAt", AttributeType: "N" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
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
                "tickets": [123,456,789]
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
