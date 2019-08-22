# NodeJS custom skill template

This projects provides a production-ready NodeJS custom skill template.

Once you have cloned the skill, you can deploy it by running:

    ask deploy

Take into account that before deploying the lambda function ASK will create a new IAM role called 'ask-lambda-alexa-custom-skill-nodejs-template'. In order for this skill to run properly you must attach the AmazonDynamoDBFullAccess policy to this role, otherwise the skill will fail at launch (you will get a AskSdk.DynamoDbPersistenceAdapter in CloudWatch logs).

## Change table name

The table name is hardcoded in ```persistence.js```, you can change it right there.

## Upgrade to node 10.x

By default ASK will configure your lambda function to run using the NodeJS 8.10 runtime. After having deployed the skill, you should upgrade to runtime 10.x by editing ```.ask/config``` and replacing the value of the property runtime from ```nodejs8.10``` to ```nodejs10.x```.

Bear in mind you can just redeploy the lambda function by running: 

    ask deploy -t lambda

