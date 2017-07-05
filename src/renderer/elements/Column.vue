<script>
export default {
  name: 'Column',
  functional: true,
  render(h, { props: { size = 6 }, children }) {
    return h('div', { class: `column col-${size}` }, children);
  },
};
</script>

<style>
</style>
