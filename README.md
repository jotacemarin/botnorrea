# botnorrea

## nodejs version
- 14.19.1

## dependencies

- http-status
- telegraf
- axios
- googleapis (deprecation incomming)
- lodash
- moment
- mongoose
- redis
- mixpanel

## commands

- deploy `sls deploy --stage prod --verbose`
- remove `sls remove --stage prod --verbose`

## service Information

- service: botnorrea
- stage: prod
- region: us-east-2
- stack: botnorrea-prod
- resources: 19

## api keys:

- None

## endpoints:

- `POST` - https://59lbo0f12c.execute-api.us-east-2.amazonaws.com/prod/setWebhook
- `POST` - https://59lbo0f12c.execute-api.us-east-2.amazonaws.com/prod/webhook
- `POST` - https://59lbo0f12c.execute-api.us-east-2.amazonaws.com/prod/publicWebhook

## functions:

- setWebhook: `botnorrea-set-webhook`
- webhook: `botnorrea-webhook`
- publicWebhook: `botnorrea-public-webhook`

## layers:

- None

## stack Outputs

- SetWebhookLambdaFunctionQualifiedArn: arn:aws:lambda:us-east-2:776336691876:function:setWebhook:1
- WebhookLambdaFunctionQualifiedArn: arn:aws:lambda:us-east-2:776336691876:function:webhook:1
- ServiceEndpoint: https://sm3dknnmg4.execute-api.us-east-2.amazonaws.com/prod
- ServerlessDeploymentBucketName: botnorrea-prod-serverlessdeploymentbucket-1f6nq47zxge25
