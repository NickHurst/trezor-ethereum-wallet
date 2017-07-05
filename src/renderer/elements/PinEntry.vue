<template>
  <modal size="sm" :active="active" @close="close">
    <template slot="title">Enter Pin</template>

    <container class="pin-input">
      <columns>
        <column size="12"><span v-for="n in pin.length" :key="n">*</span></column>
      </columns>
      <columns>
        <column size="4">
          <button class="btn" @click="() => pin = `${pin}7`">&nbsp;</button>
        </column>
        <column size="4">
          <button class="btn" @click="() => pin = `${pin}8`">&nbsp;</button>
        </column>
        <column size="4">
          <button class="btn" @click="() => pin = `${pin}9`">&nbsp;</button>
        </column>
      </columns>
      <columns>
        <column size="4">
          <button class="btn" @click="() => pin = `${pin}4`">&nbsp;</button>
        </column>
        <column size="4">
          <button class="btn" @click="() => pin = `${pin}5`">&nbsp;</button>
        </column>
        <column size="4">
          <button class="btn" @click="() => pin = `${pin}6`">&nbsp;</button>
        </column>
      </columns>
      <columns>
        <column size="4">
          <button class="btn" @click="() => pin = `${pin}1`">&nbsp;</button>
        </column>
        <column size="4">
          <button class="btn" @click="() => pin = `${pin}2`">&nbsp;</button>
        </column>
        <column size="4">
          <button class="btn" @click="() => pin = `${pin}3`">&nbsp;</button>
        </column>
      </columns>
    </container>

    <template slot="footer">
      <button class="btn" @click="close">Cancel</button>
      <button class="btn btn-primary" @click="submit">Submit</button>
    </template>
  </modal>
</template>

<script>
import Modal from './Modal';
import Column from './Column';
import Columns from './Columns';
import Container from './Container';

export default {
  name: 'PinEntry',
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      pin: '',
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },
    submit() {
      this.$emit('submit');
    },
  },
  components: { Modal, Column, Columns, Container },
};
</script>

<style>
</style>
