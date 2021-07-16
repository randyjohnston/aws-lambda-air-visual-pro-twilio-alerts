const axios = require('axios');

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const toPhoneNumber = process.env.DESTINATION_ALERT_PHONE_NUMBER;
const airQualityApi = process.env.AIR_QUALITY_API;
const pm2Limit = process.env.PM2_LIMIT || 12;
const co2Limit = process.env.CO2_LIMIT || 870;

const twilioClient = require('twilio')(accountSid, authToken, {
    lazyLoading: true
});

let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.lambdaHandler = async (event, context) => {
    try {
        const { data } = await getAirQualityData(airQualityApi);
        await processMessage(data);
        response = {
            'statusCode': 200,
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};

const getAirQualityData = async (url) => {
    const nodeData = await axios.get(url);
    console.log(nodeData.data);
    return nodeData;
}

const processMessage = async (data) => {
    const messageBody = constructMessageBody(data);
    console.log(messageBody);
    if (data.current.p2 >= pm2Limit || data.current.co >= co2Limit) {
        await twilioClient.messages
            .create({
                body: messageBody,
                from: fromPhoneNumber,
                to: toPhoneNumber,
            })
            .then(message => console.log(message.sid))
            .catch(error => {
                console.error(error);
                callback(Error(error));
            });
    } else {
        console.log('PM2.5 and CO2 below limit; no message sent.')
    }
}

const constructMessageBody = data => {
    return `${data.settings.node_name} sample at ${data.current.ts}
        \n\nTemp: ${data.current.tp} C
        \nHumidity: ${data.current.hm}%
        \nPM2.5: ${data.current.p2} ug/m^3 (limit ${pm2Limit})
        \nCO2: ${data.current.co} ppm (limit ${co2Limit})`
} 

