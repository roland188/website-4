<template>
  <div class="messages">
    <!-- 列表页 -->
    <div v-show="isShowList">
      <template v-if="noticeReqSuccessFlag">
        <!-- 列表 -->
        <div style="height:6rem;overflow:auto; margin-top: 10px;">
          <el-scrollbar style="height:6rem;" ref="multipleTable">
            <div
              class="messageItem cursorPoint noticeInfoBorderColor"
              v-for="(item, i) in noticeDataList"
              :key="i"
              @click="showDetail(item.id)"
            >
              <div class="img">
                <img loading="lazy"
                  style="width:100%;"
                  v-if="item.readFlag != 0"
                  v-lazy="require('@/assets/image/gameImg/nInfoNotice.png')"
                  alt
                />
                <img loading="lazy" style="width:100%;" v-else v-lazy="require('@/assets/image/gameImg/nInfoNoticeUnRead.png')" alt />
              </div>
              <div class="msgContainer">
                <div class="msgTitle themeDark themeDark8">{{ item.subject }}</div>
                <div class="msgContent themeLightColorClass">{{ item.content }}</div>
                <div class="msgTime themeLightColorClass">{{ item.publishedAt | timeSwitch }}</div>
              </div>
            </div>
          </el-scrollbar>
        </div>

        <!-- 底部 -->
        <div class="msgBottom">
          <div class="msgPagination">
            <el-pagination
              :current-page="currentPage"
              :page-size="pageSize"
              :hide-on-single-page="hidePagination"
              layout="pager"
              :total="totalRecords"
              :pager-count="5"
              @current-change="currentChange"
            ></el-pagination>
          </div>
        </div>
      </template>
      <template v-else>
        <!-- 没数据 -->
        <Nothing img="nInfoNoticeIsEmpty" :title="$t('一条公告都没呢') + '...'"></Nothing>
      </template>
    </div>

    <!-- 详情页 -->
    <div v-show="!isShowList">
      <template v-if="JSON.stringify(noticeDetail) != '{}'">
        <div class="msgDetailTitle themeDark themeDark8">{{ noticeDetail.subject }}</div>
        <div
          class="msgDetailTime themeLightColorClass noticeInfoBorderColor"
        >{{ noticeDetail.publishedAt | timeSwitchAll }}</div>
        <div class="msgDetailContent themeLightColorClass">
          <el-scrollbar style="height:100%">{{ noticeDetail.content }}</el-scrollbar>
        </div>
        <div class="msgBottom msgDetailBottom">
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
      noticeDataList: [],
      isShowList: true,
      noticeDetail: {},
      noticeReqSuccessFlag: true, //公告请求有数据
      isClick: false
    };
  },
  props: {
    noticeItem: Object //轮播公告id
  },
  created() {
    if (this.$common.getUser()) {
      this.userId = this.$common.getUser().user_id;
    }
  },
  mounted() {
    this.getNotices();
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
  methods: {
    async getNotices(str) {
      var _this = this;
      var data = {
        createdAt: "",
        currentPage: _this.currentPage,
        pageSize: _this.pageSize,
        publishedAt: "",
        subject: ""
      };
      var res = await _this.$http.post(_this.$api.noticeList, data, true);
      if (res.code == 0) {
        if (str) {
          //实现点击tab，显示列表首页
          this.isShowList = true;
        }

        if (res.data.content.length > 0) {
          _this.noticeReqSuccessFlag = true;
          _this.noticeDataList = res.data.content;
          _this.totalRecords = res.data.totalRecords;
          this.$nextTick(() => {
            _this.$refs.multipleTable.wrap.scrollTop = 0;
          });
        } else {
          _this.noticeReqSuccessFlag = false;
        }
      } else {
        _this.noticeReqSuccessFlag = false;
        this.$message.error(res.msg);
      }
    },
    currentChange(val) {
      this.currentPage = val;
      //请求当前页的数据
      this.getNotices();
    },
    async showDetail(id, noticeItem) {
      if (this.isClick) {
        return;
      }
      this.isClick = true;

      //标记已读
      if (!noticeItem) {
        var item = this.noticeDataList.filter(function(item) {
          return item.id == id;
        });
        if (!item[0].readFlag && this.$store.state.token) {
          await this.markReaded(id);
        }
      } else {
        //点击轮播公告时
        if (this.$store.state.token) {
          //获取userId
          if (this.$common.getUser()) {
            this.userId = this.$common.getUser().user_id;
          }
          await this.markReaded(id);
        }
      }

      //显示详情
      await this.messageDetailInter(id);
    },
    async markReaded(id) {
      //标记已读
      var _this = this;
      var messageIds = [id];
      var data = {
        content: "",
        delFlag: "",
        endAt: "",
        id: "",
        memberId: _this.userId,
        noticeIds: messageIds,
        operator: "",
        publishedAt: "",
        publishedAtType: 0,
        readFlag: 0,
        status: 0,
        subject: ""
      };

      const res = await _this.$http.post(_this.$api.readNotice, data);
      if (res.code == 0) {
        //
        _this.noticeDataList.map(function(item) {
          messageIds.map(function(it) {
            if (item.id == it) {
              item.readFlag = 1;
            }
          });
        });

        // _this.$message.success("公告已读成功!");
        //已读后，更新myPage页面的已读标志
        this.$store.commit("updateUnRead", "notice");
      } else {
        _this.$message.error(res.msg);
      }
    },
    async messageDetailInter(id) {
      //公告详情
      this.isShowList = false;
      let _this = this;
      let data = id;
      const res = await _this.$http.get(_this.$api.noticeInfo, data, true);
      if (res.code == 0) {
        _this.noticeDetail = res.data;

        this.isClick = false;
      } else {
        _this.$message.error(res.msg);
      }
    },
    backToList() {
      this.isShowList = true;
      //详情清空
      this.noticeDetail = {};
    }
  },
  components: {
    Nothing
  },
  watch: {
    "$store.state.swiperNoticeItem": {
      handler(n) {
        if (n) {
          if (n.urlId) {
            //打开优惠轮播banner-公告详情
            this.showDetail(n.urlId, n);
          } else {
            //头部轮播公告
            this.showDetail(n.id, n);
          }
          this.$store.commit("showSwiperNoticeDetail", null);
        }
      },
      immediate: true,
      deep: true
    }
  }
};
</script>
<style scoped>
@import url("../messages/messages.css");
</style>