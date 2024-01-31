<template>
  <view class="scs-page ny-bg-image" :style="'padding-top: var(--status-bar-height);background-image: url(' + $config.themeImgUrl('index/bg') + ')'">
    <header-service :isHideBack="false"  v-show="!['Dispensing','Savemoney'].includes(currPage)"  :title="getShowTitle()"
                    @jump="jump" />
    <!--    新客服开始-->
    <view class="home-wrap" v-if="$config.customerServiceStatus === 1" style="width: 100%;">
      <view class="line" style="width: 120%;opacity: .7;"></view>
      <view class="home-up" v-if="showList">
        <view class="home-title">
          <view class="left-icon"> </view>
          <view class="right-text"> {{ $t1('客服自助处理中心') }} </view>
        </view>
        <view class="content-wrap">
          <view class="content-item" :class="item.w_100 ? 'w_100' : ''" v-show="item.isShow == 1"
                v-for="(item, index) in serverList" :key="index" @click="gotoDetail(item)">
            <image :src="item.icon" mode="aspectFit" class="content-icon"></image>
            <view class="content-title">
              {{ item.title }}
            </view>
          </view>
        </view>
        <view class="home-down" v-if="showList">
          <view class="center">
            <view v-show="customer==1" @tap="go24serve">
              <image :src="$config.themeImgUrl('serve/h-icon11')" mode="aspectFill" style="width: 40upx; height: 40upx">
              </image>
              <view class="customer flash"> {{ $t1('24H客服中心') }} </view>
            </view>
            <view v-show="customer_phone==1" @tap="goToPhoneser">
              <image :src="$config.themeImgUrl('login/phone')" mode="aspectFill" style="width: 40upx; height: 40upx">
              </image>
              <view class="customer"> {{ $t1('电话客服') }} </view>
            </view>
          </view>
        </view>
      </view>
      
			<view v-if="getProjectImgUrl()">
			  <!-- 轮播 -->
        <swipper-banner 
          :swiperList="bannerList" 
          v-if="bannerList.length > 0 && getProjectImgUrl()"
          @handleSwipperItem="handleSwipperItem" 
          :autoplay="autoplay" 
          indicatorDots :heightBox="182"></swipper-banner>
      </view>
      <view class="home-down">
        <view class="tips">
          <!-- 政府颁发执照，安全有保障！支持微信、支付宝、银联服务，24小时取款，5分钟到账！受国际协会认可的合法公司。进行注册并娱乐前，请确保您年满18周岁！！ -->
        </view>
      </view>
    </view>
    <!--    新客服结束-->
    <!-- 老客服开始 -->
    <view class="customerUl" v-else>
      <view v-if="appMerge" class="customeList">
        <view class="customeLeft">
          <image class="customeImg" :src="'../../static/image/imgUrl1.png'" mode="widthFix"></image>
          <view class="customeCon">
            <view class="customName"> {{ $t1('在线客服') }} </view>
            <view class="customeNumber"> </view>
          </view>
        </view>
        <view class="customeRight">
          <view @click="goCustomer(appMergeUrl)" class="customeBtn server-btn"> {{ $t1('联系客服') }} </view>
        </view>
      </view>
      <view v-else class="customeList" v-for="(item, index) in customerData" :key="index">
        <view class="customeLeft">
          <image class="customeImg" v-if="$config.clientCode === 'tyca'" src="../lib/image/imgUrl1.png" mode="widthFix"></image>
          <image class="customeImg" v-else :src="require('../lib/image/imgUrl'+ (index + 1) +'.png')" mode="widthFix"></image>
          <view class="customeCon">
            <view class="customName">
              {{ item.name }}
            </view>
            <view class="customeNumber">
              {{ item.number }}
            </view>
          </view>
        </view>
        <view class="customeRight">
          <view @click="goCustomer(item.url, item.name)" v-if="item.url" class="customeBtn"> {{ $t1('联系客服') }} </view>
          <view v-else class="customeBtn" @click="copy(item.number)"> {{ $t1('复制账号') }} </view>
        </view>
      </view>
    </view>
    <!-- 老客服结束 -->
    <service-popup ref="serDialog" :list="domainList" />
    <myTabBar  v-if="$config.myTabBar" :current="$config.myTabBar.index" />
  </view>
</template>

<script>
	import {
		_get
	} from "../lib/server.js";
	import api from "../lib/api";
import headerService from "./header/header2.vue";
import theme from "./common/theme"
import i18nT from '../mixins/i18n'
import myTabBar from "@/components/myTabBar/index.vue";
import swipperBanner from "../components/swipper-banner.vue"
import servicePopup from "../components/servicePopup.vue"
export default {
  components: {
    headerService,
    swipperBanner,
	myTabBar,
    servicePopup
  },
  mixins: [i18nT,theme],
  data() {
    return {
      erver24: '',
      appMerge: false,
      domainList: [],
      serverList: [{
        id: 1,
        icon: '/static/image/theme/' + this.$config.theme + '/serve/h-icon1.png',
        title: this.$t1("忘记登录密码"),
        w_100: false,
        path: 'ForgetPassword',
        isShow: 1
      },
        {
          id: 2,
          icon: '/static/image/theme/' + this.$config.theme + '/serve/h-icon2.png',
          title: this.$t1("出款未到账"),
          w_100: false,
          path: 'Dispensing',
          isShow: 1
        },
        {
          id: 3,
          icon: '/static/image/theme/' + this.$config.theme + '/serve/h-icon3.png',
          title: this.$t1("申请账号解冻"),
          w_100: false,
          path: 'AccountThaw',
          isShow: 1
        },
        {
          id: 4,
          icon: '/static/image/theme/' + this.$config.theme + '/serve/h-icon4.png',
          title: this.$t1("忘记取款密码"),
          w_100: false,
          path: 'Withdrawal',
          isShow: 1
        },
        {
          id: 5,
          icon: '/static/image/theme/' + this.$config.theme + '/serve/h-icon5.png',
          title: this.$t1("修改银行名称"),
          w_100: false,
          path: 'Bankname',
          isShow: 1
        },
        {
          id: 6,
          icon: '/static/image/theme/' + this.$config.theme + '/serve/h-icon6.png',
          title: this.$t1("修改银行卡号"),
          w_100: false,
          path: 'Bankcard',
          isShow: 1
        },
        {
          id: 7,
          icon: '/static/image/theme/' + this.$config.theme + '/serve/h-icon7.png',
          title: this.$t1("入款未到账"),
          w_100: false,
          path: 'Savemoney',
          isShow: 1
        },
        {
          id: 8,
          icon: '/static/image/theme/' + this.$config.theme + '/serve/h-icon8.png',
          title: this.$t1("投诉与建议"),
          w_100: false,
          path: 'Suggestion',
          isShow: 1
        },
        {
          id: 9,
          icon: '/static/image/theme/' + this.$config.theme + '/serve/h-icon9.png',
          title: this.$t1("自助优惠申请"),
          w_100: true,
          path: 'Apply',
          isShow: 1
        },
        {
          id: 10,
          icon: '/static/image/theme/' + this.$config.theme + '/serve/h-icon10.png',
          title: this.$t1("常见问题帮助中心"),
          w_100: true,
          path: 'Problem',
          isShow: 1
        },
      ],
      bannerList:[],
      autoplay:false,
    };
  },
  mounted() {
	  // #ifdef H5
	  document.title = window.projectName
	  // #endif
    this.initDataConfig(this.option.data)
    if (!this.showList) {
      uni.showLoading({
        title: this.$t1('加载中...'),
        mask: true
      });
    };
    this.getBanner()
    setTimeout(() => {
      this.getFrontList()
      this.getLink()
    }, 0)
    // 旧客服
    if (this.$config.customerServiceStatus == 0) {
      this.customerGetList();
    }
  },
  methods: {
    getLink() {
				_get(api.allHour).then(res => {
					if (res.code == 0) {
						if (this.$config.childCode === 'wyyl' || this.$config.childCode === 'amjs' || this.$config.childCode === 'wyjt') {
							this.server24 = res.data.domain
						} else {
							this.domainList = res.data.list
							if (res.data.list.length === 1) {
								// #ifdef APP-PLUS
								this.setLinkApp(res.data.domain)
								// #endif
								// #ifdef H5
								this.setLinkH5(res.data.domain)
								// #endif
							}
						}
					}
				})
			},
      // 获取轮播图
			getBanner() {
				this.$server.get("/longm/api/v1/banners/app/list/16", null, (err,res)=>{
					if(err) {
						this.autoplay = false
					} else {
						this.bannerList = res;
						this.autoplay = true
					}
				}, false);
			},
			getProjectImgUrl(){
				let projectImgUrl = this.$config.projectImgUrl
				if(projectImgUrl == 'tbh' || projectImgUrl == 'ybyl'
				|| projectImgUrl == 'ffbc' || projectImgUrl == 'aygj') return true
			},
			setLinkH5(domain) {
				if (domain.startsWith('http')) {
					if (domain.includes('/chat/index.html')) {
						let startIndex = domain.indexOf("/chat/");
						if (startIndex !== -1) {
							let result = domain.substring(startIndex);
							this.server24 = result;
							console.log('server24', this.server24)
						} else {
							this.server24 = domain;
						}
					} else {
						this.server24 = domain;
					}
				} else {
					this.server24 = domain;
				}
			},
			setLinkApp(domain) {
				if (domain.startsWith('http')) {
					if (domain.includes('/chat/index.html')) {
						let startIndex = domain.indexOf("/chat/");
						if (startIndex !== -1) {
							let result = domain.substring(startIndex);
							this.server24 = this.$config.host + result;
						} else {
							this.server24 = domain;
						}
					} else {
						this.server24 = domain
					}
				} else if (domain.startsWith('/chat/')) {
					this.server24 = this.$config.host + domain;
				} else {
					this.server24 = domain
				}
			},
			jumpType() {
				// #ifdef H5
				window.location.href = this.server24
				// #endif
				// #ifdef APP-PLUS
				uni.setStorageSync('newServer24', this.server24)
				setTimeout(() => {
					uni.navigateTo({
						url: "/pages/webView/webView?url=" + 'newServer24'
					});
				}, 300)
				// #endif
			},
			go24serve() {
				// aygj  ffyl 增加埋点
				if(['aygj','ffyl','ffty'].includes(this.$config.childCode)){
					// #ifdef H5
					_paq.push(['trackEvent',  'H5_clickServerInit_' + this.$config.childCode, 'H5_clickServerInit_' + this.$config.childCode, this.$t1('点击客服开始'), '775599']);
					// #endif
					// #ifdef APP-PLUS
					this.$matomoRequest('','',['clickServerInit_' + this.$config.childCode,this.$t1('点击客服开始'), '775599'])	
					// #endif
				}
				if (['wyyl','amjs','wyjt'].includes(this.$config.childCode)) {
					this.jumpType()
				} else {
					if (this.domainList.length === 1) {
						this.jumpType()
					} else {
						this.$refs.serDialog.open()
						return
					}
				}

			}
  },
};
</script>

<style lang="scss" scoped>
.home-wrap {
  // min-height: calc(100vh - 90upx);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  // border-top: 1px solid var(--border1);

  .home-up {
    width: 100%;
    padding: 0 30upx;
    // background-color: #fff;

    .home-title {
      display: flex;
      align-items: center;
      height: 106upx;
      line-height: 106upx;

      .left-icon {
        width: 8upx;
        height: 40upx;
        background: var(--btnC1);
        border-radius: 8upx;
        margin-right: 20upx;
      }

      .right-text {
        // color: #2c3e50;
        font-size: 28upx;
      }
    }

    .content-wrap {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-content: flex-start;
      flex-wrap: wrap;

      .content-item {
        width: 48%;
        height: 134upx;
        border-bottom: 1px solid var(--border1);
        border-right: 1px solid var(--border1);
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        background: var(--theme2);
        margin: 12upx 0px;
        border-radius: 18upx;
        opacity: .8;

        .content-icon {
          width: 40upx;
          height: 40upx;
        }

        .content-title {
          font-size: 30upx;
          font-family: PingFang SC;
          font-weight: 700;
          // color: #1d1717;
          opacity: 1;
          padding-left: 20upx;
        }
      }

      // .content-item:nth-child(2n + 1) {
      // 	border-right: 1px solid #f7f8f9;
      // }

      .w_100 {
        width: 100%;
      }
    }
  }

  .home-down {
    width: 100%;
    height: 220upx;
    // background-color: #fff;
    position: relative;

    .center {
      display: flex;
      // flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-top: 20upx;

      &>uni-view {
        text-align: center;
        width: 50%;
        line-height: 1.1 !important;
      }

      .customer {
        font-family: PingFang SC;
        color: var(--textC1);
        font-weight: 500;
        font-size: 28upx;
      }

      .flash {
        animation: flashing 2s linear infinite;
      }

      @keyframes flashing {
        0% {
          color: var(--textC1);
        }

        25% {
          color: var(--textC2);
        }

        50% {
          color: var(--textC1);
        }

        75% {
          color: var(--textC2);
        }

        100% {
          color: var(--textC1);
        }
      }
    }

    .tips {
      width: 120%;
      height: 90upx;
      font-size: 24upx;
      transform: scale(0.76);
      position: absolute;
      left: -60upx;
      bottom: 10upx;
      opacity: 0.8;
      overflow-y: auto;
    }
  }
}
.getHeight{
  height: calc(100vh - 120upx);
}
.customerService {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.customerUl {
  overflow-y: auto;
  padding: 20upx;
}

.customeList {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30upx;
  background-color: #fff;
  border-radius: 12upx;
  height: 160rpx;
  font-size: 28upx;
  width: 94%;
  margin:20upx auto;
}

.customeLeft {
  flex-grow: 1;
  display: flex;
  align-items: center;
}

.customeRight {
  /* flex-grow: 0;
   flex-shrink: 0; */
  background: linear-gradient(270deg, #C08B43 0%, #F2E8D9 100%);
  opacity: 0.8;
  width: 160upx;
  height: 60upx;
  /* line-height: 40upx; */
  border-radius: 8upx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24upx;
  color: var(--textC3);
}

.customeImg {
  width: 100upx;
  margin-right: 20upx;
  height: auto;
}

.customName {
  font-size: 30upx;
}

.customeNumber {
  font-size: 24upx;
  margin-top: 10upx;
  color: #666;
}

.customeBtn {
  width: 170upx;
  height: 76upx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 64upx;
  background: var(--loginNewBtn);
  color: #fff;
}

.server-btn{
  // background: #040404;
  color: #fff;
}

</style>
