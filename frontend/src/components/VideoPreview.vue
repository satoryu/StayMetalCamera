<template>
    <div>
        <div
            v-if="errorMessage"
            id="error-message"
        >
            {{ errorMessage }}
        </div>
        <video
            width="100%"
            autoplay
            playsinline
            class="preview"
        ></video>

        <v-btn
            block
            color="primary"
            dark
            @click="capture"
        >
            <v-icon>fas fa-camera</v-icon>
        </v-btn>
    </div>
</template>

<script>

import { detect } from '../lib/faceDetection';
import maskImageUrl from '../assets/su-mask.png';
const maskImage = new Image();
maskImage.src = maskImageUrl;

export default {
    mounted: function() {
        if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({ video: true }).then((mediaStream) => {
                const video = this.$el.getElementsByTagName('video')[0]

                video.srcObject = mediaStream
            }).catch((e) => {
                console.log('Rejected', e)
                this.errorMessage = `${e.name} ${e.message}`
            })
        } else {
            console.warn('This device does not support mediaDevices and/or getUserMedia.')
        }
    },
    methods: {
        capture: async function() {
            const video = this.$el.getElementsByTagName('video')[0];
            const canvas = document.createElement('canvas');
            canvas.width = video.clientWidth;
            canvas.height = video.clientHeight
            const ctx = canvas.getContext('2d');

            ctx.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            canvas.toBlob(async function(blob) {
                const facePositions = await detect(blob)
                console.debug(facePositions)

                const img = new Image(video.clientWidth, video.clientHeight)
                const url = URL.createObjectURL(blob)
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                img.onload = function() {
                    URL.revokeObjectURL(blob)
                    const context = canvas.getContext('2d');
                    context.drawImage(img, 0, 0);

                    facePositions.forEach( element => {
                        const { faceRectangle, faceLandmarks } = element;

                        context.drawImage(maskImage,
                            faceRectangle.left, faceLandmarks.noseLeftAlarTop.y,
                            faceRectangle.width,
                            (faceRectangle.top + faceRectangle.height - faceLandmarks.noseLeftAlarTop.y)
                        )
                    })
                }
                img.src = url;
                document.body.appendChild(canvas)
            })
        }
    },

    data: function () {
        return {
            errorMessage: null
        }
    },
}
</script>