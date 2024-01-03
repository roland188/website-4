<template>
  <div class="jackPotNew">
    <el-dialog width="1070px" :visible.sync="adVisible" :show-close="false">
      <div class="jkContent">
        <ul class="jkTabs">
          <li v-for="(item, index) in adList" :key="index" :class="{ 'active': index === currentIndex }"
            @click="changeTab(item, index)">
            <i></i>
            <span>{{ item.title }}</span>
          </li>
        </ul>
        <div class="jkHtml">
          <img @click="noticesGo()" v-lazy="$config.imgHost + currentList.picture" />
        </div>
      </div>
      <div class="jkClose" @click="closePop"></div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      adVisible: false,
      isToday: "",
      adList: [],
      currentIndex: 0, //当前tab
      currentList: {} //当前列表
    };
  },
  mounted() {
    this.getGuideAd();
  },
  methods: {
    getGuideAd() {
      let self = this;
      self.$http.get(self.$api.getGuideAd).then((res) => {
        if (res && res.code == 0) {
          self.adList = res.data;
          self.currentList = res.data[0] || {};
          if (res.data.length) self.advertisingShow();
        }
      });
    },
    //弹出逻辑
    advertisingShow() {
      //弹出逻辑,popUpRule为0 1 2 分别对应弹出次数
      let self = this;
      let popUpRule = self.adList[0].popUpRule;
      if (popUpRule === 0) {
        //不弹
        return;
      } else if (popUpRule === 1) {
        //弹一次
        const JpOrAdv = sessionStorage.getItem("JpOrAdv");
        if (!JpOrAdv) {
          let t = localStorage.getItem("isToday");
          if (t) {
            //有时间
            let nowt = new Date().getTime();
            self.isToday = self.$common.isToday(t, nowt);
            if (!self.isToday) {
              self.adVisible = true;
              sessionStorage.setItem("JpOrAdv", true);
            }
          } else {
            //没时间
            self.adVisible = true;
            let timestamp = new Date().getTime();
            localStorage.setItem("isToday", timestamp);
            sessionStorage.setItem("JpOrAdv", true);
          }
        }
      } else if (popUpRule === 2) {
        //每次打开都弹
          self.adVisible = true;
          sessionStorage.setItem("JpOrAdv", true);
      }
    },
    changeTab(item, index) {
      if (index === this.currentIndex) return;
      this.currentIndex = index;
      this.currentList = item;
    },
    // banner图跳转
    noticesGo() {
      let item = this.currentList
      // return
      //1:外链 2:公告 3:活动 4:游戏 5:专题活动
      if (item.type === 1) {
        if (item.url) {
          window.open(item.url)
        }
      } else if (item.type === 2) {
        if (!this.$common.getUser()) {
          // this.$message.warning(this.$t('请先登录'))
          this.$common.openLogin()
          return
        }
        if (item.id) {
          const { href } = this.$router.resolve({
            name: 'news',
            query: {
              isNavActive: 2
            }
          });
          window.open(href, "_blank");
          let items = {
            id: item.id,
          };
          this.$store.commit("showSwiperNoticeDetail", items);
        }
      } else if (item.type === 3) {
        if (item.urlId) {
          // 活动弹窗
          this.closePop();
          this.$parent.$refs.actDetails.openDialog(item.urlId);
        }
      } else if (item.type === 4) {
        if (this.$common.getUser() && item.bannerGame.id) {
          this.getToken(item.bannerGame, 1);
        } else {
          // this.$message.warning(this.$t('请先登录'))
          this.$common.openLogin()
        }
      } else if (item.type === 5) {
        if (item.expand && item.expand.actType == 3) {
          // 双旦活动
          this.jump11(item);
          return;
        }
        if (item.urlId) {
          this.$parent.$refs.actDetails.openDialog(item.urlId, 2);
        }
      } else if (item.type === 6 && (window.projectImgUrl === 'amwnsr' || window.projectImgUrl === 'funw')) {
        if (this.$common.getUser()) {
          this.$router.push('/activation');
        } else {
          // this.$message.warning(this.$t("请先登录"));
          this.$common.openLogin()
        }
      }
      else if (item.type === 7) {
        const needLogin = item.needLogin == 1
        const isLogin = !!this.$common.getUser()
        if (needLogin && !isLogin) {
          // this.$message.warning(this.$t('请先登录'))
          this.$common.openLogin()
          return
        }
        this.$router.push({ path: item.url })
      }
    },
    // 跳转双11
    jump11(item) {
      if (!this.$common.getUser()) {
        // this.$message.warning(this.$t('请先登录'));
        this.$common.openLogin()
        return;
      }
      const obj = {
        activityId: item.urlId,
        token: this.$common.getToken(),
        clientCode: window.clientCode,
        clientItem: window.childCode,
        username: this.$common.getUser().username,
        language: this.$i18n.locale,
        theme: window.theme,
        host: this.$config.baseUrl,
      };
      const str = window.btoa(JSON.stringify(obj));
      // const url = item.expand.actUrl + "/pc/index.html?s=" + str;
      // const url = window.location.origin  + '/func/springFestivalActivities' + "/pc/index.html?s=" + str;
      const url = window.location.origin + '/func/' + item.expand.actFolder + "/pc/index.html?s=" + str;
      window.open(url);
    },
    // 进入游戏
    getToken: async function (req, index) {
      // return
      let self = this;
      var issafariBrowser = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

      if (!self.$common.getUser()) {
        // self.showLogin = true;
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
    closePop() {
      this.adVisible = false;
    }
  },
};
</script>
<style lang="less">
.jackPotNew {
  ::-webkit-scrollbar {
    display: block !important;
    width: 5px;
    height: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #b7a17a;
    border-radius: 5px;
  }

  div {
    box-sizing: border-box;
  }

  .el-dialog {
    background-color: transparent;

    .el-dialog__header {
      padding: 0;
    }

    .el-dialog__body {
      padding: 0;

      .jkContent {
        display: flex;
        justify-content: space-between;
        width: 1070px;
        height: 497px;
        padding: 35px 22px 62px 35px;
        background: url('../../assets/image/pubilc/jk_bg.png');

        .jkTabs {
          width: 338px;
          overflow: auto;

          li {
            cursor: pointer;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            width: 328px;
            height: 50px;
            margin-bottom: 15px;
            padding: 0 25px;
            background: url('../../assets/image/pubilc/jk_tab.png') no-repeat;

            i {
              display: inline-block;
              width: 50px;
              height: 28px;
              margin-right: 6px;
              background: url('../../assets/image/pubilc/jk_icon.png') no-repeat center;
              background-size: contain;
            }

            span {
              font-size: 22px;
              color: #bebebe;
              max-width: 221px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            &.active {
              background: url('../../assets/image/pubilc/jk_tab_active.png') no-repeat;

              i {
                background: url('../../assets/image/pubilc/jk_icon_active.png') no-repeat center;
                background-size: contain;
              }

              span {
                color: #fff;
              }
            }

            &:hover {
              opacity: .9;
            }
          }
        }

        .jkHtml {
          width: 658px;
          height: 396px;
          overflow: auto;
          // border: solid 1px #4a4333;
          // background-color: #fff;
          border-radius: 7px;

          // padding: 10px;
          img {
            width: auto;
            height: auto;
          }
        }
      }

      .jkClose {
        cursor: pointer;
        width: 80px;
        height: 80px;
        margin: 15px auto 0;
        background: url('../../assets/image/pubilc/jk_close.png') no-repeat;

        &:hover {
          opacity: .9;
        }
      }
    }
  }
}
</style>