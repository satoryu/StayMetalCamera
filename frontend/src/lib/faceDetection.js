import axios from 'axios'

const FACE_DETECTION_ENDPOINT = process.env.VUE_APP_FACE_DETECTION_ENDPOINT;
const FUNCTION_KEY = process.env.VUE_APP_FUNCTION_KEY;

export async function detect(blob) {
  // const endpoint = `${FACE_DETECTION_ENDPOINT}/api/HttpTrigger1`
  const endpoint = `${FACE_DETECTION_ENDPOINT}/api/FaceDetection`

  console.log(endpoint)
  const response = await axios.post(endpoint, blob, {
    headers: {
      'x-functions-key': FUNCTION_KEY,
      'Content-Type': 'application/octet-stream'
    },
  })

  return response.data;
}