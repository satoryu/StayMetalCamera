<template>
  <v-app>
    <AppBar />
    <v-content>
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="10"
          sm="8"
        >
          <CameraPreview
            @capture="makeStayMetal"
          />
        </v-col>
      </v-row>
    </v-content>
  </v-app>
</template>

<script>
import { detect } from './lib/faceDetection';
import maskImageUrl from './assets/su-mask.png';
const maskImage = new Image();
maskImage.src = maskImageUrl;

import AppBar from './components/AppBar'
import CameraPreview from './components/CameraPreview';

export default {
  name: 'App',

  components: {
    AppBar,
    CameraPreview
  },

  data: () => ({
    maskImageBlob: null
  }),

  methods: {
    makeStayMetal: async function(faceImageBlob) {
      this.image = faceImageBlob

      const facePositions = await detect(faceImageBlob)
      const img = new Image()
      const url = URL.createObjectURL(faceImageBlob)
      const vm = this;
      img.addEventListener('load', function() {
        URL.revokeObjectURL(faceImageBlob)
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)

        facePositions.forEach( element => {
          const { faceRectangle, faceLandmarks } = element;

          ctx.drawImage(maskImage,
              faceRectangle.left, faceLandmarks.noseLeftAlarTop.y,
              faceRectangle.width,
              (faceRectangle.top + faceRectangle.height - faceLandmarks.noseLeftAlarTop.y)
          )
        })

        canvas.toBlob(function(blob) {
          vm.maskImageBlob = blob
        })
      })
      img.src = url
    }
  }
};
</script>
