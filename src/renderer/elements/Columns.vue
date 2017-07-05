<script>
export default {
  name: 'Columns',
  functional: true,
  render(h, { props: { gapless = false }, children }) {
    return h('div', { class: { columns: true, 'col-gapless': gapless } }, children);
  },
};
</script>

<style>
</style>
