<template>
  <div class="messages">
    <!-- 列表页 -->
    <div v-show="isShowList">
      <template v-if="messageReqSuccessFlag">
        <!-- 列表 -->

        <div style="height:6rem;overflow:auto;margin-top: 10px;">
          <el-scrollbar style="height:6rem;" ref="multipleTable">
            <div
              class="messageItem cursorPoint noticeInfoBorderColor"
              v-for="(item, i) in messageDataList"
              :key="i"
              @click="showDetail(item.id)"
            >
              <div class="img">
                <img loading="lazy" v-if="item.readFlag != 0" v-lazy="require('@/assets/image/gameImg/nInfoMsg.png')" alt />
                <img loading="lazy" v-else v-lazy="require('@/assets/image/gameImg/nInfoMsgUnRead.png')" alt />
              </div>
              <div class="msgContainer">
                <div class="msgTitle themeDark themeDark8">{{ item.subject }}</div>
                <div class="msgContent themeLightColorClass" v-html=" item.content "></div>
                <div class="msgTime themeLightColorClass">{{ item.publishedAt | timeSwitch }}</div>
              </div>
            </div>
          </el-scrollbar>
        </div>

        <!-- 底部 -->
        <div class="msgBottom">
          <div
            class="allDelete allBtn u-flex-all cursorPoint loginBtnStyle"
            @click="deleteAllMsgs"
          >{{ $t('全部删除') }}</div>
          <div
            class="allBtn u-flex-all registerBtnStyle registerBtnStyle8"
            :class="needMarkReaded ? 'allReaded cursorPoint' : 'allReadedDisable'"
            @click="markAllRead"
          >{{ $t('全部已读') }}</div>
          <div class="msgPagination">
            <el-pagination
              :current-page="currentPage"
              :page-size="pageSize"
              :hide-on-single-page="hidePagination"
              layout="pager"
              :total="totalRecords"
              :pager-count="5"
              @size-change="sizeChange"
              @current-change="currentChange"
            ></el-pagination>
          </div>
        </div>
      </template>
      <template v-else>
        <!-- 没数据 -->
        <Nothing img="nInfoMsgIsEmpty" :title="$t('一条通知都没呢') + '...'"></Nothing>
      </template>
    </div>

    <!-- 详情页 -->
    <div v-show="!isShowList">
      <template v-if="JSON.stringify(messageDetail) != '{}'">
        <div class="msgDetailTitle themeDark themeDark8">{{ messageDetail.subject }}</div>
        <div
          class="msgDetailTime themeLightColorClass noticeInfoBorderColor"
        >{{ messageDetail.publishedAt | timeSwitchAll }}</div>
        <div class="msgDetailContent themeLightColorClass">
          <el-scrollbar style="height:100%" v-html="messageDetail.content"></el-scrollbar>
        </div>
        <div class="msgBottom msgDetailBottom">
          <div
            class="detailDelete allBtn u-flex-all cursorPoint loginBtnStyle"
            @click="deleteMessage(messageDetail.id)"
          >{{ $t('删除') }}</div>
          <div
            class="backToList allBtn u-flex-all cursorPoint registerBtnStyle registerBtnStyle8"
            @click="backToList()"
          >{{ $t('返回') }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Nothing from "../../../components/nothing/nothing";
export default {
  name: "messages",
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      totalRecords: 0,
      //只有一页时，隐藏分页器
      hidePagination: false,
      messageDataList: [],
      isShowList: true,
      messageDetail: {},
      messageReqSuccessFlag: true, //默认请求有数据
      isScrollTop: false,
      isClick: false //是否点击了（跳转详情）
    };
  },
  filters: {
    timeSwitch(val) {
      if (val) {
        var date = new Date(val); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + ".";
        var M =
          (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + ".";
        var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var time = Y + M + D;
        return time;
      }
    },
    timeSwitchAll(val) {
      if (val) {
        var date = new Date(val); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + "-";
        var M =
          (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-";
        var D =
          (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
        var h =
          (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
          ":";
        var m =
          (date.getMinutes() < 10
            ? "0" + date.getMinutes()
            : date.getMinutes()) + ":";
        var s =
          date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        var time = Y + M + D + h + m + s;
        return time;
      }
    }
  },
  props: {
    curPage: Number
  },
  mounted() {
    this.getMessages();
  },
  methods: {
    async getMessages(str) {
      var _this = this;
      var data = {
        currentPage: _this.currentPage,
        pageSize: _this.pageSize,
        receiverType: 0
      };
      var res = await _this.$http.post(_this.$api.message, data, true);
      if (res.code == 0) {
        //实现点击tab，显示列表首页
        if (str) {
          this.isShowList = true;
        }

        if (res.data.content.length > 0) {
          _this.messageReqSuccessFlag = true;
          _this.messageDataList = res.data.content;
          _this.totalRecords = res.data.totalRecords;

          this.$nextTick(() => {
            _this.$refs.multipleTable.wrap.scrollTop = 0;
          });
        } else {
          _this.messageReqSuccessFlag = false;
        }
      } else {
        _this.messageReqSuccessFlag = false;
        _this.$message.error(res.msg);
      }
    },
    currentChange(val) {
      this.currentPage = val;
      this.getMessages();
    },
    async deleteAllMsgs() {
      var _this = this;
      var messageIds = this.messageDataList.map(function(item) {
        return item.id;
      });
      //请求数据
      var data = {
        messageIds: messageIds,
        type: 0
      };
      var res = await _this.$http.deleteArray(_this.$api.deleteMessages, data);
      if (res.code == 0) {
        //删除成功
        //刷新页面
        _this.$message.success(_this.$t('通知删除成功'));
        _this.currentPage--;
        _this.getMessages();
        //更新tab上通知的数量
        this.$store.commit("updateMsgTotal", true);
      } else {
        _this.$message.error(res.msg);
      }
    },
    markAllRead() {
      //全部标记已读
      //若全部已读，退出
      if (!this.needMarkReaded) {
        return;
      }
      var messageIds = this.messageDataList.map(function(item) {
        return item.id;
      });
      this.markReaded(messageIds);
    },
    sizeChange() {},
    async showDetail(id) {
      if (this.isClick) {
        return;
      }

      this.isClick = true;
      //标记已读
      var item = this.messageDataList.filter(function(item) {
        return item.id == id;
      });
      if (!item[0].readFlag) {
        await this.markReaded(id);
      }

      //显示详情
      await this.messageDetailInter(id);
    },
    async markReaded(id) {
      //标记已读
      var _this = this;
      var messageIds = typeof id == "number" ? [id] : id;
      var data = {
        messageIds: messageIds,
        type: 0
      };
      const res = await _this.$http.put(_this.$api.readMessages, data);
      if (res.code == 0) {
        //手动更新已读
        _this.messageDataList.map(function(item) {
          messageIds.map(function(it) {
            if (item.id == it) {
              item.readFlag = 1;
            }
          });
        });

        if (typeof id == "object") {
          _this.$message.success(_this.$t('通知全部已读成功'));
        }

        //已读后，更新myPage页面的已读标志
        _this.$store.commit("updateUnRead", "message");
      } else {
        _this.$message.error(res.msg);
      }
    },
    async messageDetailInter(id) {
      //站内信详情
      var _this = this;
      _this.isShowList = false;
      var data = id;
      const res = await _this.$http.get(_this.$api.messageInfo, data, true);
      if (res.code == 0) {
        _this.messageDetail = res.data;

        _this.isClick = false;
      } else {
        _this.$message.error(res.msg);
      }
    },
    async deleteMessage(id) {
      var _this = this;
      //请求数据
      var data = "0/" + id;
      var res = await _this.$http.delete(_this.$api.deleteMessage, data);
      if (res.code == 0) {
        //删除成功
        _this.$message.success(_this.$t('通知删除成功'));
        //刷新页面
        if (this.messageDataList.length > 1) {
          _this.getMessages();
        } else {
          _this.currentPage--;
          _this.getMessages();
        }

        //回到列表页
        _this.backToList();

        //更新tab上通知的数量
        _this.$store.commit("updateMsgTotal", true);
      } else {
        _this.$message.error(res.msg);
      }
    },
    backToList() {
      this.isShowList = true;
      //详情清空
      this.messageDetail = {};
    }
  },
  computed: {
    needMarkReaded() {
      //只要有一个未读，显示全部已读
      return this.messageDataList.some(function(item) {
        return item.readFlag == 0;
      });
    }
  },
  components: {
    Nothing
  },
  watch: {
    curPage(n) {
      if (n) {
        //每次打开，默认请求第一页数据
        this.currentPage = 1;
        this.getMessages();
      }
    }
  }
};
</script>
<style scoped>
@import url("./messages.css");
</style>
<style>
.messages .el-pager li {
  min-width: 20px !important;
  color: #f4f4f4 !important;
}
.messages .el-pager li.active {
  color: #54b9ff !important;
}
.messages .el-pager li:hover {
  color: #54b9ff !important;
}
.messages .el-scrollbar__wrap {
  overflow-x: hidden;
  padding-right: 0.2rem;
}
.messages .el-scrollbar__thumb {
  background-color: #000 !important;
}
.messages .el-scrollbar__bar.is-vertical {
  background: #f4f4f4;
}
</style>
