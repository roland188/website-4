<template>
  <div class="actDetail">
    <el-dialog custom-class="actDetailDialog" :visible.sync="isDialogShow" width="900px" :show-close="isShowClose"
      :before-close="closeDialog" :modal-append-to-body="false">
      <!-- 头部 -->
      <div slot="title" class="alertHeader themeColorkBgc">
        <img loading="lazy" class="close-img cursorPoint" v-lazy="require('@/assets/image/gameImg/login-close2.png')"
          @click="closeDialog" />
        <div class="alertTitle themeWhiteColorClass">{{ title }}</div>
      </div>

      <!-- 头部 -->
      <div class="actDetailHeader">
        <div class="themeDark" style="color: rgb(226, 210, 125);font-size: 20px;font-weight:600">{{$t('活动详情')}}</div>
        <div class="actDetailTime">
          <!-- 限时活动才显示时间 -->
          <div class="actPublishTime u-flex-a themeLightColorClass" v-if="forever == 0">{{ time }}</div>
          <div class="actRemainTime" :class="forever == 1 ? 'actTypeLong' : 'actTypeShort'">{{ forever == 1 ? $t("永久活动") :
            $t("限时活动") }}</div>
        </div>
      </div>
      <!-- 内容 -->
      <div class="actDetailBody">
        <div class="content">
          <el-scrollbar style="height:100%;" ref="scroll">
            <div class="innerContent" id="innerContent"></div>
          </el-scrollbar>
        </div>
      </div>
      <!-- 底部按钮 -->
      <div class="actDetailFooter" id="actDetailFooter">
        <!-- 站内活动 -->
        <template v-if="type != 2">
          <!-- 立即参与 -->
          <!-- 活动生效，立即参与 -->
          <template v-if="!auditStatus && typeof auditStatus == 'object' && isEffect">
            <div class="u-flex-all">
              <div class="actDetailBtn registerBtnStyle8 cursorPoint" @click="partIn()">{{$t('立即参与')}}</div>
            </div>
          </template>
          <!-- 进行中 -->
          <template v-if="typeof auditStatus == 'number'">
            <template v-if="auditStatus == 0 && status == 0">
              <div class="actComplete" style="display:flex;margin-bottom:0.05rem;">
                {{$t('活动完成情况：')}}
                <span class="themeLightColorClass">{{$t('进行中')}}</span>
              </div>
            </template>
            <template v-if="auditStatus == 0 && status == 10">
              <div class="actComplete" style="display:flex;margin-bottom:0.05rem;">
                {{$t('活动完成情况：')}}
                <span class="themeLightColorClass">{{$t('未完成')}}</span>
              </div>
            </template>
            <template v-if="auditStatus == 1 && status == 0">
              <div class="actComplete" style="display:flex;margin-bottom:0.05rem;">
                {{$t('活动完成情况：')}}
                <span class="themeLightColorClass">{{$t('等待审核')}}</span>
              </div>
            </template>
            <template v-if="auditStatus == 1 && (status == 5 || status == 6)">
              <div class="actComplete" style="display:flex;margin-bottom:0.05rem;">
                {{$t('活动完成情况：')}}
                <span class="themeLightColorClass">{{$t('已完成，奖励已发放至中心钱包')}}</span>
              </div>
            </template>
            <div v-if="activityCompletionArr.length > 0">
              <div class="actMoney" style="display:flex;flex-wrap:wrap;margin-bottom:0.2rem;">
                <div style="display:flex;" v-for="(item, i) in activityCompletionArr" :key="i">
                  <div class="totalDeposit u-flex-all">{{ item[0] }}：</div>
                  <div class="totalDepositMoney u-flex-all" style="margin-right:0.40rem;" v-if="item[0] != '局数'">
                    <div style="margin-right:0.05rem;"></div>
                    <div>{{ $common.setNumFixed(item[1], 2) }}</div>
                  </div>
                  <!-- 局数 -->
                  <div class="totalDepositMoney u-flex-all" style="margin-right:0.40rem;" v-else>
                    <div>{{ item[1] }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="u-flex-all">
              <div class="actDetailBtn registerBtnStyle8 cursorPoint" v-if="actRecordsList && actRecordsList.length > 0"
                @click="openActRecords">{{$t('查看活动记录')}}</div>
            </div>
          </template>

          <!-- 活动截止 -->
          <!-- 未参与，活动截止 -->
          <template v-if="!auditStatus && typeof auditStatus == 'object' && !isEffect">
            <div class="actComplete" style="display:flex;margin-bottom:0.1rem;">{{$t('活动已截止')}}</div>
            <div v-if="activityCompletionArr.length > 0">
              <div class="actMoney" style="display:flex;flex-wrap: wrap;margin-bottom:0.2rem;">
                <div style="display:flex;" v-for="(item, i) in activityCompletionArr" :key="i">
                  <div class="totalDeposit u-flex-all">{{ item[0] }}：</div>
                  <div class="totalDepositMoney u-flex-all" style="margin-right:0.40rem;">
                    <div style="margin-right:0.05rem;"></div>
                    <div>{{ $common.setNumFixed(item[1], 2) }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="u-flex-all">
              <div class="actDetailBtn registerBtnStyle8 cursorPoint" v-if="actRecordsList && actRecordsList.length > 0"
                @click="openActRecords">{{$t('查看活动记录')}}</div>
            </div>
          </template>
        </template>
        <!-- 咨询客服领取 -->
        <template v-if="type == 2">
          <div class="u-flex-all">
            <div class="actDetailBtn registerBtnStyle8 cursorPoint" @click="toCustomerService">{{$t('咨询客服领取')}}</div>
          </div>
        </template>
        <!-- 跳转活动 -->
        <template v-if="isShow == 1">
          <div class="u-flex-all">
            <div class="actDetailBtn registerBtnStyle8 cursorPoint" @click="toActivity(jumpType)">{{$t('点击此处参加活动')}}</div>
          </div>
        </template>
      </div>
    </el-dialog>
    <ActRecords ref="actRecords"></ActRecords>
  </div>
</template>
<script>
import ActRecords from "../../components/actRecords/actRecords";
export default {
  name: "actDetail",
  props:['isShowActDetail'],
  data() {
    return {
      isDialogShow: false,
      isShowClose: false,
      userId: "",
      title: "",
      time: "",
      forever: 0,
      type: 0,
      status: 0, //活动完成状态
      auditStatus: 0, //活动参与状态
      isEffect: true, //默认活动未截止
      isShow: 0,//是否显示活动按钮
      bannerGame: '',
      jumpType: '',
      urlId: '',
      actFolder: '',
      activityId: "",
      activityCompletionArr: [],
      actRecordsList: [],
      scrollTop: 0,
      acDataList: [],
    };
  },
  created() {
    if (['amwnsr','xpjgj','amxpj','funw'].includes(window.projectImgUrl)) {
      import("@/assets/css/actDetail.css");
    }
    if (this.$common.getUser()) {
      this.userId = this.$common.getUser().user_id;
    }
  },
  methods: {
    openDialog(id, appActDetailId) {
      this.isDialogShow = true;
      this.getActDetail(id, appActDetailId);
    },
    closeDialog() {
      this.isDialogShow = false;
      this.$parent.activityId = -1;
      this.$parent.isDisabledScroll = false;
      this.$emit('update:isShowActDetail',false)
      this.$refs.scroll.wrap.scrollTop = 0 //初始化滚动条位置
    },
    async getActDetail(id, appActDetailId) {
      var _this = this;
      var data = id;
      if (appActDetailId == 1) {
        var res = await _this.$http.get(_this.$api.appActDetail, data, true);
      } else if (appActDetailId == 2) {
        var res = await _this.$http.get(_this.$api.getThematicActivitiesByApp + '/', id, true);  //app端专题活动详情
      } else {
        var res = await _this.$http.get(_this.$api.activityInfo, data, true);
      }
      if (res.code == 0) {
        this.acDataList = res.data;
        this.title = this.acDataList.name;
        this.type = this.acDataList.type;
        this.isShow = this.acDataList.isShow;
        this.bannerGame = this.acDataList.bannerGame;
        this.jumpType = this.acDataList.jumpType;
        this.urlId = this.acDataList.urlId;
        if (this.jumpType == 5) this.actFolder = this.acDataList.expand.actFolder;
        switch (this.type) {
          case "0":
            var startTime = this.acDataList.validStartTime;
            var endTime = this.acDataList.validEndTime;
            break;
          default:
            var startTime = this.acDataList.startTime;
            var endTime = this.acDataList.endTime;
            break;
        }

        //转化时间格式
        startTime = this.switchTime(startTime);
        endTime = this.switchTime(endTime);

        this.time = startTime + " - " + endTime;

        var innerContent = document.querySelector("#innerContent");
        //type=3时，url为空，content显示responseFields
        if (
          this.acDataList.activityExtensionsVo &&
          !this.acDataList.activityExtensionsVo.url
        ) {
          innerContent.innerHTML = this.acDataList.activityExtensionsVo.responseFields;
        } else {
          innerContent.innerHTML = this.acDataList.rules;
        }
        if (this.acDataList.intro && appActDetailId == 2) { //专题活动内容
          innerContent.innerHTML = this.acDataList.intro;
          innerContent.style.color = '#444'
        }
        this.forever = this.acDataList.forever;
        this.status = this.acDataList.status;
        this.auditStatus = this.acDataList.auditStatus;
        this.activityId = this.acDataList.activityId;
        this.isEffect = this.acDataList.isEffect;
        var activityCompletion = this.acDataList.activityCompletion;
        this.actRecordsList = this.acDataList.list;
        this.activityCompletionArr = [];
        if (activityCompletion && JSON.stringify(activityCompletion) != "{}") {
          for (const k in activityCompletion) {
            this.activityCompletionArr.push({ 0: k, 1: activityCompletion[k] });
          }
        }

        this.getFooterHeight();
      } else {
        this.$message.error(res.msg);

        this.getFooterHeight();
      }
    },
    toCustomerService() {
      if (['vi'].includes(window.locale)) { // betcome直接跳客服窗口
        const url = this.$common.getCustomerService();
        window.open(url, "_blank");
        return;
      }
      //新旧客服判断
      if (window.customerServiceStatus == 1) {  //新客服
        var obj = {};
        obj.host = this.$common.getHost();
        obj.clientCode = window.clientCode;
        obj.clientItem = window.childCode;
        obj.username = this.$common.getUser() && this.$common.getUser().username;
        obj.language = this.$i18n.locale;
        obj.theme = window.theme;
        obj.projectImgUrl = window.projectImgUrl;
        obj.orgin = window.location.origin + "/activity";
        var str = JSON.stringify(obj);
        str = window.btoa(str);
        let url = location.origin + "/func" + "/customerService/pc?s=" + str;
        window.open(url, "_blank");
      } else { //旧客服
        const url = this.$common.getCustomerService();
        window.open(url, "_blank");
      }
    },
    async partIn() {
      //点击立即参与
      var _this = this;
      if (!_this.$common.isLogin()) {
        //未登录
        this.closeDialog();
        // this.$message({
        //   message: $t("请先进行登录"),
        //   type: "warning"
        // });
        this.$common.openLogin()
      } else {
        //已登录
        var params = {
          memberId: this.userId,
          activityId: this.activityId
        };
        var res = await this.$http.putUrl(_this.$api.joinAct, params);
        if (res.code == 0) {
          //参与成功后，重新请求actDetail
          this.getActDetail(this.activityId);

          this.$notify({
            iconClass: "success",
            message: $t("活动参与成功"),
            customClass: "myNotify",
            showClose: false,
            duration: 3000
          });
        }
      }
    },
    actIng() {
      //点击进行中
      this.$notify({
        message: $t("活动正在进行"),
        customClass: "myNotify",
        showClose: false,
        duration: 3000
      });
    },
    openActRecords() {
      this.$refs.actRecords.openDialog(this.actRecordsList);
    },
    add0(val) {
      return val < 10 ? "0" + val : val;
    },
    switchTime(val) {
      if (val) {
        var date = new Date(val); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear();
        var M = this.add0(date.getMonth() + 1);
        var D = this.add0(date.getDate());
        var h = this.add0(date.getHours());
        var m = this.add0(date.getMinutes());
        var s = this.add0(date.getSeconds());
        var time = Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
        return time;
      } else {
        return "--/--";
      }
    },
    getStyle(obj, attr) {
      if (obj.currentStyle) {
        return obj.currentStyle[attr];
      } else {
        return document.defaultView.getComputedStyle(obj, null)[attr];
      }
    },
    getFooterHeight() {
      var _this = this;
      this.$nextTick(() => {
        var bodyHeight = document.querySelector(
          ".actDetailDialog .el-dialog__body"
        ).offsetHeight;
        var headerHeight = document.querySelector(".actDetailHeader")
          .offsetHeight;
        var footerHeight = document.getElementById("actDetailFooter")
          .offsetHeight;
        var padding = _this.getStyle(
          document.querySelector(".actDetailDialog .el-dialog__body"),
          "padding"
        );
        var paddingH =
          parseFloat(padding.split(" ")[0]) + parseFloat(padding.split(" ")[2]);
        var contentHeight = bodyHeight - headerHeight - footerHeight - paddingH;

        //动态设置content高度
        document.querySelector(".content").style.height = contentHeight + "px";
      });
    },
    // 进入活动
    toActivity(type) {
      switch (type) {
        case 1:
          window.open(this.acDataList.url)
          break;
        case 4:
          if (this.$common.getUser()) {
            this.getToken(this.bannerGame, 1);
          } else {
            // this.$message.warning($t('请先登录'))
            this.$common.openLogin()
          }
          break
        case 5:
          // 双旦活动
          this.jump11();
          return;
        case 7:
          const needLogin = this.acDataList.needLogin == 1
          const isLogin = this.$common.isLogin()
          // if (needLogin && !isLogin) return this.$message({
          //   message: $t("请先进行登录"),
          //   type: "warning"
          // });
          if (needLogin && !isLogin) return this.$common.openLogin()
          this.acDataList.url && this.$router.push({ path: this.acDataList.url })
          break;
      }
    },
    // 进入游戏
    getToken: async function (req, index) {
      let self = this;
      if (!self.$common.getUser()) {
        self.$message.warning(self.$t('请登录'))
        return
      }
      let datas = {
        tenantId: self.$common.getUser().tenant_id,
        username: self.$common.getUser().username,
        gameId: index == 2 ? req.ids : req.id,
        clientIp: self.$config.clientIp,
        memberId: self.$common.getUser().user_id,
        terminalType: 1
      }
      self.$common.setGameRequestData(datas)

      const res = await self.$http.post(this.$api.getToken, datas, true)
      if (res.code == 0) {
        self.gameUrl = res.data;
        if (req.openMode === 1) {
          window.open(self.gameUrl)
        } else {
          window.open(self.gameUrl)
        }

      } else {
        if (req.openMode === 1) {
          window.open('/error.html?type=1')
        }

        if (req.status === 0) {
          self.$message.error(self.$t('维护中'))
        } else {
          self.$message.error(self.$t('进入游戏失败，请稍后重试！'))
        }
      }
    },
    jump11() {
      if (!this.$common.getUser()) {
        // this.$message.warning($t('请先登录'));
        this.$common.openLogin()
        return;
      }
      const obj = {
        activityId: this.urlId,
        token: this.$common.getToken(),
        clientCode: window.clientCode,
        username: this.$common.getUser().username,
        language: this.$i18n.locale,
        theme: window.theme,
        host: this.$config.baseUrl,
      };
      const str = window.btoa(JSON.stringify(obj));
      const url = window.location.origin + '/func/' + this.actFolder + "/pc/index.html?s=" + str;
      window.open(url);
    },
  },
  watch: {
    "$store.state.token"(n) {
      if (n) {
        //登录后
        if (this.$common.getUser()) {
          this.userId = this.$common.getUser().user_id;
          // this.getActDetail(this.activityId);
        }
      }
    }
  },
  components: {
    ActRecords
  }
};
</script>
<style lang="less">
// @import '../../assets/css/actDetail.css';
.actDetail {
  position: relative;
  z-index: 2003;

  .alertHeader {
    padding: .5em;
    text-align: center;
    border-top-left-radius: 0.2rem;
    border-top-right-radius: 0.2rem;
    position: relative;
    font-size: 30px;
    background: linear-gradient(#f7c356, #fefdb8);
    /* 标准的语法（必须放在最后） */
  }

  .close-img {
    width: 0.3rem;
    height: 0.3rem;
    position: absolute;
    top: 0.25rem;
    right: 0.2rem;
    transition: 1s;
  }

  .close-img:hover {
    transform: rotate(180deg);
  }

  .alertTitle {
    font-size: 0.36rem !important;
    padding: 0 0.4rem;
  }

  .actDetailHeader {
    text-align: left;
    border-bottom: 0.01rem solid #353535;

    .actDetailTitle {
      font-family: PingFang SC;
      font-size: 0.36rem;
      margin-bottom: 0.13rem;
    }

    .actDetailTime {
      display: flex;
      height: 0.36rem;
      line-height: 0.36rem;
      padding: 0.1rem 0;

      .actPublishTime {
        font-size: 0.14rem;
        font-weight: 500;
        height: 100%;
        margin-right: 0.2rem;
      }

      .actRemainTime {
        height: 100%;
        background: rgba(255, 255, 255, 1);
        border-radius: 0.18rem;
        font-size: 0.21rem;
        font-weight: 500;
        padding: 0 0.16rem;
      }
    }
  }

  .actDetailBody {
    .content {
      padding: 0.24rem 0;
      font-size: 0.16rem;
      font-family: PingFang SC;
      padding-bottom: 20px;
      font-weight: 500;
      height: 400px;
      color: var(--themeLight);
      text-align: left;
      box-sizing: border-box;
      word-break: break-all;
      overflow: auto;
    }

    .loadingText {
      height: 0.14rem;
      line-height: 0.14rem;
      font-size: 0.14rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(102, 102, 102, 1);
    }
  }

  .actDetailFooter {
    position: relative;
    // bottom: 0.4rem;
    color: #fff;
    height: auto;
    padding-top: 0.16rem;
    border-top: 0.01rem solid#353535;
    background-color: #0d0d0d;

    .actComplete {
      width: 100%;
      font-size: 0.18rem;
      font-weight: 700;
      color: var(--themeDark);
      position: relative;

      span {
        font-weight: 400;
      }
    }

    .actMoney {
      align-items: flex-end;
      font-size: 0.14rem;

      >div {
        margin-bottom: 5px;
      }

      .totalDeposit {
        color: var(--themeLight);
      }

      .totalDepositMoney {
        display: flex;
        margin-left: 0.05rem;
        color: var(--themeAssistColor);
      }
    }

    .actDetailBtn {
      text-align: center;
      width: 100%;
      height: 0.67rem;
      line-height: 0.67rem;
      border-radius: 0.36rem;
      font-size: 0.21rem;
      color: #000;
      background: linear-gradient(#f7c356, #fefdb8);
      /* 标准的语法（必须放在最后） */
    }
  }

  >.el-dialog__wrapper {
    .el-dialog {
      border-radius: 0.3rem;
    }
  }

  //el-Dialog样式
  .el-dialog__header {
    padding: 0;
  }

  .el-dialog__body {
    padding: 0.25rem 0.7rem 0.4rem 0.7rem !important;
    // min-height: 600px;
    box-sizing: border-box;
    background-color: #0d0d0d;
    border: 1px solid #efc77a;
    border-bottom-left-radius: 0.2rem;
    border-bottom-right-radius: 0.2rem;
    // color: #fff!important;
  }

  .el-dialog__wrapper {
    overflow: hidden;
  }

  //滚动条
  .el-scrollbar__bar {
    opacity: 1;
  }

  .el-scrollbar__wrap {
    overflow-x: hidden;
    padding-right: 0.2rem;
  }

  .el-scrollbar__thumb {
    background-color: #424242 !important;
  }

  .el-scrollbar__bar.is-vertical {
    background: transparent;
  }
}

//notify样式
.myNotify {
  width: 2.2rem !important;
  left: 50% !important;
  top: 50% !important;
  transform: translate(-50%, -50%) !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.15rem 0.3rem !important;
  background-color: #666 !important;

  .success {
    width: 0.55rem;
    height: 0.39rem;
    background: url("../../assets/image/qqImg/icon-success.png") no-repeat;
    background-size: 100% 100%;
    margin-bottom: 0.1rem;
  }

  .el-notification__content {
    color: white !important;
    font-size: 0.18rem;
  }
}
</style>
