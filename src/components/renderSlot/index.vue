<script>
export default {
  functional: true,
  props: {
    render: Function,
    rowData: Object
  },
  render: (h, ctx) => {
    const params = {
      rowData: ctx.props.rowData
    }
    return ctx.props.render(h, params)
  }
}
</script>
