<script setup>
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";
import { onMounted } from "vue";

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
  console.log("here");
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

    nfc.start();
  } else {
    console.log(
      "NFC permission denied. Please grant permission to access NFC devices."
    );
  }
};
</script>

<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="@/assets/logo.svg"
      width="125"
      height="125"
    />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>

      <button @click="readTag">scan now</button>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
