<script>
export default {
  name: 'Container',
  functional: true,
  render(h, { children }) {
    return h('div', { class: 'container' }, children);
  },
};
</script>

<style>
</style>
