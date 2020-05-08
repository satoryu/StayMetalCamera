<template>
    <div>
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
            Show Your True Face
        </v-btn>
    </div>
</template>

<script>

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
        capture: function() {
            const video = this.$el.getElementsByTagName('video')[0];
            const canvas = document.createElement('canvas');
            canvas.width = video.clientWidth;
            canvas.height = video.clientHeight
            const ctx = canvas.getContext('2d');

            ctx.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            canvas.toBlob(this._emit)
        },
        _emit: function(blob) {
            this.$emit('capture', blob)
        }
    },

    data: () => ({})
}
</script>