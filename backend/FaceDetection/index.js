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

    const arrayBuffer = Uint8Array.from(req.rawBody.split(''), e => e.charCodeAt(0)).buffer;
    const response = await faceClient.face.detectWithStream(arrayBuffer, { returnFaceLandmarks: true })

    context.log(response._response.bodyAsText)

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}