<template>
  <div class="page-activity">
    <!-- 公告 -->
    <div :class="noticeClass" @click="openNotice" style="position:sticky; top: 0px;">
      <Notice></Notice>
    </div>
    <div class="banner-wrap">
      <img :src="$config.getLocaleImg('title_promotions','jpg')" alt="">
    </div>
    <!-- 公告弹窗 -->
    <dialog-notice v-if="openDialog" @close="closeNotice"></dialog-notice>
    <div class="activity" v-infinite-scroll="load" :class="{ isDisabledScroll: isDisabledScroll }" style="overflow:auto;">
      <div class="nav-wrap" >
            <div class="nav-item" :class="currentActTypeId == '' ? 'nav_active' : ''" @click="changeTab('')">{{$t('全部优惠')}}</div>
            <div class="nav-item  " v-for="item in actTypeList" :key="item.id" :class="currentActTypeId == item.id ? 'nav_active' : ''" 
              @click="changeTab(item.id)" >{{ item.remark }}</div>
        </div>
      <div style="width:12rem;margin: 0 auto;">
        <!-- activityList -->
        <div class="activityList" v-if="activityList.length > 0">
          <div class="actItem cursorPoint" v-for="(item, i) in activityList" :key="i" 
            :class="{ isActive: activityId == item.id }" @click="toActDetail(item)">
            <div class="img">
              <img loading="lazy" v-lazy="$common.getImgUrl(item.picture)" alt />
            </div>
          </div>
         
        </div>
        <div v-else style="display:flex;width:1200px;height:400px;color:white;justify-content:center;align-items:center;letter-spacing:2px;font:18px/36px normal;" >{{$t('暂无数据')}}</div>
        <!-- 文字提示 -->
        <div v-if="loadingType == 'loading'">
          <div class="loadingGif loading-text actTextColor8" style="margin-bottom: 0.2rem;text-align: center;color:#fff">
            <img loading="lazy" v-lazy="require('@/assets/image/gameImg/actLoading.gif')" alt />
            <div class="themeLightColorClass">{{$t('加载中')}}...</div>
          </div>
        </div>
        <div v-else-if="loadingType == 'more'" class="loading-text actTextColor8 u-flex-all"
          style="margin-bottom: 0.2rem;text-align: center;color:#fff">{{ loadingText.loadingDown }}</div>
        <div v-else>
          <div class="loading-text actTextColor8 u-flex-all" style="margin-bottom: 0.2rem;text-align: center;color:#fff">
            {{ loadingText.loadingNoMore }}</div>
        </div>

      </div>
      <!-- 引入组件 -->
      <ActDetail ref="actDetail"></ActDetail>
    </div>
  </div>
</template>

<script>
import ActDetail from "../actDetail/actDetail";
// 公告
import Notice from '../../components/index/notice'
// 公告弹窗
import dialogNotice from '../../components/index/dialogNotice'
export default {
  name: "activity",
  data() {
    return {
      noticeSwitch: false,
      openDialog: false,
      isLogin: false,
      loadingType: "more", //提示消息，more表示上拉加载更多，loading表示正在加载...，noMore表示没有更多数据了
      loadingText: {
        loadingDown: "",
        // loadingRefresh: "正在加载...",
        loadingNoMore: this.$t("没有更多数据了")
      },
      currentPage: 1,
      pageSize: 20,
      activityList: [],
      bannerReqSuccess: true, //是否显示nothing
      activityId: 0, //活动id
      totalPages: 0, //list总页数
      isDisabledScroll: false,
      userId: "",
      userName: "",
      tenetid: "",
      currentActTypeId: '', //当前活动分类
      actTypeList: [], // 活动分类列表
    };
  },
  filters: {
    timeSwitch(val) {
      if (val) {
        var date = new Date(val); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + "-";
        var M =
          (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-";
        var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var time = Y + M + D;
        return time;
      }
    }
  },
  created() {
    if (this.$store.state.token) {
      this.isLogin = true;
    }
  },
  computed: {
    noticeClass: function () {
      return {
        notice: !this.noticeSwitch,
        fixed: this.noticeSwitch
      }
    }
  },
  mounted() {
    let _this = this;
    window.onscroll = function () {
      if (document.documentElement.scrollTop > 300) {
        _this.noticeSwitch = true;
      } else {
        _this.noticeSwitch = false;
      }
    }
    this.getActivityData();
    this.getActTypes();
  },
  methods: {
        // 获取活动分类
        getActTypes() {
        this.$http.get(this.$api.activityType).then((res) => {
            if (res && res.code == 0) {
                this.actTypeList = res.data;
            }
        });
      },
            //tab切换
      changeTab(id) {
       
          if (id === this.currentActTypeId) return;
          this.currentActTypeId = id;
          this.loadingType = "more";
          this.currentPage = 1;
          this.activityList = [];
          this.getActivityData(this.currentPage, this.pageSize);
      },
    //打开公告弹窗
    openNotice() {
      this.openDialog = true;
    },
    //关闭公告弹窗
    closeNotice() {
      this.openDialog = false;
    },
    initRequest() {
      if (this.$common.getUser()) {
        this.userId = this.$common.getUser().user_id;
        this.userName = this.$common.getUser().username;
        this.tenetid = this.$common.getUser().tenant_id;
      }
    },
    async getActivityData(currentPage = 1) {
      var _this = this;

      // _this.loadingType = 'loading'; //显示正在加载中。。。。
      var params = {
        'currentPage': _this.currentPage,
        'pageSize': _this.pageSize,
        ascriptionType: _this.currentActTypeId
      };
      var res = await _this.$http.post(_this.$api.activity, params);
      if (res.code == 0) {
        this.totalPages = res.data.totalPages;
        if (res.data.content.length > 0) {
          let data = currentPage == 1 ? [] : _this.activityList;
          data.push(...res.data.content);
          _this.activityList = data;
          _this.actListReqSuccess = true;
        } else {
          //加载第一页为空，才显示nothing
          _this.actListReqSuccess = _this.currentPage == 1 ? false : true;
        }

        if (_this.currentPage == _this.totalPages) {
          //显示数据没有了
          _this.loadingType = 'noMore';
        } else {
          //上拉显示更多
          _this.loadingType = 'more';
        }
      } else {
        _this.actListReqSuccess = false;
        var msg = _this.$t(`errorCode.${res.code}`) + `(${res.code})` || _this.$t('请求错误');
        this.$http.errMsg(msg);
      }
    },
    load() {
      //上拉加载
      this.loadingType
      if (this.loadingType != "more") {
        //显示正在加载中或者没有更多数据了，就不用请求了
        return;
      }
      this.currentPage++;
      console.log(this.currentPage);
      this.getActivityData(this.currentPage, this.pageSize);
    },
    toActDetail(item) {
      const { type, jumpType, needLogin = 0, url = '' } = item
      if ((type == 7 || jumpType == 7) && needLogin == 1) {
        // if (!this.$common.getUser()) return this.$message.error(this.$t('请先进行登录'));
        if (!this.$common.getUser()) return this.$common.openLogin();
        return this.$router.push({ path: url })
      }
      // if(item.jumpType == 6){
			// 		if (!this.$common.getUser()) {
			// 	  	this.$message.error(this.$t('请先进行登录'));
      //       return;
			// 		}
      //     this.$router.push("/actDetail?id="+item.id);
			// 		return
			// 	}
      // //type=3,url有值，跳转；url为空，打开详情
      // if (item.type == 3 && item.activityExtensionsVo.url) {
      //     //跳转链接
      //     window.open(item.activityExtensionsVo.url);
      //     return;
      // } else if(item.activityExtensionsVo && item.activityExtensionsVo.type == 4){  //跳转游戏
			// 		if(!this.$common.getUser()){
      //       this.$message.error(this.$t('请先进行登录'));
      //       return;
			// 		}else{
			// 			this.getToken(item.activityExtensionsVo.activityGame,1)
			// 		}
			// 	}else {
      //   //打开活动详情
      //   this.activityId = item.id;
      //   this.$router.push({
      //     path:'/actDetail',
      //     query:{
      //       id:this.activityId
      //     }
      //   })
      // }
      if (item.type == 3) {
        if (item.activityExtensionsVo.url) {
          //跳转链接
          window.open(item.activityExtensionsVo.url);
          return;
        } else if (item.activityExtensionsVo && item.activityExtensionsVo.type == 4) {  //跳转游戏
          if (!this.$common.getUser()) {
            // this.$message.error(this.$t('请先进行登录'));
            this.$common.openLogin()
            return;
          } else {
            this.getToken(item.activityExtensionsVo.activityGame, 1)
            return;
          }
        } else {
          //打开活动详情
          this.activityId = item.id;
        }
      } else {
        this.activityId = item.id;
      }
      //禁止滚动
      this.isDisabledScroll = true;
      this.$refs.actDetail.openDialog(this.activityId);
    },
    // 进入游戏
    getToken: async function (req, index) {
      // return
      let self = this;
      var issafariBrowser = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

      if (!self.$common.getUser()) {
        // self.showLogin = true;
        // self.$message.warning(self.$t('请登录'))
        this.$common.openLogin()
        return
      }
      self.tenantId = self.$common.getUser().tenant_id
      self.username = self.$common.getUser().username
      self.uid = self.$common.getUser().user_id
      let datas = {
        tenantId: self.tenantId,
        username: self.username,
        gameId: index == 2 ? req.ids : req.id,
        clientIp: self.$config.clientIp,
        memberId: self.uid,
        terminalType: 1
      }
      self.$common.setGameRequestData(datas)

      const res = await self.$http.post(this.$api.getToken, datas, true)
      if (res.code == 0) {
        self.gameUrl = res.data;
        if (req.openMode === 1) {
          // if(issafariBrowser) {
          //  self.winOpen.location.href = self.gameUrl;
          // }else{
          window.open(self.gameUrl)
          // }

        } else {
          window.open(self.gameUrl)
        }

      } else {
        if (req.openMode === 1) {
          window.open('/error.html?type=1')
          // self.winOpen.location.href = '/error.html?type=1';
        }

        if (req.status === 0) {
          self.$message.error(self.$t('维护中'))
        } else {
          self.$message.error(self.$t('进入游戏失败，请稍后重试'))
        }
      }
    },
  },
  components: {
    ActDetail,
    Notice,
    dialogNotice
  },

  watch: {
    "$store.state.token"(n) {
      //监听token，判断是否登录
      this.isLogin = n ? true : false;
    },
    isLogin(n) {
      var _this = this;
      if (n) {
        //登录
        _this.initRequest();
      }
    }
  }
};
</script>

<style lang="scss" >
.banner-wrap {
  height: 260px;
  // background: url('../../assets/image/gameImg/title_promotions.jpg') 50% 0 no-repeat;
  img{
    height: 100%;
    width: 100%;
  }
}
.page-activity{
  background-color: $active-bgColor;
}

.notice {
  width: 100%;
  background-color: $notice-bg;
  z-index: 99;
  cursor: pointer;
}

.fixed {
  position: fixed;
  left: 0;
  top: 130px;
  width: 100%;
  background-color: rgba(0, 0, 0, .85);
  z-index: 99;
  cursor: pointer;
}

.activity {
    display: flex;
    width: 100%;
    max-width: 13.9rem;
    margin: 0 auto;
    height: 100%;
    overflow-y: scroll;
    box-sizing: border-box;
    scrollbar-width: none;
    /* firefox */
    -ms-overflow-style: none;
    /* IE 10+ */
    padding-top: 10px;
  .nav-wrap{
      width: 1.5rem;
      margin-top:.3rem;
      .nav-item{
          width: 1rem;
          height: .4rem;
          line-height: .4rem;
          padding: 0 14px;
          background: $active-btnColor;
          margin-bottom: 15px;
          text-align: center;
          border: 1px solid $theme-color;
          border-radius: 40px;
          box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
          overflow:hidden; 
          text-overflow:ellipsis; 
          white-space:nowrap;
          cursor:pointer;
          color: $active-color;
          &:hover{
            color: $active-color;
            background: $active-btncolor1;
          }
      }
      .nav_active{
        color: $active-color;
        background: $active-btncolor1;
      }
  
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }


  //列表
  .activityList {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;

    .actItem {
      width: 49%;
      height: 1.8rem;
      margin-bottom: 0.18rem;
      margin-right: 0.19rem;
      box-sizing: border-box;
      position: relative;

      .imgShadow {
        position: absolute;
        top: 0;
        left: -0.5rem;
        z-index: 1;
        height: 100%;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .img {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2;
        width: 100%;
        overflow: hidden;
        height: 1.8rem;
        background: url("../../assets/image/qqImg/act-list-empty.png") no-repeat center;
        background-size: 100% 100%;

        img {
          width: 100%;
          height: 100%;
          transition: all 0.2s;
        }

        img:hover {
          transform: scale(1.1);
        }
      }

      .actItemBottom {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        // height: 29%;
        height: 0.6rem;
        // padding: 0.2rem 0;
        padding: 0.1rem 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: #fff;
        box-sizing: border-box;
        border-radius: 0 0 0.2rem 0.2rem;
        box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.2);
        transition: background-color 0.5s;
        -moz-transition: background-color 0.5s;
        /* Firefox 4 */
        -webkit-transition: background-color 0.5s;
        /* Safari and Chrome */
        -o-transition: background-color 0.5s;
        /* Opera */
        z-index: 2;

        >div {
          width: 100%;
          height: 50%;
          text-align: left;
          padding-left: 0.2rem;
          box-sizing: border-box;
          align-items: center;

          // margin-top: 0.08rem;
          .actItemTime {
            padding: 0 0.12rem;
            margin-right: 0.2rem;
            // height: 0.24rem;
            // line-height: 0.24rem;
            height: 0.16rem;
            line-height: 0.16rem;
            border-radius: 0.12rem;
          }
        }

        >div:nth-child(1) {
          // font-size: 0.2rem;
          font-size: 0.15rem;
          font-weight: bold;
          color: #333333;
          margin-bottom: 0.05rem;
        }

        >div:nth-child(2) {
          // font-size: 0.16rem;
          font-size: 0.12rem;
          color: #999999;
        }
      }
    }

    .actItem:nth-child(2n) {
      margin-right: 0;
    }

    // .actItem:hover .actItemBottom {
    //   background-color: #32a0ed;
    //   div {
    //     color: white;
    //   }
    //   div:nth-child(2) {
    //     opacity: 0.6;
    //   }
    // }
    .isActive {
      .actItemBottom {
        background-color: var(--themeColor);
      }
    }
  }

  //回到顶部
  .el-backtop {
    right: calc((100% - 13.41rem) / 2 - 1.5rem) !important;
    width: auto;
    height: auto;
    border-radius: 0;
  }

  .actToTop {
    width: 0.4rem;
    height: 0.4rem;

    img {
      width: 100%;
    }
  }

  //loading样式
  .loadingGif {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    img {
      width: 0.33rem;
      height: 0.33rem;
      object-fit: cover;
    }
  }

  .isDisabledScroll {
    overflow: hidden !important;
  }

  //隐藏滚动条
  ::-webkit-scrollbar {
    width: 0rem;
  }
}
</style>
