# twilio-lambda-cron

This project will poll an [AirVisual Pro](https://www.iqair.com/air-quality-monitors/airvisual-pro) device-specific API endpoint using a cron trigger and alert if the CO2 concentration or PM2.5 if above a configurable threshold. This project contains source code and supporting files for a serverless application that you can deploy with the SAM CLI. You must have an AirVisual Pro device linked to an iqair.com account to make use of this respository

## Deploy the sample application

The Serverless Application Model Command Line Interface (SAM CLI) is an extension of the AWS CLI that adds functionality for building and testing Lambda applications. It uses Docker to run your functions in an Amazon Linux environment that matches Lambda. It can also emulate your application's build environment and API.

To use the SAM CLI, you need the following tools.

* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* Node.js - [Install Node.js 10](https://nodejs.org/en/), including the NPM package management tool.
* Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)

To build and deploy your application for the first time, run the following in your shell:

```bash
sam build
sam deploy --guided
```

## Environment variables

The following environment variables should be configured:
* TWILIO_ACCOUNT_SID: Your Twilio Account SID from the Twilio Console
* TWILIO_AUTH_TOKEN: Your Twilio Auth Token from the Twilio Console
* TWILIO_PHONE_NUMBER: Your Twilio Phone number in [E164 format](https://www.twilio.com/docs/glossary/what-e164)
* DESTINATION_ALERT_PHONE_NUMBER: Your destination alert phone number in E164 format
* AIR_QUALITY_API: The HTTPS URL to your AirVisual Node API obtained from [your AirVisual devices dashboard](https://www.iqair.com/dashboard/devices) in format https://www.airvisual.com/api/v2/node/{uniqueDeviceApiLink}
* PM2_LIMIT: PM2.5 limit in µg/m^33
* CO2_LIMIT: CO2 threshold in PPM (parts per million)

## Cron configuration

In the template.yaml, configure your CRON expression for alerting. The alert text message will only be sent during the cron schedule if one of the measured values exceeds the threshold defined in the two limits.
