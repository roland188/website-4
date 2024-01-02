export default {
  methods: {
    $t1(str, obj) {
      if (this.$t) {
        return this.$t(str, obj)
      }
      return str
    }
  }
}