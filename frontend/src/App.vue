<template>
  <v-app dark>
    <AppBar />
    <v-content>
      <v-row align="center" justify="center">
        <v-col cols="10" sm="8">
          <CameraPreview @capture="makeStayMetal" />
        </v-col>
      </v-row>

      <v-dialog v-if="maskImageBlob" v-model="maskImageBlob">
        <v-row align="center" justify="center">
          <v-col cols="10" sm="8">
            <v-card dark>
              <v-img :src="maskImageUrl"></v-img>

              <v-card-title>Stay Home, Stay Metal</v-card-title>

              <v-card-text>Is this OK?</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="maskImageBlob = null">
                  <v-icon class="mr-2">fas fa-undo</v-icon>Retake
                </v-btn>
                <v-btn color="primary" @click="download">
                  <v-icon class="mr-2">fas fa-download</v-icon>Download
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-dialog>
    </v-content>
  </v-app>
</template>

<script>
import { detect } from "./lib/faceDetection";
import maskImageUrl from "./assets/su-mask.png";
const maskImage = new Image();
maskImage.src = maskImageUrl;

import AppBar from "./components/AppBar";
import CameraPreview from "./components/CameraPreview";

export default {
  name: "App",

  components: {
    AppBar,
    CameraPreview
  },

  data: () => ({
    maskImageBlob: null
  }),

  computed: {
    maskImageUrl: function() {
      return URL.createObjectURL(this.maskImageBlob);
    }
  },

  methods: {
    makeStayMetal: async function(faceImageBlob) {
      this.image = faceImageBlob;

      const facePositions = await detect(faceImageBlob);
      const img = new Image();
      const url = URL.createObjectURL(faceImageBlob);
      const vm = this;
      img.addEventListener("load", function() {
        URL.revokeObjectURL(faceImageBlob);
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        facePositions.forEach(element => {
          const { faceRectangle, faceLandmarks } = element;

          ctx.drawImage(
            maskImage,
            faceRectangle.left,
            faceLandmarks.noseLeftAlarTop.y,
            faceRectangle.width,
            faceRectangle.top +
              faceRectangle.height -
              faceLandmarks.noseLeftAlarTop.y
          );
        });

        canvas.toBlob(function(blob) {
          vm.maskImageBlob = blob;
        });
      });
      img.src = url;
    },
    download: function() {
      const downloadTag = document.createElement("a");
      downloadTag.href = this.maskImageUrl;
      downloadTag.download = "staymetalmask.png";
      downloadTag.click();
    }
  }
};
</script>
