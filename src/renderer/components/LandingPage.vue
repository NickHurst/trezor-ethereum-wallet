<template>
  <container>
    <columns>
      <column :size="3">asdf</column>
    </columns>
  </container>
</template>

<script>
import { Container, Columns, Column } from '../elements';

export default {
  name: 'landing-page',
  computed: {
    etherWallet() {
      return true;
    },
  },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    },
  },
  created() {
    // window.trezor = trezor;

    // const list = new trezor.DeviceList();

    // list.on('connect', (device) => {
    //   device.on('pin', (type, cb) => {
    //     console.log('pin');
    //     console.log(type);
    //     cb(null, '123');
    //   });
    //   getEthereumWallet(device);
    // });

    // list.on('connectUnacquired', unacquired =>
    //   unacquired.steal().then((device) => {
    //     device.on('pin', (type, cb) => {
    //       console.log('pin');
    //       console.log(type);
    //       cb(null, '123');
    //     });
    //     getEthereumWallet(device);
    //   }),
    // );
  },
  components: {
    Container,
    Columns,
    Column,
  },
};
</script>

<style>
</style>
