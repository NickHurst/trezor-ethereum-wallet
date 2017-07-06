<template>
  <div id="app">
    <router-view></router-view>

    <pin-entry :active="pinEntryActive"></pin-entry>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import PinEntry from './elements/PinEntry';

export default {
  name: 'cryptfolio',
  data() {
    return {
      pinEntryActive: false,
    };
  },
  methods: {
    ...mapActions(['initializeWallet']),
  },
  created() {
    this.initializeWallet();
  },
  components: {
    PinEntry,
  },
};
</script>

<style>
@import '~spectre.css/dist/spectre.min.css';
</style>
