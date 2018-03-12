var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-west-2",
    accessKeyId: "myKeyId",
    secretAccessKey: "secretkey"
  });
  
  var dynamodb = new AWS.DynamoDB({endpoint: new AWS.Endpoint('http://localhost:7777') });
  
  var params = {
      TableName : "Messages",
      KeySchema: [
          { AttributeName: "publisherId", KeyType: "HASH"},
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
  
  dynamodb.createTable(params, function(err, data) {
      if (err) {
          console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
      }
  });