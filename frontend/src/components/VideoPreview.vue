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
            const ctx = canvas.getContext('2d');

            ctx.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            // const imageData = ctx.getImageData(0, 0, video.clientWidth, video.clientHeight);
            canvas.toBlob(async function(blob) {
                const newImage = document.createElement('img');
                const url = URL.createObjectURL(blob);
                newImage.onload = function() {
                    URL.revokeObjectURL(blob);
                }
                newImage.src = url;
                document.body.appendChild(newImage)

                const facePositions = await detect(blob)
                console.log(facePositions)
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