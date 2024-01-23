<!-- 游戏列表 -->
<template>
  <view class="gamelist" ref="refGameList">
    <!-- 左侧列表 -->
    <view class="nav" id="scrollContainer"
      :style="{
        position: isNavFixedPos ? 'fixed' : 'absolute',
        top: scrollAtFoot ? 'inherit' : isNavFixedPos ? '104upx' : '0px',
        bottom: isNavFixedPos ? 'inherit' : scrollAtFoot ? '0px' : 'inherit',
      }">
        
      <view
        class="con"
        :class="navIndex == index ? 'con-active' : ''"
        v-for="(item, index) in leftArray"
        :key="index"
        @click="changeIndex(index)"
        @mouseenter="navMouseHover(index)"
        @mouseleave="navMouseLeave()"
      >
        <img class="background" :src="navIndex == index ? '@/static/image/indexImg/btn_zc2_1.png' : '@/static/image/indexImg/btn_zc2_2.png'"/>
        <view class="bgicon">
          <img
            class="img"
            :src="(navIndex == index || hoverIndex == index) ? ('@/static/image/indexImg/menuicon-' + item.id + '-active.png') : ('@/static/image/indexImg/menuicon-' + item.id + '.png')"
            alt=""
          />
        </view>
        <view class="nav-title">{{ item.name }}</view>
      
      </view>
    </view>
    <!-- GameList -->
    <view class="content" >
      <view class="game-list">
        <view class="top-games">
          <view class="game-tab">
            <view :class="{'tab-item' : true, 'active':curTabIndex == 0}" @click="curTabIndex=0">
              <view class="tab-title">{{ $t('热门游戏') }}</view>
            </view>
            <view :class="{'tab-item' : true, 'active':curTabIndex == 1}" @click="curTabIndex=1">              
              <view class="tab-title">{{ $t('最近') }}</view>
            </view>
            <view :class="{'tab-item' : true, 'active':curTabIndex == 2}" @click="curTabIndex=2">
              <view class="tab-title">{{ $t('最喜欢') }}</view>
            </view>
          </view>
          <!-- 热门游戏 -->
          <view class="hotgame" v-if="curTabIndex == 0">
            <hotGame :hotGameList="hotGameList" :index="0" @goGameDataClick="goGameDataClick"></hotGame>
          </view>
          <view class="hotgame" v-if="curTabIndex == 1">
            <hotGame :hotGameList="recentGameList" :index="0" @goGameDataClick="goGameDataClick" ></hotGame>
          </view>
          <view class="hotgame" v-if="curTabIndex == 2">
            <hotGame :hotGameList="favoriteGameList" :index="0" @goGameDataClick="goGameDataClick" ></hotGame>
          </view>
        </view>
        
        <view class="category-games">
          <view class="games-group">
            <view v-for="(item, i) in gameMenuList" :key="i" ref="scrollMenuItems">          
              <view class="group-item" v-if="i > 0">
                <view class="game-title">
                  <view class="title-content">
                    <img
                      class="img"
                      :src="'@/static/image/indexImg/menuicon-' + item.id + '-active.png'"            
                      alt=""
                    />
                    <span class="game-label">{{ item.name }}</span>   
                  </view>
                  <view class="btn-all" @click="clickOnAllGames(item)">
                    {{ $t('All') }}
                  </view>
                  
                </view>
                <view class="game-content">
                  <view v-for="(childItem, childIdx) in childrens(i)" :key="childIdx" class="game">
                    <view class="game1" @click="goGameDataClick(childItem)">
                      <img :src="$config.getImgUrl(childItem.imgUrl)"/>
                    </view>
                  </view>              
                </view>
                <view class="show-more" v-if="expandedFlag[i] === false">
                  <span>{{ $t('显示')  + item.children.length + $t('个') + item.name  + $t('游戏中的')+ (item.children.length > 6 ? 6 : item.children.length) + $t('个') }}</span>
                  <span class="btn-more" @click="expandList(i)">
                    {{ $t('下载更多') }} 
                    <view class="more-icon"/></span>
                </view>
              </view>
            </view>
          </view>
        </view>
        
        
      </view>
    </view>
  </view>
</template>

<script>
import HotGameList from '@/pages/gameList/hotGameList.vue';
import LiveGameList from '@/pages/gameList/liveGameList.vue';
import SportGameList from '@/pages/gameList/sportGameList.vue';
import MultiGameList from '@/pages/gameList/multiGameList.vue';
import hotGame from './hotGame.vue';
export default {
  components: {
    HotGameList,
    LiveGameList,
    SportGameList,
    hotGame,
    MultiGameList
  },
  props: {
    arr: Array,
    leftArray: Array,
    gamemenus: Array,
    leftMenuIcon: Array,
    gameHot: Array,
    gamemenusparent: [Object, Array],
  },
  data() {
    return {
      navTop: 0, // 滚动的高度
      navIndex: 0, //左侧列表索引
      hoverIndex: -1,
      scrollLeft: 0,
      containerWidth: 0,
      hotGameList: [],
      recentGameList: [],
      favoriteGameList: [],
      gameMenuList:[],
      expandedFlag: [],
      curTabIndex: 0,
      clientRectWidth: 0,
      noDate: require("@/static/image/gameerror.png"),
      swiperOption: {
          simulateTouch: false,
          loop: true,
          autoplay: false,
          navigation: {
              nextEl: '.swiper-button-next0',
              prevEl: '.swiper-button-prev0',
          },
          slidesPerView: 5,
          spaceBetween: 15,
          freeMode: true,
      },
      id: 1,
      isNavFixedPos: false,
      scrollAtFoot: false,
      type: 1,
      gameList:[]
    };
  },
  created(){
	  this.gameList = this.leftArray[this.navIndex]?.children
    this.gameMenuList = this.leftArray;
	  this.id = this.leftArray[this.navIndex]?.id
    this.type = this.leftArray[this.navIndex]?.type
    this.hotGameData();
  },
  onShow() {
  },
  mounted() {    
      window.addEventListener('scroll', this.handleWindowScroll);
  },
  methods: {
    // 更改左侧列表选中
    changeRightData(leftArray) {
      setTimeout(() => {
        this.gameList = leftArray[this.navIndex]?.children;
        this.id = leftArray[this.navIndex]?.id;
        this.type = leftArray[this.navIndex]?.type;
        this.$emit("changeRightData", leftArray[this.navIndex]);
        this.setGameMenuList();
      }, 0);
    },
    clickOnAllGames(val) {
      if (val.nameEn == "fishing") {
        val.ids = "100010001";
      }
      let { parentId: pid, ids: id, type, imgUrlOne } = val;
      uni.navigateTo({
            url: `/pages/search/search?pid=${val.id}&type=${type}`,
            animationType: 'pop-in',
            animationDuration: 200
        });
    },
    getToken: async function (req, index) {
      // return
      let self = this;

      if (!self.$server.getUser()) {
        // self.showLogin = true;
        // self.$message.warning(this.$t("请登录"));
        self.$common.openLogin();
        return;
      }
      self.tenantId = self.$server.getUser().tenant_id;
      self.username = self.$server.getUser().username;
      self.uid = self.$server.getUser().user_id;
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
          // if(issafariBrowser) {
          //  self.winOpen.location.href = self.gameUrl;
          // }else{
          window.open(self.gameUrl);
          // }
        } else {
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
    setGameMenuList() {
      this.gameMenuList = this.leftArray;
      this.gameMenuList?.forEach((item) => {
        if(item?.children?.length > 6){
          this.expandedFlag.push(false);
        } else {                
          this.expandedFlag.push(true);
        }
      });
    },
    async hotGameData(){
      let data = '';
      let self = this;
      self.$api.hotGame(function (err, res) {
        if (err) {
          console.log("%c" + "hotGame", "color:#a70a0a;", err);
        } else {
          self.hotGameList = res;
        }
      }, false);
    },
    changeIndex(val) {
      this.navIndex = val;
      if (val >= 1) {
        const elementToScroll = this.$refs.scrollMenuItems[val];
        if (elementToScroll) {
          const elementTop = elementToScroll.$el.getBoundingClientRect().top;          
          window.scrollTo({ top: elementTop + window.scrollY - 70});
        }
      } else {
        window.scrollTo({ top: 0});
        
      }
    },
    navMouseHover(index) {
      this.hoverIndex = index;
    },
    navMouseLeave() {
      this.hoverIndex = -1;
    },
    expandList(idx) {
      this.$set(this.expandedFlag, idx, true);
    },
    handleWindowScroll() {
      const currentScrollTop = window.scrollY;
      let curGameIdx = 0;      
      if(this.$refs.refGameList) {
        const rect = this.$refs.refGameList.$el.getBoundingClientRect();
        const topPosition = rect.top + window.scrollY;
        if(currentScrollTop + 102 > topPosition && currentScrollTop + window.innerHeight - 80 < topPosition + rect.height) {
          this.isNavFixedPos = true;
        } else {
          this.isNavFixedPos = false;
        }
        if(currentScrollTop + window.innerHeight - 80 > topPosition + rect.height) {
          this.scrollAtFoot = true;
        } else {
          this.scrollAtFoot = false;
        }
        
      }

      
      
      this.$refs.scrollMenuItems?.forEach((elementToScroll, idx) => {
        if (elementToScroll) {
          const elementTop = elementToScroll.$el.getBoundingClientRect().top;
          if(elementTop + window.scrollY - 80 < currentScrollTop)
            curGameIdx = idx;
        }
      });      
      if(this.scrollAtFoot) {
        this.navIndex = this.gameMenuList.length - 1;
      } else {
        this.navIndex = curGameIdx;
      }

      
      // this.$store.commit('curMenuIdxFromScroll', curGameIdx);
    },
    childrens(id) {
      if(!this.gameMenuList[id].children) return [];
      if(this.expandedFlag[id])
        return this.gameMenuList[id].children;
      else
        return this.gameMenuList[id].children.slice(0, 6);
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
    difference({gamemenusparent, item, navIndex, index}) {
      this.leftArray.forEach((left, idx) => {
        if(left.id == item.id) {
          this.navIndex = idx;
        }
      })
      // this.$emit("difference", {
      //   gamemenusparent,
      //   item,
      //   navIndex,
      //   index,
      // });
    },
    goGameDataClick(item) {
      this.$emit('goGameDataClick', {
        item
      })
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep  .secondList .uni-scroll-view-content{
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 20upx 24upx;
    align-content: flex-start;
  }
// 游戏列表
.gamelist {
  width: 100%;  
  position: relative;
  margin-bottom: 80upx;
  .nav {
    z-index: 1;
    color: #9ea9b3;
    overflow-y: auto;
    position: absolute;
    // height: 92upx;
    // margin-bottom: 16upx;
    margin: 5upx 16upx;
    background-color: transparent;
    white-space: nowrap;
    line-height: 60rpx;
    width: 20vw;
    height: calc(100vh - 240upx);
    flex-direction: column;

    .con {
      display: inline-flex;
      vertical-align: middle;      
      cursor: pointer;      
      padding: 0 10upx;
      color: #999999;
      font-size: 22upx;
      width: 100%;
      font-weight: 500;
      border-radius: 10upx;   
      align-items: center;
      position: relative;
      height: 9.4vw;
      margin-top: 20upx;
      display: flex;
      justify-content: start;
      box-shadow: 0 3.8upx 6.6upx 0 rgba(0,0,0,.06);

      .background {
        width: 100%;
        height: 100%;        
        z-index: -1;
        position: absolute;
        object-fit:fill;
        left: 0;
        top: 0;
      }
      .bgicon {
        width: 40upx;
        height: 40upx;
        .img {
          width: 40upx;
          height: 40upx;
          object-fit: contain;
        }
      }
      &:hover {
        .nav-title {
          color: #866638;
        }
      }
      .nav-title {
        width: calc(100% - 40upx);
        text-align: center;
        margin-left: 6upx;
        font-size: 22upx;
        overflow-wrap: break-word; /* For newer browsers */
        word-wrap: break-word;     /* For older browsers */
        white-space: normal;       /* Allow wrapping */
      }
    }

    .con:nth-child(1) {
      margin-top: 0;
    }

    .con-active {
      // background: linear-gradient(85.62deg,#fead00 10.63%,#ffc54a 102.31%);
      background-repeat: no-repeat;
      background-size: cover;
      cursor: inherit;
      color: #FFFFFF;
      &:hover {
        .nav-title {
         color: #FFFFFF;
        }
      }
      
    }
  }
  .content {
    margin-left: 25vw;
    width: calc(100vw - 25vw);

    .game-list {
      width: 100%;
      margin-top: 12upx;
      z-index: 90;
      border-radius: 10upx;
      color:#666666;
      display: flex;
      align-items: center;
      flex-direction: column;
      .top-games {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin: 10upx 10upx 0;
        width: 100%;
        .game-tab {
          display: flex;
          height: 60upx;
          width: 100%;
          border-bottom: 2upx solid #e3e3e3;
          justify-content: space-evenly;
          .tab-item {
            display: flex;
            align-items: center;
            position: relative;
            width: max-content;
            .tab-title {
              font-size: 20upx;
              text-align: center;
              white-space: pre-line;
              word-break: break-word;
              cursor: pointer;
            }
            &:hover {
              .tab-title {
                color: #866638;
              }
            }
          }
          .tab-item.active {
            &::after {
              background-color: #866638;
              bottom: -2upx;
              content: "";
              display: block;
              height: 3upx;
              left: 0px;
              position: absolute;
              width: 100%;
            }
          }
          
        }
      }
      .category-games {
        flex: 1;
        display: flex;    
        flex-direction: column;
        margin: 0.2rem 0.2rem 0;
        width: 100%;
        .games-group {
          padding: .2rem;
          .group-item {
            border-top: 1px solid #e3e3e3;
            display: flex;      
            justify-content: flex-start;  
            padding: 10upx 0;
            flex-direction: column;
            .game-title {
              display: flex;
              margin-bottom: 10upx;
              align-items: center;
              width: 100%;
              justify-content: space-between;
              padding-right: 20upx;
              .title-content {
                display: flex;
                margin-bottom: 10upx;
                align-items: center;
                .game-label {
                  font-size: 24upx;
                  color: #000;
                  margin-left: 6upx;
                }
                .img {
                  width: 40upx;
                }
              }

              .btn-all {
                font-size: 24upx;
                cursor: pointer;
              }

              
            }
            .game-content {
              display: flex;
              flex-wrap: wrap;
              .game {
                width: fit-content;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 20upx;
                box-shadow: 0 2.4upx 4.8upx 0 #BEA8851F;
                margin: 10upx 0;
                background-color: white;  
                .game1 {
                  width: fit-content;
                  height: 5.12rem;
                  border: thin solid #FFF;
                  margin: 3upx;
                  position: relative;
                  cursor: pointer;
                  img {
                    width: 13.6rem;
                    height: 5.12rem;
                    border-radius: 10upx;
                    object-fit: cover;
                  }
                }
                
              }

            }
            .show-more {
              text-align: center;
              margin-top: 0.3rem;
              font-size: 20upx;
              display: flex;
              flex-direction: column;
              .btn-more{
                font-weight: 700;
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                .more-icon {
                  background: url('@/static/image/indexImg/double-arrow-down.svg') no-repeat;
                  width: 24upx;
                  height: 24upx;
                  margin-left: 10upx;
                  color: #666666;
                }
              }
            }
          }
        }
      }
      
      
    }
  }  

}
</style>
