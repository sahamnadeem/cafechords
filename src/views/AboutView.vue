<template>
  <div class="about">
    <div style="height: 100vh">
      <qrcode-stream
        :track="paintBoundingBox"
        @detect="onDetect"
        @error="onError"
      ></qrcode-stream>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { QrcodeStream } from "vue-qrcode-reader";
import { useCounterStore } from "@/stores/counter";
import router from "@/router";

const result = ref("");
const error = ref("");
const store = useCounterStore();

const paintBoundingBox = (detectedCodes, ctx) => {
  for (const detectedCode of detectedCodes) {
    const {
      boundingBox: { x, y, width, height },
    } = detectedCode;

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#007bff";
    ctx.strokeRect(x, y, width, height);
  }
};

const onError = (err) => {
  error.value = `[${err.name}]: `;

  if (err.name === "NotAllowedError") {
    error.value += "you need to grant camera access permission";
  } else if (err.name === "NotFoundError") {
    error.value += "no camera on this device";
  } else if (err.name === "NotSupportedError") {
    error.value += "secure context required (HTTPS, localhost)";
  } else if (err.name === "NotReadableError") {
    error.value += "is the camera already in use?";
  } else if (err.name === "OverconstrainedError") {
    error.value += "installed cameras are not suitable";
  } else if (err.name === "StreamApiNotSupportedError") {
    error.value += "Stream API is not supported in this browser";
  } else if (err.name === "InsecureContextError") {
    error.value +=
      "Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.";
  } else {
    error.value += err.message;
  }
  store.storeErr(error.value);
};

const onDetect = async (detectedCodes) => {
  result.value = JSON.stringify(detectedCodes.map((code) => code.rawValue));
  await store.storeQr(detectedCodes.map((code) => code.rawValue));
  setTimeout(() => {
    router.go(-1);
  }, 1000);
};
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
