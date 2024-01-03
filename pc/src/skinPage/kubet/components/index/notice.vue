<template>
  <!-- 公告 -->
  <div id="notice">
    <div class="bn-title">{{title}}</div>
    <vue-seamless-scroll
      :data="list"
      :class-option="optionLeft"
      class="seamless-warp2"
    >
      <ul class="item">
        <li
          v-for="(item, index) in list"
          :key="index"
          v-text="item.content"
        ></li>
      </ul>
    </vue-seamless-scroll>
  </div>
</template>

<script>
export default {
  props:{
    title:{
      type:String,
      default:''
    }
  },
  data() {
    return {
      list: [],
    };
  },
  created() {
    this.getNotices();
  },
  methods: {
    async getNotices() {
      var _this = this;
      var data = {
        createdAt: "",
        currentPage: "",
        pageSize: "",
        publishedAt: "",
        subject: "",
        type: "",
      };
      var res = await _this.$http.post(_this.$api.noticeList, data);

      if (res.code == 0) {
        this.list = res.data.content;

      
      } else {
        this.$message.error(res.msg);
      }
    },
  },
  computed: {
    optionLeft() {
      return {
        direction: 2,
        limitMoveNum: this.list.length,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
#notice {
  display: flex;
  justify-content: center;
}
.bn-title {
  float: left;
  height: 50px;
  padding: 0 20px;
  line-height: 50px;
  white-space: nowrap;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  text-indent: 34px;
  color: #ffe371;
//   background: url(../../static/image/pn/icons.png) no-repeat 0;
  background: url(~@/assets/image/notice-icon.png) no-repeat center/28px;
  cursor: pointer;
}
.seamless-warp2 {
  overflow: hidden;
  height: 50px;
  line-height: 50px;
  width: 1100px;
  color: #fead00;
  ul.item {
    // width:1100px;
    li {
      white-space: nowrap;
      float: left;
      margin-right: 10px;
    }
  }
}
</style>
