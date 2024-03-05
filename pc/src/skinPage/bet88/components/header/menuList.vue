<template>
  <div class="menuList">
    <a href="javascript:;" class="logo" :class="gxpjLogo ? 'logo250' : ''" :style="'background-image:url(' +
      ($config.pcLogo
        ? $config.imgHost + $config.pcLogo
        : $common.getTitleImgUrl('Logo')) +
      ')'
      " @click="transgo">
      <!-- hover logo  效果 -->
      <div class="popup-list">
        <div class="top"></div>
        <div class="center">
          <div class="content">
            <div class="item" v-for="(item, i) in popupList" :key="i" @click.stop="openPage(item.id)">
              <img loading="lazy" class="img" v-lazy="item.img" />
              <img loading="lazy" class="imgA" v-lazy="item.imgA" alt />
              <div>{{ item.name }}</div>
            </div>
          </div>
        </div>
        <div class="bottom"></div>
      </div>
    </a>
    <ul class="list" @mouseenter="changeChildList(1)" @mouseleave="changeChildList(2)">
      <li v-for="(item, index) in menue" :key="index" @mouseenter="addChildList(item.children, index, item.id)"
        @click="changeCur(index, item)" :class="flash ? 'flash-' + item.id : 'flash-default-' + item.id">
        {{ item.name }}
        <span :class="[item.id == curIndex ? 'showUnder' : '']" class="underline"></span>
      </li>
      <li v-if="clientCode === 'funw'" @click="goMall">{{ $t('泛游商城') }}</li>
      <li style="position: relative; z-index: 9; lfet: 0; top: 5px" v-show="$common.getUser()">
        <search-item></search-item>
      </li>
    </ul>
    <div class="wrapper" v-show="childSwitch" @mouseenter="changeChildList(1)" @mouseleave="changeChildList(2)">
      <div class="childList">
        <div class="left" v-if="logoIndex != 100">
          <img loading="lazy" v-lazy="$config.getLocaleImg('top-list-left' + logoIndex )" :onError="noImg" alt="" />
        </div>
        <ul class="right">
          <li v-for="(item, index) in childList" :key="index" @click="jump(item)">
            <img loading="lazy" v-lazy="$config.imgHost + item.imgUrl" alt :onerror="noData"
              style="width: 100px; height: 100px; object-fit: contain" />
            <p style="
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              ">
              {{ item.name }}
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import api from "@/utils/api"; //接口名字
import searchItem from "@/components/search/search";
export default {
  name: "menulist",
  components: {
    searchItem,
  },
  data() {
    return {
      flash: false, // 闪烁
      logoIndex: 1,
      noImg: "",
      noData:
        'this.src="' + require("@/assets/image/pubilc/searchlost.png") + '"',
      curIndex: -1,
      childSwitch: false,
      rebateShow: false,
      num: 456,
      gxpjLogo: false, // 新葡京国际logo
      list: [
        // {
        //   name: "捕鱼达人",
        //   id: 7,
        //   type: 3
        // },
        {
          name: this.$t("手机投注"),
          id: 9,
        },
        {
          name: this.$t("优惠活动"),
          id: 10,
        },
        {
          name: this.$t('VIP'),
          id: 13,
          path: "/vipLevel",
        },
      ], // 默认列表
      menue: [
        
      ], //整合列表
      gameList: [],
      isShowRegister: false,
      childList: [], //子列表
      isShowPopupList: false,
      popupList: [
        {
          img: require("../../../../assets/image/qqImg/register.png"),
          imgA: require("../../../../assets/image/qqImg/registerA.png"),
          name: this.$t("免费注册"),
          id: 0,
        },
        {
          img: require("../../../../assets/image/qqImg/Backwater.png"),
          imgA: require("../../../../assets/image/qqImg/BackwaterA.png"),
          name: this.$t("我的返水"),
          id: 1,
        },
        {
          img: require("../../../../assets/image/qqImg/Discount.png"),
          imgA: require("../../../../assets/image/qqImg/DiscountA.png"),
          name: this.$t("活动优惠"),
          id: 2,
        },
        {
          img: require("../../../../assets/image/qqImg/deposit.png"),
          imgA: require("../../../../assets/image/qqImg/depositA.png"),
          name: this.$t("在线存款"),
          id: 3,
        },
        // {
        //   img: require("../../../../assets/image/qqImg/agent.png"),
        //   imgA: require("../../../../assets/image/qqImg/agentA.png"),
        //   name: "加入代理",
        //     id:4
        // },
        {
          img: require("../../../../assets/image/qqImg/server.png"),
          imgA: require("../../../../assets/image/qqImg/serverA.png"),
          name: this.$t("在线客服"),
          id: 5,
        },
      ],
      clientCode: window.projectImgUrl,
    };
  },
  mounted() {
    setInterval(() => {
      this.flash = !this.flash;
    }, 500);
    this.getGameMenuListData();
    // this.getSettings();
    if (window.projectImgUrl == "jryl") {
      //只有巨人娱乐才有积分商城这个选项
      this.popupList.push({
        img: require("../../../../assets/image/qqImg/mall.png"),
        imgA: require("../../../../assets/image/qqImg/mallA.png"),
        name: this.$t("积分商城"),
        id: 6,
      });
    }
    if (window.clientCode == "gxpj") {
      this.gxpjLogo = true;
    }
  },
  watch: {
    "$route.query": {
      handler(val) {
        if (val.pid) {
          if (val.id === "100010001") {
            this.curIndex = 7;
          } else {
            this.curIndex = val.pid;
          }
        } else {
          this.curIndex = -1;
        }
      },
      immediate: true,
    },
    childList(val) { },
  },
  methods: {
    ...mapMutations(['updateALLMENUE_EXCEPT_FISH']),
    goMall() {
      if (!this.$common.getUser()) {
        this.$common.openLogin()
        // this.$message.warning(this.$t("请登录"));
        return;
      }
      var obj = {};
      obj.host = this.$common.getHost();
      obj.clientCode = window.clientCode;
      obj.clientItem = window.projectImgUrl;
      obj.language = "zh_CN";
      obj.userId = this.$common.getUser().user_id;
      obj.token = this.$common.getToken();
      obj.showdialog = false; //是否点击签到
      const str = JSON.stringify(obj);
      var url = this.$config.codeUrl + "/mall/pc?s=" + window.btoa(str);
      window.open(url, "_blank");
    },
    openPage(i) {
      if (i == 0) {
        //免费注册
        // this.$emit("setregister");
        this.$common.openLogin(true)
      } else if (i == 1) {
        //我的返水
        if (!this.$common.getUser()) {
          // this.$message.warning(this.$t("请先进行登录"));
          this.$common.openLogin()
          return;
        }
        this.$router.push({ path: "/mcenter/returnWater" });
      } else if (i == 2) {
        //活动优惠
        this.$router.push({ path: "/activity" });
      } else if (i == 3) {
        //在线存款
        if (!this.$common.getUser()) {
          // this.$message.warning(this.$t("请先进行登录"));
          this.$common.openLogin()
          return;
        }
        this.$router.push({ path: "/mcenter/recharge" });
      } else if (i == 4) {
        //加入代理
        // this.isShowPopupList = false;
        // this.$router.push({ path: "/agent" });
        window.open(this.$common.getCustomerService(), "_blank");
      } else if (i == 5) {
        //
        if (window.projectImgUrl === "amwnsr") {
          let wnsrUrl = this.$cache.get("wnsrServerUrl");
          window.open(wnsrUrl, "_blank");
        } else {
          window.open(this.$common.getCustomerService(), "_blank");
        }
      } else if (i == 6) {
        window.open("https://jfsc.2022xtyc.com", "_blank");
      }
    },
    getSettings() {
      this.$http.get(this.$api.getSettings, "allowance_on").then((res) => {
        if (res.code === 0) {
          if (res.data.svalue) {
            if (res.data.svalue.allowance_on === 0) {
              this.rebateShow = false;
            } else {
              this.list.push({ name: this.$t("全民返利"), id: 11 });
            }
          } else {
            this.rebateShow = false;
          }
        }
      });
    },
    jump(val) {
      if (val.type == 2) {
        this.getToken(val, 2);
      } else {
        if (val.nameEn == "fishing") {
          val.ids = "100010001";
        }
        let { parentId: pid, ids: id, type, imgUrlOne } = val;
        if (pid == 1) {
          this.$router.push({ path: "/slots", query: { pid, id, type } });
        }else if (pid == 7) {
          this.$router.push({path: "/slot", query: { pid, id: val.ids, type},});
        // this.getToken(val,2)
        } else if (pid === 3) {
          this.$router.push({
            path: "/chess",
            query: { pid, id, type, imgUrlOne },
          });
        }
      }
    },
    transgo() {
      this.$router.push({ path: "/home" });
    },
    changeCur(val, item) {
      // return
      // this.curIndex = val;
      const { ids: id, type, imgUrlOne } = item.children && item.children[0] ? item.children[0] : {}
      this.curIndex = item.id;
      this.childSwitch = false;
      const query = { pid: item.id, id, type, imgUrlOne }
      if (item.id == 1) {
        this.$router.push({
          path: "/slots",
          query
        });
      } else if (item.id == 2) {
        this.$router.push({
          path: "/sport",
          query
        });
      } else if (item.id == 3) {
        this.$router.push({
          path: "/chess",
          query
        });
      } else if (item.id == 4) {
        this.$router.push({
          path: "/lottery",
          query
        });
      } else if (item.id == 5) {
        this.$router.push({
          path: "/casino",
          query
        });
      } else if (item.id == 6 || item.id === 8) {
        this.$router.push({
          path: "/elec",
          query
        });
      } else if (item.id == 7) {
        // this.childSwitch = true;
        // return
        // 捕鱼专用标注
        query.id = item.children[0].ids
        this.$router.push({path: "/slot", query,});
      } else if (item.id == 10) {
        this.$router.push({
          path: "/activity",
        });
      } else if (item.id == 11) {
        if (this.$common.getUser()) {
          this.$store.commit("rebate", true);
        } else {
          // this.$message.error(this.$t("请登录"));
          this.$common.openLogin()
        }
      }else if (item.id == 12) {
        this.$router.push({
          path: "/mall",
        });
      }else if (item.id == 13) {
        if (!this.$common.getUser()) return this.$common.openLogin()
        this.$router.push({
          path: "/vipLevel",
        });
      }else if (item.id == 9) {
        this.$router.push({
          path: "/home",
          query: {
            scroll: this.num++,
          },
        });
        this.$emit("scrollToCode");
      } else {
        this.$router.push({ path: "/home" });
      }
    },
    addChildList(val, index, id) {
      if (id > 6 || !id) {
        id = 100;
      }
      this.logoIndex = id;
      if (val) {
        this.childList = val;
        this.childList.forEach((item, index) => {
          if (item.nameEn == "fishing") {
            this.childList.splice(index, 1);
          }
        });
      } else {
        this.childList = [];
      }
    },
    changeChildList(val) {
      // 1 显示 2 隐藏
      if (val == 1) {
        this.childSwitch = true;                           
      } else {
        this.childSwitch = false;
      }
    },
    getGameMenuListData: async function () {
      let self = this;
      const res = await self.$http.get(self.$api.menusList);
      if (res.code == 0) {
        this.gameList = res.data
        this.gameMenuSort()

        // let sortArr = window.sortArr || [1, 2, 3, 4, 5, 6, 7];
        // let newMenu = [];
        // let item;
        // sortArr.forEach((id) => {
        //   item = res.data.filter((v) => {
        //     return id == v.id;
        //   });
        //   newMenu.push(item[0]);
        // });
        // if (window.projectImgUrl == "xpjgj") {
        //   let newList = this.list.slice(0, 1);
        //   this.list.shift();
        //   newMenu.splice(4, 0, ...newList);
        // }
        // this.menue = newMenu.concat(this.list);
        // this.menue = this.menue.filter((e) => e);
        // console.log("-----列表", this.menue);
        // localStorage.setItem(
        //   "ALLMENUE_EXCEPT_FISH",
        //   JSON.stringify(this.menue)
        // );
        return;
        // 新增捕鱼数据
        this.menue.forEach((item, index) => {
          // 电子游艺
          if (item.id == 1) {
            item.children.forEach((child, index) => {
              if (child.nameEn == "fishing") {
                if (child.type == 1) {
                  self.$http.pnPost(
                    self.$api.vendorGame,
                    {
                      currentPage: 1,
                      pageSize: 9999,
                      gameKindId: item.id,
                      vendorId: child.ids,
                    },
                    true,
                    (result) => { }
                  );
                } else if (child.type == 3) {
                  self.$http.pnPost(
                    self.$api.getGameByIds,
                    {
                      currentPage: 1,
                      pageSize: 9999,
                      gameKindId: item.id,
                      ids: child.ids,
                    },
                    true,
                    (result) => {
                      let list = result.data.data.list;
                      list = list.map((item) => {
                        return {
                          ...item,
                          flag: true,
                        };
                      });
                      this.menue.push({
                        name: "捕鱼",
                        children: list,
                        type: 2,
                        id: 7,
                      });
                      localStorage.setItem(
                        "ALLMENUE",
                        JSON.stringify(this.menue)
                      );
                      var arr = this.menue;
                      var obj = {};
                      for (var i = 0; i < arr.length; i++) {
                        obj[arr[i].id] = arr[i];
                      }
                      localStorage.setItem("ALLMENUE_OBJ", JSON.stringify(obj));
                    }
                  );
                }
              }
              // if(child.type==1){
              //     promiseList.push(new Promise((resolve,reject)=>{
              //       self.$http.pnPost(self.$api.vendorGame, {
              //             currentPage: 1,
              //             pageSize: 9999,
              //             gameKindId: item.id,
              //             vendorId: child.ids,
              //       }, true,(res)=>{resolve(res.data.data.list)})
              //     }))
              // }else if(child.type==3){
              //   promiseList.push(new Promise((resolve,reject)=>{
              //        self.$http.pnPost(self.$api.getGameByIds, {
              //              currentPage: 1,
              //              pageSize: 9999,
              //              gameKindId: item.id,
              //              ids: child.ids,
              //       }, true,(res)=>{resolve(res.data.data.list)})
              //   }))
              // }

              // Promise.all(promiseList).then((res)=>{
              // })
            });
          }
        });
      } else {
        this.$message.error(res.msg);
      }
    },
    // 游戏菜单排序
    gameMenuSort() {
      const menuArr = [
        {
          id: 2,
          // iconUrl: require('@/static/img/index/ty-icon.png'),
          title: this.$t('体育赛事')
        },
        {
          id: 5,
          // iconUrl: require('@/static/img/index/sx-icon.png'),
          title: this.$t('真人视讯')
        },
        {
          id: 6,

          title: this.$t('电竞赛事')
        },
        {
          id: 4,
          // iconUrl: require('@/static/img/index/cp-icon.png'),
          title: this.$t('彩票游戏')
        },
        {
          id: 3,
          // iconUrl: require('@/static/img/index/qp-icon.png'),
          title: this.$t('棋牌游戏')
        },
        {
          id: 1,
          // iconUrl: require('@/static/img/index/dz-icon.png'),
          title: this.$t('电子捕鱼')
        },
        {
        	id: 7,
        	// iconUrl: require('@/static/img/index/by-icon.png'),
        	title: '捕鱼游戏'
        },
        {
        	id: 8,
        	// iconUrl: require('@/static/img/index/by-icon.png'),
        	title: '斗鸡'
        }
      ]
      menuArr.forEach(a => {

        const obj = this.gameList.find(b => b.id == a.id)
        if (obj) {
          Object.assign(a, obj)
        }
      })
      let menueList = []
      if (window.projectImgUrl !== 'bqty') {
        menueList = menuArr.sort((pre, cur) => pre.sort - cur.sort);
      } else {
        menueList = menuArr
      }


      // if(window.projectImgUrl==='bqty'){
      //   menueList.sort((a, b) => {
      //     if (a.id === 2) {
      //       return -1; // a排在最前面
      //     } else if (b.id === 2) {
      //       return 1; // b排在最前面
      //     }
      //     return 0; // 保持原有顺序
      //   });
      // }
      this.menue = [...menueList, ...this.list].filter(o => o.name)
      this.menue.push({ name: this.$t("积分商城"), id: 12 });
      localStorage.setItem(
        "ALLMENUE_EXCEPT_FISH",
        JSON.stringify(this.menue)
      );
      this.updateALLMENUE_EXCEPT_FISH(this.menue)
      // this.menue = menuArr.sort((pre, cur) => pre.sort - cur.sort);
      // this.menue = newMenu.concat(this.list);
      // this.navList = menuArr;
    },
    // 进入游戏
    getToken: async function (req, index) {
      // return
      let self = this;
      var issafariBrowser =
        /Safari/.test(navigator.userAgent) &&
        !/Chrome/.test(navigator.userAgent);

      if (!self.$common.getUser()) {
        // self.showLogin = true;
        // self.$message.warning(this.$t("请登录"));
        self.$common.openLogin()
        return;
      }
      self.tenantId = self.$common.getUser().tenant_id;
      self.username = self.$common.getUser().username;
      self.uid = self.$common.getUser().user_id;
      let datas = {
        tenantId: self.tenantId,
        username: self.username,
        gameId: index == 2 ? req.ids : req.id,
        clientIp: self.$config.clientIp,
        memberId: self.uid,
        terminalType: 1,
      };
      self.$common.setGameRequestData(datas);

      const res = await self.$http.post(api.getToken, datas, true);
      if (res.code == 0) {
        self.gameUrl = res.data;
        if (req.openMode === 1) {
          if(req.name == 'CMD') return window.location.href = self.gameUrl
          window.open(self.gameUrl);
        } else {
          if(req.name == 'CMD') return window.location.href = self.gameUrl
          window.open(self.gameUrl);
        }
      } else {
        if (req.openMode === 1) {
          window.open("/error.html?type=1");
          // self.winOpen.location.href = '/error.html?type=1';
        }

        if (req.status === 0) {
          self.$message.error(this.$t("维护中"));
        } else {
          self.$message.error(this.$t("进入游戏失败，请稍后重试"));
        }
      }
    },
  },
};
</script>
<style lang="less" scoped>
.menuList {
  position: relative;
  width: max-content !important;
  height: 76px;
  z-index: 999;
  display: flex;
  justify-content: center;

  .logo {
    width: 160px;
    height: 90px;
    float: left;
    position: relative;
    top: -15px;
    left: 10px;
    transform: scale(1.2);
    background-repeat: no-repeat;
    background-size: contain;
    background-position: 50%;

    .popup-list {
      display: none;
    }
  }

  .logo250 {
    // 新葡京国际logo
    width: 250px !important;
  }

  .logo:hover>.popup-list {
    display: block;
  }

  .list {
    // width: 1350px;
    margin-left: 40px;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;

    li {
      position: relative;
      min-width: 90px;
      color: white;
      float: left;
      cursor: pointer;
      text-align: center;
      font: 16px/50px normal;
      height: 76px;
      padding: 0 10px;
      box-sizing: border-box;
      .underline {
        position: absolute;
        left: 50%;
        bottom: 26px;
        transform: translateX(-50%);
        width: 20px;
        height: 3px;
        border-radius: 2px;
        background: #efc77a;
        display: none;
      }

      .showUnder {
        display: block;
      }

      &:hover {
        color: orange;
      }

      &:hover .underline {
        display: block;
      }
    }
  }

  .wrapper {
    position: absolute;
    left: -360px;
    top: 76px;
    background-color: #000;
    width: 1920px;
    z-index: 98;

    .childList {
      position: relative;
      left: 50%;
      top: 0;
      transform: translateX(-50%);
      width: 1200px;
      background-color: red;
      z-index: 9999;

      .left {
        padding-bottom: 20px;
        float: left;
        width: 180px;
        // height: 200px;
        // background-color: blue;
      }

      .right {
        width: 1000px;
        float: right;
        padding-bottom: 20px;

        li {
          float: left;
          margin: 0 10px;
          width: 100px;
          cursor: pointer;
          font: 14px/36px normal;
          text-align: center;

          &:hover {
            color: orange;
          }
        }
      }
    }
  }

  .popup-list {
    position: absolute;
    top: 70px;
    left: 0px;
    width: 400px;
    padding-top: 20px;

    .top {
      position: relative;
      height: 20px;
      background: url("../../../../assets/image/qqImg/bg_site_top01.png") 50% 0 no-repeat;
      border: none;
    }

    .center {
      position: relative;
      background: url("../../../../assets/image/qqImg/bg_site_y01.png") 50% 0 repeat-y;
      border: none;
      padding-top: 0;

      .content {
        width: 360px;
        margin: 0 auto;
        display: flex;
        flex-wrap: wrap;

        .item {
          width: 80px;
          //   height: 108px;
          margin-right: 60px;

          img {
            flex-shrink: 0;
            width: 100%;
          }

          .img {
            display: block;
          }

          .imgA {
            display: none;
          }
        }

        .item:hover {
          .img {
            display: none;
          }

          .imgA {
            display: block;
          }
        }

        .item:nth-child(3n) {
          margin-right: 0;
        }
      }
    }

    .bottom {
      height: 20px;
      background: url("../../../../assets/image/qqImg/bg_site_bottom01.png") 50% 0 no-repeat;
      border: none;
    }
  }
}

.flash-default-5,
.flash-default-8 {
  color: #fde9aa !important;
}

// .flash-1 {
//   color: #56ff5e !important;
// }

// .flash-3 {
//   color: #f947f3 !important;
// }

.flash-5 {
  color: #2799f1 !important;
}

.flash-8 {
  color: #56ff5e !important;
}
</style>
