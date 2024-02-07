<script setup>
import { useCounterStore } from "@/stores/counter";
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useCounterStore();
const result = computed(() => {
  return store?.getQr?.length > 0 ? store?.getQr[0] : "";
});

const requestNFCPermission = async () => {
  try {
    const nfc = new NDEFReader();
    await nfc.scan();
    return true; // Permission granted
  } catch (error) {
    console.error("Error while requesting NFC permission:", error);
    return false; // Permission denied
  }
};

const readTag = async () => {
  const permissionGranted = await requestNFCPermission();

  if (permissionGranted) {
    console.log("NFC permission granted. Scanning tags...");
    const nfc = new NDEFReader();

    nfc.onreading = (event) => {
      const decoder = new TextDecoder();
      for (const record of event.message.records) {
        console.log("Record type: " + record.recordType);
        console.log("MIME type: " + record.mediaType);
        console.log("=== data ===\n" + decoder.decode(record.data));
      }
    };

    nfc.onerror = (error) => {
      console.error("Error while scanning NFC tag:", error);
    };
  } else {
    console.log(
      "NFC permission denied. Please grant permission to access NFC devices."
    );
  }
};

const qrCode = () => {
  router.push("/about");
};
</script>

<template>
  <main class="p-xl">
    <div style="padding: 20px">{{ result }}</div>
    <button @click="readTag">scan now</button>
    <button @click="qrCode">Scan QR Code</button>
  </main>
</template>

<style scoped>
.p-xl {
  padding: 2rem;
}
</style>
