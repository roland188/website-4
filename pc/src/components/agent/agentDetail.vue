<template>
  <div class="agent-detail">
      <div class="wrap" v-loading="loading">
          <div v-html="info.rule"></div>
      </div>
  </div>
</template>

<script>
export default {
  name: "agentDetail",
  data() {
    return {
        info: [],
        loading: false
    };
  },
  computed:{},
  mounted(){
    this.getData();
  },
  methods: {
    getData() {
        this.loading = true;
        this.$http.get(this.$api.getAgentCommissionPlan).then((res) =>{
            if (res.code == 0) {
                this.info = res.data;
                this.loading = false;
            } else {
                this.$message.error(res.msg);
            }
        });
    }
  },
};
</script>

<style lang="scss" scoped>
.agent-detail {
    min-height: 500px;
    background-color: #f2f2f2;
    border-radius: 3px;
    .wrap {
        box-sizing: border-box;
        padding: 50px;
        padding-top: 50px;
        min-height: 600px;
        margin: 0 auto;
    }
}
</style>
