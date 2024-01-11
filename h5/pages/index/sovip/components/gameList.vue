<!-- 游戏列表 -->
<template>
  <view class="gamelist">
    <!-- 左侧列表 -->
    <scroll-view class="nav" id="scrollContainer"
        :enable-flex="true"
        scroll-with-animation
        :throttle="true"
        :scroll-left="scrollLeft" scroll-x
      >
        <view
        class="con"
        :class="navIndex == index ? 'con-active' : ''"
        v-for="(item, index) in leftArray"
        :key="index"
        @click="changeIndex(index)"
      >
        <view class="bgicon">
          <image
            class="img"
            :src="getMyImg(item, navIndex,index)"
            mode="acpectFit"
            alt=""
          ></image>
        </view>
        <span>{{ item.name }}</span>
      
    </view>
      
    </scroll-view>
    <!-- 搜索游戏 -->
    <view class="searchTab" @click="toSearch">
      <text class="searchIcon cuIcon-search"></text>
      <input
        class="uni-input-input searchInput"
        confirm-type="search"
        type="text"
        placeholder-class="searchPlace"
        :placeholder="$t('请输入你要搜索的内容')"
      />
    </view>
    <!-- GameList -->
    <view >
      <HotGameList :gameList="gameList" @difference="difference"  v-if="id == 0"/>
      <LiveGameList :gameList="gameList" @difference="difference"  v-if="id != 0 && type == 3"/>
      <SportGameList  :gameList="gameList" @difference="difference" :gameId="id"  v-if="id != 0 && type == 2"/>
      <MultiGameList  
        :gameId="id"
        ref="moreGameList"
        :gameMenus="gamemenus"
        @difference="difference" 
        v-if="id != 0 && type == 1"/>
    </view>
  </view>
</template>

<script>
import HotGameList from '@/pages/gameList/hotGameList.vue';
import LiveGameList from '@/pages/gameList/liveGameList.vue';
import SportGameList from '@/pages/gameList/sportGameList.vue';
import MultiGameList from '@/pages/gameList/multiGameList.vue';
export default {
  components: {
    HotGameList,
    LiveGameList,
    SportGameList,
    MultiGameList
  },
  props: {
    arr: Array,
    leftArray: Array,
    gamemenus: Array,
    leftMenuIcon: Array,
    gameHot: Array,
    tenetid: {
      type: Number,
      default: 0
    },
    uid: {
      type: Number,
      default: 0
    },
    username: {
      type: String,
      default: ''
    },
    gamemenusparent: {
      type: Object,
      default:{}
    },
  },
  data() {
    return {
      navTop: 0, // 滚动的高度
      navIndex: 0, //左侧列表索引
      scrollLeft: 0,
      containerWidth: 0,
      clientRectWidth: 0,
      noDate: require("@/static/image/gameerror.png"),
	  id: 1,
    type: 1,
	  gameList:[],
    goGameData: {}, // 跳转的目标游戏
    goGameType: '',
    };
  },
  created(){
	  this.gameList = this.leftArray[this.navIndex]?.children
	  this.id = this.leftArray[this.navIndex]?.id
    this.type = this.leftArray[this.navIndex]?.type
  },
  onShow() {
  },
  mounted() {
			this.$nextTick(() => {
				this.getTabItemWidth()
			})
  },
  methods: {
    toSearch(){
      if (!this.$api.isLogin()) {
        uni.navigateTo({
          url: "/pages/Login/Login",
        });
        return;
      }
      uni.navigateTo({url:"/pages/search/search"})
    },
    getGameList(){
      console.log(11111)
      if(this.id != 0 && this.type == 1){
        console.log(22222)
        this.$refs.moreGameList && this.$refs.moreGameList.getGameList()
      }
    },
    // 更改左侧列表选中
    changeRightData(leftArray) {
      setTimeout(() => {
		this.gameList = leftArray[this.navIndex]?.children;
		this.id = leftArray[this.navIndex]?.id;
    this.type = leftArray[this.navIndex]?.type;
        this.$emit("changeRightData", leftArray[this.navIndex]);
      }, 0);
    },
    changeIndex(val) {
      this.navIndex = val;
      this.gameList = this.leftArray[val]?.children
      this.id = this.leftArray[val].id
      this.type = this.leftArray[val].type
      this.$emit("changeRightData", this.leftArray[this.navIndex]);
      this.getTabItemWidth();
    },
    getMyImg(item, navIndex,index) {
		if(navIndex===index){
      if(item.id == 0) {
			  return item.menuIconActiveApp
      }
			return this.$config.getImgUrl(item.menuIconActiveApp)
		} else {
      if(item.id == 0) {
			  return item.menuIconApp
      }
			return this.$config.getImgUrl(item.menuIconApp)
    }
    // else {
		// 	return this.$config.getImgUrl(item.menuIconApp)
		// }
      // if (!this.leftMenuIcon[index]) return "";
      // return this.leftMenuIcon[index][index == navIndex ? "imgs" : "img"];
    },
    getTabItemWidth() {
      let query = uni
					.createSelectorQuery()
					// #ifndef MP-ALIPAY
					.in(this)
				// #endif
      // 获取容器的宽度
      query
        .select(`#scrollContainer`)
        .boundingClientRect((data) => {
          if (!this.containerWidth && data) {
            this.containerWidth = data.width
          }
        })
        .exec()
      // 获取所有的 tab-item 的宽度
      query
        .selectAll('.con')
        .boundingClientRect((data) => {
          if (!data) {
            return
          }
          let lineLeft = 0
          let currentWidth = 0
          let totalWidth = 0
          if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              totalWidth += data[i].width;
              if (i < this.navIndex) {
                lineLeft += data[i].width
              } else if (i == this.navIndex) {
                currentWidth = data[i].width
              } 
            }
            // 当前滑块的宽度
            this.currentWidth = currentWidth
            // // 缩放后的滑块宽度
            // this.lineWidth = currentWidth * this.lineScale * 1
            // // 滑块作移动的位置
            // this.lineLeft = lineLeft + currentWidth / 2
            // // 胶囊距离左侧的位置
            // this.pillsLeft = lineLeft
            // 计算滚动的距离左侧的位置
            const center = this.containerWidth / 2 - currentWidth / 2;          
            if(lineLeft < center)
              this.scrollLeft = 0;
            else if(lineLeft > totalWidth - center )
              this.scrollLeft = totalWidth;
            else
              this.scrollLeft = lineLeft - center;
            // this.scrollLeft = lineLeft + currentWidth / 2 - this.containerWidth / 2
            }
          
        })
        .exec()
    },
    // 匹配游戏
    difference( item2, j) {
      let item = this.gamemenusparent
      let index = this.navIndex
      //#ifdef H5
      this.routerWeb(item, item2, index, j);
      // #endif
      //#ifdef APP-PLUS
      // 判断登录状态
      if (!this.$api.isLogin()) {
        console.log("还未登录,请登录");
        uni.navigateTo({
          url: "../Login/Login",
        });
        return;
      }
      if (index == 0) {
        this.dataClick1(item2, 1);
      } else {
        this.dataClick1(item2, 2);
      }
      // #endif
    },
    // 跳转详情 bmw
    dataClick1(reqData, type) {
      console.log(reqData,'reqData1')
      let self = this;
      if (!this.$api.isLogin()) {
        uni.navigateTo({
          url: "../login/login?type=0",
        });
        return;
      }
      uni.showLoading({
        title: "",
        mask: true,
      });
      let ids = "";
      if (type == 4) {
        ids = reqData.bannerGame.id;
      } else {
        ids = reqData.ids || reqData.id || reqData.gameId;
      }
      var req = [
        self.tenetid,
        self.username,
        reqData.vendorId,
        ids,
        self.$config.clientIp,
        self.uid,
        2,
      ];
      self.$api.getTokenUrl(
        ...req,
        function (err, res) {
          if (err) {
            uni.showToast({
              title: "",
              icon: "none",
            });
            // #ifdef H5
            self.winOpen.close();
            // self.winOpen = window.open('/error.html?type=1', '_blank');
            // #endif
          } else {
            let title = reqData.name;
            if (type == 4) {
              title = reqData.bannerGame.name;
            }
            //   ;
            // #ifdef H5
            self.winOpen.location.href = res.gameUrl; //改变页面的location
            console.log("准备进入游戏...");
            // #endif
            // #ifdef APP-PLUS
            let dataGame = {
              url: res,
              type: 1,
              title: title,
              req: req,
            };

            let platform = uni.getSystemInfoSync().platform;
            uni.setStorageSync("cutScreenFlag", true);
            uni.setStorageSync("platform", platform);
            uni.setStorageSync("dataGame", dataGame);
            uni.navigateTo({
              url: "/pages/webNvue/webNvue",
            });
            // #endif
          }
        },
        true
      );
    },
    
    // 跳转项目   判断是跳转到列表还是直接进入游戏
    routerWeb(item, item2, index, j) {
      // return
      // 判断登录状态
      if (!this.$api.isLogin()) {
        uni.navigateTo({
          url: "/pages/Login/Login",
        });
        return;
      }
      // debugger
      // 此状态跳转到列表
      if (item2.type == 1 || item2.type == 3) {
        // let gameList2 = this.listMe(item.children, 1)
        let gameList2 = item.children;
        let newJ = gameList2.findIndex((element) => element.name == item2.name); //返回的是索引下标：2
        let type = item2.type;
        uni.setStorageSync("gameList", gameList2);
        uni.navigateTo({
          url:
            "/pages/gameList/gameList?index=" +
            index +
            "&j=" +
            newJ +
            "&type=" +
            type +
            "&gameKindId=" +
            item.id,
        });
      } else {
        this.dataClick(item2, 2);
      }
    },
    
    // 跳转详情
    dataClick(reqData, type) {
      const self = this
      if (!this.$api.isLogin()) {
        if (type == 1) {
          uni.showToast({
            icon: "none",
            title: self.$t('请先登录'),
          });
        } else {
          uni.navigateTo({
            url: "/pages/login/login",
          });
        }
        return;
      }
      this.goGameData = reqData;
      this.goGameType = type;
      console.log(reqData,'reqData2')
      this.goGame(reqData, type);
    },
    // 进入游戏
    goGame(reqData, type) {
      let isIos = "";
      uni.showLoading({
        title: this.$t('正在进入游戏...'),
        mask: true,
      });
      let self = this;
      let ids = "";
      if (type == 4) {
        ids = reqData.bannerGame.id;
      } else {
        ids = reqData.ids || reqData.id || reqData.gameId;
      }
      // #ifdef H5
      uni.getSystemInfo({
        success: function (resNew) {
          if (reqData.openMode === 1) {
            isIos = "ios";
            self.isIos = true;
            self.winOpen = window.open("/waitPage.html?type=1", "_blank"); //首先打开一个新页面
          } else {
            isIos = "android";
            self.isIos = false;
          }
        },
      });
      // #endif
      var req = [
        self.tenetid,
        self.username,
        reqData.vendorId,
        ids,
        self.$config.clientIp,
        self.uid,
        2,
      ];
      self.$api.getTokenUrl(
        ...req,
        function (err, res) {
          if (err) {
            if (isIos === "ios") {
              self.winOpen.location.href = "/error.html?type=1"; //改变页面的location
              console.log("%c" + "gameDetail", "color:#a70a0a;", err);
            } else {
              if (reqData.status === 0) {
                uni.showToast({
                  title:  self.$t('维护中'),
                  icon: "none",
                });
              } else {
                uni.showToast({
                  title:  self.$t('进入游戏失败，请稍后重试！'),
                  icon: "none",
                });
              }
            }
          } else {
            let title = reqData.name;
            if (type == 4) {
              title = reqData.bannerGame.name;
            }
            // #ifdef H5
            if (isIos === "ios") {
              self.parensRes = res.gameUrl;
              if (res.status === 1) {
                //未冻结
                setTimeout(function () {
                  //这里使用setTimeout非常重要，没有将无法实现
                  console.log(self.winOpen);
                  self.winOpen.location.href = res.gameUrl; //改变页面的location
                }, 100);
              } else {
                localStorage.setItem("newGameUrl", res.gameUrl);
                self.winOpen.location.href = "/error.html?type=2"; //改变页面的location
              }
            } else {
              self.$server.setWebView(res.gameUrl, 1, title); //1首页 ，2搜索，3游戏列表，4活动，5公告  6缺省页
              if (res.status === 1) {
                uni.navigateTo({
                  url: "/pages/gameWebView/gameWebView",
                });
              } else {
                self.openalert6();
              }
            }
            // #endif
            // #ifdef APP-PLUS
            let dataGame = {
              url: res,
              type: 1,
              title: title,
              req: req,
            };
            uni.setStorageSync("dataGame", dataGame);
            if (self.centerWalletStatus) {
              uni.navigateTo({
                url: "/pages/webNvue/webNvue",
              });
            } else {
              self.openalert6();
            }
            // #endif
          }
        },
        true
      );
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep  .secondList .uni-scroll-view-content{
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 20upx 24upx;
    align-content: flex-start;
  }
// 游戏列表
.gamelist {
  width: 100%;
  .nav {
    z-index: 1;
    color: #9ea9b3;
    overflow-x: auto;
    background-color: #0f0f0f;
    position: relative;
    // height: 92upx;
    // margin-bottom: 16upx;
    padding: 5upx 6upx;
    background-color: #3a3a3a;
    white-space: nowrap;
    line-height: 60rpx;
    

    .con {
      display: inline-flex;
      vertical-align: middle;
      /* height: 41px; */
      line-height: 33upx;
      padding: 0 14px;
      color: #fff;
      font-size: 22upx;
      width: min-content;
      font-weight: 500;
      border-radius: 30px;      
      flex-direction: column;
      align-items: center;
      .bgicon {
        width: 60upx;
        height: 60upx;
        margin-top: 6upx;
        .img {
          width: 100%;
          height: 100%;
        }
      }
      span {
        margin-top: 2upx;
      }
    }

    .con:nth-child(1) {
      margin-top: 0;
    }

    .con-active {
      // background: linear-gradient(85.62deg,#fead00 10.63%,#ffc54a 102.31%);
      background-repeat: no-repeat;
      background-size: cover;
      color: #ff9000;
    }
  }
  
}
.searchTab{
  margin: 10rpx;
	padding: 20rpx 20rpx; 
  margin-bottom: 16rpx;
  background: #22211f;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  .searchIcon {
    margin-right: 10rpx;
    font-size: 36upx;
    color: #767676;
  }
    .search{
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
