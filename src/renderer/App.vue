<template>
  <div id="app">
    <!--<router-view></router-view>-->
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import PinEntry from './elements/PinEntry';

export default {
  name: 'trezor-ethereum-wallet',
  data() {
    return {
      pinEntryActive: false,
    };
  },
  computed: {
    ...mapState({ userTable: ({ database: { tables: { user } } }) => user }),
  },
  methods: {
    ...mapActions(['initializeDatabase']),
  },
  created() {
    this.initializeDatabase();
    if (this.userTable) {
      this.userTable.count().then(({ count }) => console.log(count));
    }
  },
  components: {
    PinEntry,
  },
};
</script>

<style>
@import '~spectre.css/dist/spectre.min.css';
</style>
