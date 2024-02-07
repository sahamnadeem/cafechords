import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", () => {
  const qr = ref("");
  const err = ref("");
  function storeQr(payload) {
    qr.value = payload;
  }

  function storeErr(payload) {
    err.value = payload;
  }

  const getErr = computed(() => err.value);
  const getQr = computed(() => qr.value);

  return { qr, storeQr, getQr, storeErr, getErr };
});
