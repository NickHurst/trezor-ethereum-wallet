<script>
export default {
  name: 'Modal',
  functional: true,
  render(h, ctx) {
    const { props: { size, active }, listeners: { close } } = ctx;
    const { title, footer, default: body } = ctx.slots();

    const modalOverlay = h('div', { class: 'modal-overlay' });

    const modalHeader = h('div', { class: 'modal-header' }, [
      h('button', { class: 'btn btn-clear float-right', on: { click: close } }),
      title ? h('div', { class: 'modal-title' }, [title]) : undefined,
    ]);

    const modalBody = h('div', { class: 'modal-body' }, [
      h('div', { class: 'content' }, [body]),
    ]);

    const modalFooter = h('div', { class: 'modal-footer' }, [footer]);

    const modalContainer = h('div', { class: 'modal-container' }, [
      modalHeader, modalBody, footer ? modalFooter : undefined,
    ]);

    return h('div', {
      class: { modal: true, active, [`modal-${size}`]: size },
    }, [modalOverlay, modalContainer]);
  },
  props: {
    size: {
      type: String,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>
</style>
