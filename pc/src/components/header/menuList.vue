<template>
  <div class="menuList_content">
    <div class="menuList">
      <ul
        class="list"
        @mouseenter="changeChildList(1)"
        @mouseleave="changeChildList(-1)"
      >
        <li
          class="li"
          v-for="(item, index) in menue"
          :key="index"
          @mousemove="menuMouseMove"
          @mouseenter="addChildList(item.children, index, item.id)"
          :class="[item.id == curIndex ? 'active' : '']"
        >
          <div class="menu-item"
            @click="changeMainCur(index, item)">
            <span :class="'menu-icon' + item.id"></span>
            <span class="menu-label">{{ item.name }}</span>            
            <i class="el-icon-arrow-right el-icon--right menu-arrow" v-if="item.children?.length > 0 ? true : false"></i>
          </div>
          <!-- <span :class="[item.id == curIndex ? 'showUnder' : '']" class="underline"></span> -->
          <div class="wrapper" v-show="childSwitch == index" v-if="item.children?.length > 0 ? true : false" :style="{top: mouseTop + 'px' }">
            <div class="childList">              
              <ul class="right">
                <li v-for="(item, index1) in childList" :key="index1" @click="jump(item)">
                  <img loading="lazy" v-lazy="$config.imgHost + item.imgUrl" alt :onerror="noData"
                    style="width: 0.56rem; height: 0.56rem; object-fit: contain" />
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
        </li>
        <li class="divider" v-if="menue?.length > 0">
        </li>
        <li
          class="li"
          v-for="(item, index) in staticMenus"
          :key="index + '101'"
          @mouseenter="addChildList(item.children, index, item.id)"
          @click="changeCur(index, item)"
          :class="[item.id == curIndex ? 'active' : '']"
        >
          <div class="menu-item">
            <span :class="'menu-icon' + item.id"></span>
            <span class="menu-label">{{ item.name }}</span>            
            <i class="el-icon-arrow-right el-icon--right menu-arrow" v-if="item.children?.length > 0 ? true : false"></i>
          </div>
        </li>
      </ul>
      
    </div>
  </div>
</template>
<script>
import api from "../../utils/api"; //接口名字
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
      childSwitch: -1,
      rebateShow: false,
      num: 456,
      mouseTop: 0,
      gxpjLogo: false, // 新葡京国际logo
      list: [
        // {
        //   name: this.$t("手机投注"),
        //   id: 9,
        // },
        {
          name: this.$t("优惠活动"),
          id: 10,
          path: "/activity",
        },
      ], // 默认列表
      menue: [], //整合列表
      staticMenus: [
        {
          id: 101,
          name: this.$t("首页"),
          path: "/home",
        },
        {
          id: 102,
          name: this.$t("首页"),
          path: "/home",
        },
        {
          id: 103,
          name: this.$t("首页"),
          path: "/home",
        },
        {
          id: 104,
          name: this.$t("首页"),
          path: "/home",
        },
        {
          id: 105,
          name: this.$t("首页"),
          path: "/home",
        },
        {
          id: 106,
          name: this.$t("首页"),
          path: "/home",
        },
        {
          id: 107,
          name: this.$t("首页"),
          path: "/home",
        },
        {
          id: 108,
          name: this.$t("首页"),
          path: "/home",
        },
        {
          id: 109,
          name: this.$t("首页"),
          path: "/home",
        },
        {
          id: 110,
          name: this.$t("首页"),
          path: "/home",
        },
      ],
      gameList: [],
      isShowRegister: false,
      childList: [], //子列表
      isShowPopupList: false,
      popupList: [
        {
          img: require("../../assets/image/qqImg/register.png"),
          imgA: require("../../assets/image/qqImg/registerA.png"),
          name: this.$t("免费注册"),
          id: 0,
        },
        {
          img: require("../../assets/image/qqImg/Backwater.png"),
          imgA: require("../../assets/image/qqImg/BackwaterA.png"),
          name: this.$t("我的返水"),
          id: 1,
        },
        {
          img: this.$config.getLocaleImg("Discount"),
          imgA: this.$config.getLocaleImg("DiscountA"),
          name: this.$t("活动优惠"),
          id: 2,
        },
        {
          img: this.$config.getLocaleImg("deposit"),
          imgA: this.$config.getLocaleImg("depositA"),
          name: this.$t("在线存款"),
          id: 3,
        },
        // {
        //   img: require("../../assets/image/qqImg/agent.png"),
        //   imgA: require("../../assets/image/qqImg/agentA.png"),
        //   name: "加入代理",
        //     id:4
        // },
        {
          img: require("../../assets/image/qqImg/server.png"),
          imgA: require("../../assets/image/qqImg/serverA.png"),
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
    setTimeout(() => {
      this.menue.forEach((item) => {
        if (item.path == this.$route.path) {
          this.curIndex = item.id;
        }
      });
    }, 500);
    // this.getSettings();
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
        }
      },
      immediate: true,
    },
    "$store.state.curMenuIdxFromScroll"(index) {
      //彩金状态
      this.curIndex = this.menue[index].id;
    },
    // "$route":{
    //   handler(val) {
    //     if (val.pid) {
    //       if (val.id === "100010001") {
    //         this.curIndex = 7;
    //       } else {
    //         this.curIndex = val.pid;
    //       }
    //     } else {
    //       this.curIndex = -1;
    //     }
    // },
    childList(val) {},
  },
  methods: {
    goMall() {
      if (!this.$common.getUser()) {
        this.$common.openLogin();
        // this.$message.warning(this.$t("请登录"));
        return;
      }
      var obj = {};
      obj.host = this.$common.getHost();
      obj.clientCode = window.clientCode;
      obj.clientItem = window.projectImgUrl;
      obj.language = this.$i18n.locale;
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
        this.$common.openLogin(true);
      } else if (i == 1) {
        //我的返水
        if (!this.$common.getUser()) {
          // this.$message.warning(this.$t("请先进行登录"));
          this.$common.openLogin();
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
          this.$common.openLogin();
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
          // this.$router.push({ path: "/subgame", query: { pid, id, type } });
          this.$router.push({ path: "/subgame", query: { pid, id, type } });
        } else if (pid == 7) {
          this.$router.push({
            path: "/subgame",
            query: { pid, id: val.ids, type },
          });
          // this.getToken(val,2)
        } else if (pid === 3) {
          this.$router.push({
            path: "/subgame",
            query: { pid, id, type, imgUrlOne },
          });
        }
      }
    },
    transgo() {
      this.$router.push({ path: "/home" });
    },
    changeMainCur(index, item) {
      if(this.$route.path != '/home')
        this.transgo();
      setTimeout(() => {
        if(item.children?.length > 0 || index == 0) {
          this.$store.commit('curScrollFromMenuIdx', index);
          this.curIndex = item.id;
          return;
        }
        this.changeCur(index, item);
      }, 100);
      
    },
    changeCur(val, item) {
      // return
      // this.curIndex = val;
      this.curIndex = item.id;
      const {
        ids: id,
        type,
        imgUrlOne,
      } = item.children && item.children[0] ? item.children[0] : {};
      this.childSwitch = -1;
      const query = { pid: item.id, id, type, imgUrlOne };
      if (item.id == 1) {
        this.$router.push({
          path: "/slots",
          query,
        });
      } else if (item.id == 2) {
        this.$router.push({
          path: "/sport",
          query,
        });
      } else if (item.id == 3) {
        this.$router.push({
          path: "/chess",
          query,
        });
      } else if (item.id == 4) {
        this.$router.push({
          path: "/lottery",
          query,
        });
      } else if (item.id == 5) {
        this.$router.push({
          path: "/casino",
          query,
        });
      } else if (item.id == 6 || item.id === 8) {
        this.$router.push({
          path: "/elec",
          query,
        });
      } else if (item.id == 7) {
        // this.childSwitch = true;
        // return
        // 捕鱼专用标注
        query.id = item.children[0].ids;
        this.$router.push({ path: "/slot", query });
      } else if (item.id == 10) {
        this.$router.push({
          path: "/activity",
        });
      } else if (item.id == 11) {
        if (this.$common.getUser()) {
          this.$store.commit("rebate", true);
        } else {
          // this.$message.error(this.$t("请登录"));
          this.$common.openLogin();
        }
      } else if (item.id == 12) {
        this.$router.push({
          path: "/mall",
        });
      } else if (item.id == 9) {
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
    menuMouseMove(event) {
      this.mouseTop = event.currentTarget.getBoundingClientRect().top;
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
        this.childSwitch = index;
      } else {
        this.childSwitch = -1;
        this.childList = [];
      }
    },
    changeChildList(val) {
      // 1 显示 2 隐藏
      this.childSwitch = val;
    },
    getGameMenuListData: async function () {
      let self = this;
      const res = await self.$http.get(self.$api.menusList);
      if (res.code == 0) {
        this.gameList = res.data;
        this.gameMenuSort();
        this.curIndex = 0;
      } else {
        this.$message.error(res.msg);
      }
    },
    // 游戏菜单排序
    gameMenuSort() {
      const menuArr = [
        {
          id: 0,
          name: this.$t("首页"),
          path: "/home",
        },
        {
          id: 5,
          name: this.$t("真人视讯"),
          path: "/casino",
        },
        {
          id: 1,
          name: this.$t("电子游戏"),
          path: "/slots",
        },
        {
          id: 7,
          name: this.$t("捕鱼游戏"),
          path: "/slot",
        },
        {
          id: 2,
          name: this.$t("体育赛事"),
          path: "/sport",
        },
        {
          id: 3,
          name: this.$t("棋牌游戏"),
          path: "/chess",
        },
        {
          id: 8,
          name: this.$t("斗鸡"),
          path: "/elec",
        },
        {
          id: 4,
          title: this.$t("彩票游戏"),
          path: "/lottery",
        },
        // {
        //   id: 6,
        //   title: this.$t('电竞赛事')
        // },
      ];
      menuArr.forEach((a) => {
        const obj = this.gameList.find((b) => b.id == a.id);
        if (obj) {
          Object.assign(a, obj);
        }
      });
      let menueList = [];
      if (window.projectImgUrl !== "bqty") {
        menueList = menuArr.sort((pre, cur) => pre.sort - cur.sort);
      } else {
        menueList = menuArr;
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
      this.menue = [...menueList, ...this.list];
      this.menue.push({ name: this.$t("积分商城"), id: 12 });
      localStorage.setItem("ALLMENUE_EXCEPT_FISH", JSON.stringify(this.menue));
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
        self.$common.openLogin();
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
<style lang="scss" scoped>
.menuList_content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-self: center;
  color: black;
}
.menuList {
  position: relative;  
  height: 100%;
  z-index: 999;
  // width: 1300px;
  flex-direction: column;
  margin: 0 auto;
  display: flex;
  overflow-y: scroll;
  align-items: center;
  justify-self: center;
  .divider {
    height: 1px !important;
    margin: 5px 0px;
    width: 100%;
    background: #B4B6BF;
  }
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

  .logo:hover > .popup-list {
    display: block;
  }

  .list {
    // width: 1100px;
    z-index: 100;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
    width: 0.72rem;
    li {
      position: relative;
      height: 0.6rem;
      width: 100%;
      color: #b0b1ba;
      cursor: pointer;
      text-align: start;
      font: 16px/50px normal;
      // height: 76px;
      // padding: 0 10px;
      line-height: 1.5;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: row;

      .menu-label {
        margin-left: 10px;
        display: none;
      }
      .menu-arrow {
        display: none;
      }
      .menu-item {
        width: 100%;
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: center;
        margin: 5px;
        border-radius: 5px;
      }
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
      &:hover .underline {
        display: block;
      }
      &:hover .menu-item{
        background-image: linear-gradient(to bottom,#fbf9f8,#f9f7f5) !important;
      }

      .wrapper {
        position: fixed;
        left: 2.5rem;
        width: 3rem;
        max-height: 3rem;
        overflow-y: auto;
        background-color: white;
        z-index: 98;
        overflow-y: scroll;
        border: 2px solid #e3e3e3;
        box-sizing: border-box;
        box-shadow: 0 0.03rem 0.09rem 0 rgba(0,0,0,.1);
        border-radius: 0.1rem;

        .childList {
          position: relative;
          top: 0;
          z-index: 9999;
          display: flex;
          gap: 0.5rem;
          align-items: center;
          justify-content: center;
          .right {
            max-width: 1000px;
            padding: 5px 0;
            width: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: wrap;
            li {
              // margin: 0 10px;
              min-width: 160px;
              height: 0.62rem;
              cursor: pointer;
              text-align: center;
              justify-content: flex-start;
              padding: 0.14rem 0.16rem;
              &:hover {
                background-image: linear-gradient(to bottom, #fbf9f8, #f9f7f5) !important;  
                color: #866638;
              }
            }
          }
        }
      }
    
    }
    .li.active .menu-item{
      background-image: linear-gradient(to bottom, #fbf9f8, #f9f7f5) !important;      
    }
    span {
      font-size: 14.6px;
    }
  }
  &:hover{
    .list{
      width: 2.5rem;
      .li {
        justify-content:space-between;
        .menu-item {
          justify-content: flex-start;
          margin: 0px;
          padding-left: 5px;
        }
        .menu-label {
          flex: 1;
          display: block;
        }
        .menu-arrow {
          display: block;
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
      background: url("../../assets/image/qqImg/bg_site_top01.png") 50% 0
        no-repeat;
      border: none;
    }

    .center {
      position: relative;
      background: url("../../assets/image/qqImg/bg_site_y01.png") 50% 0 repeat-y;
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
      background: url("../../assets/image/qqImg/bg_site_bottom01.png") 50% 0
        no-repeat;
      border: none;
    }
  }
}

.flash-default-1,
.flash-default-3,
.flash-default-5,
.flash-default-7 {
  color: #fde9aa !important;
}
.list .active {
}
@for $i from 0 to 13 {
  .menu-icon#{$i} {
    width: 0.4rem;
    height: 0.32rem;
    display: block;
    background: url("../../assets/image/qqImg/menuicon-#{$i}.png")
      no-repeat
      center/contain;
  }
  .li.active .menu-icon#{$i} {
    background: url("../../assets/image/qqImg/menuicon-#{$i}-active.png")
      no-repeat
      center/contain;
  }
}
@for $i from 101 to 111 {
  .menu-icon#{$i} {
    width: 0.4rem;
    height: 0.3rem;
    display: block;
    background: url("../../assets/image/qqImg/menuicon-#{$i}.png")
      no-repeat
      center/contain;
  }
  .li.active .menu-icon#{$i} {
    background: url("../../assets/image/qqImg/menuicon-#{$i}-active.png")
      no-repeat
      center/contain;
  }
}
.flash-1 {
  color: #56ff5e !important;
}

.flash-3 {
  color: #f947f3 !important;
}

.flash-5 {
  color: #2799f1 !important;
}

.flash-7 {
  color: #56ff5e !important;
}
</style>
