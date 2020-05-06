const faceSdk = require('@azure/cognitiveservices-face');
const msRest = require('@azure/ms-rest-js');

module.exports = async function (context, req) {
    const subscriptionKey = process.env.SUBSCRIPTION_KEY;
    const faceApiEndpoint = process.env.FACE_API_ENDPOINT;
    const cognitiveServiceCredentials = new msRest.ApiKeyCredentials({
        inHeader: {
            'Ocp-Apim-Subscription-Key': subscriptionKey
        }
    });
    const faceClient = new faceSdk.FaceClient(cognitiveServiceCredentials, faceApiEndpoint)

    const arrayBuffer = Buffer.from(req.body).buffer;
    const detectionOptions = {
        detectionModel: 'detection_01',
        recognitionModel: 'recognition_02',
        returnFaceLandmarks: true
    }
    const response = await faceClient.face.detectWithStream(arrayBuffer, detectionOptions)

    context.log(response._response.bodyAsText)

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: response._response.parsedBody
    };
}