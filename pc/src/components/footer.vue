<template>
  <div class="footer">
    <div class="footer-container">
      <div class="footer-items">        
        <div class="footer-item" v-for="(item, idx) in footerList" :key="idx + 'footer'">
          <div class="footer-item-title">
            {{ item.title }}
          </div>
          <ul>
            <li v-for="(childItem, childIdx) in item.children" :key="childIdx + 'childFooter'">
              <a :href="childItem.link">
                {{ childItem.title }}
              </a>
            </li>
          </ul>
        </div>
        <div class="footer-item">
          <div class="footer-item-title">
            {{ $t('Other') }}
          </div>
        </div>
      </div>
      <div class="bottom-icon1">
        <img src="../assets/image/qqImg/bottom-icon2.png" alt="">
      </div>
      <div class="bottom-description">
        <span >{{$t('是线上最佳国际博彩平台，我们平台提供多服务；体育到各种小游戏，我们体育拥有最全面的赛事滚球盘服务... ')}} </span>
        <span >{{$t('是线上最佳国际博彩平台，我们平台提供多服务；体育到各种小游戏，我们体育拥有最全面的赛事滚球盘服务。我们每日，每周和每月都享受有活动和赛事。玩家可通过电脑，平台和手机上在线观看个各种免费体验赛事直播。')}} </span>
      </div>
      <div class="bottom-icon1">
        <img :src="$config.getLocaleImg('bottom-icon1')">
      </div>
      <div class="bottom-copyright">
        {{ $t('@039 Bản quyền 2002-2023') }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
    'name': 'footers',
    data() {
        return {
            projectImgUrl: window.projectImgUrl,
            numVer: window.numVer,
            isShowRegister: false,
            projectName: window.projectName,
            footerList: [
                {
                    title: this.$t('Casino'),
                    children: [
                      {
                        title: this.$t('Reward'),
                        link: '/reward',
                      },
                      {
                        title: this.$t('Rebate'),
                        link: '/rebate',
                      },
                      {
                        title: this.$t('VIP'),
                        link: '/vip',
                      },
                      {
                        title: this.$t('Agent'),
                        link: '/agent',
                      },
                      {
                        title: this.$t('Event'),
                        link: '/event',
                      },
                      {
                        title: this.$t('Mission'),
                        link: '/mission',
                      },
                    ]
                },
                {
                    title: this.$t('Games'),
                    children: [
                      {
                        title: this.$t('Cock Fighting'),
                        link: '/cock_fighting',
                      },
                      {
                        title: this.$t('Cards'),
                        link: '/cards',
                      },
                      {
                        title: this.$t('Fishing'),
                        link: '/fishing',
                      },
                      {
                        title: this.$t('Slot'),
                        link: '/slot',
                      },
                      {
                        title: this.$t('Live'),
                        link: '/live',
                      },
                      {
                        title: this.$t('Sports'),
                        link: '/sports',
                      },
                      {
                        title: this.$t('Lottery'),
                        link: '/lottery',
                      },
                    ]
                },
                {
                    title: this.$t('Support'),
                    children: [
                      {
                        title: this.$t('Online Service'),
                        link: '/online_service',
                      },
                      {
                        title: this.$t('Feedback to get rewards'),
                        link: '/feedback',
                      },
                      {
                        title: this.$t('Help Center'),
                        link: '/help_center',
                      },
                    ]
                },
                {
                    title: this.$t('Quick Login'),
                    children: [
                      {
                        title: this.$t('Link Facebook'),
                        link: '/link_facebook',
                      },
                      {
                        title: this.$t('Link Google'),
                        link: '/link_google',
                      },
                    ]
                },
                {
                    title: this.$t('Introduction'),
                    children: [
                      {
                        title: this.$t('039'),
                        link: '/039',
                      },
                    ]
                },
            ],
            'article': [
                this.$t('联络我们')
                // "代理加盟",
                // "关于我们",
                // "存款帮助",
                // "取款帮助",
                // "常见问题"
            ],
            isShow: true,
        };
    },
    mounted() {},
    'methods': {
    // 在线客服
        onlineTalk(){
          if (window.projectImgUrl === 'betc88') { // betcome直接跳客服窗口
            const url = this.$common.getCustomerService();
            window.open(url, "_blank");
            return;
          }
               //新旧客服判断
           if(window.customerServiceStatus == 1){  //新客服
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
                let url = location.origin + "/func" + "/customerService/pc?s=" +str;
                window.open(url, "_blank");
            }else{ //旧客服
                  const url = this.$common.getCustomerService();
                  window.open(url, "_blank");
            }
        },
        openPage(index) {
            if (index == 1) {
                this.$router.push('/agent');
            }else if(index == 0){
                this.onlineTalk();
            }
        }
    }
};
</script>
<style lang="less" scoped>
.footer {
  width: 100%;
  // width: 1200px;
  // height: 374px;
  overflow: hidden;
  background: #FFF;
  .footer-container {
    width: 12rem;
    margin: 0 auto;
    .footer-items {
      display: flex;
      justify-content: space-between;
      .footer-item {
        .footer-item-title {
          color: #333;
          font-size: .2rem;
          font-weight: 400;
          line-height: .29rem;
          margin-bottom: 0.12rem;
        }
        a {
          color: #999;
          cursor: pointer;
          display: block;
          font-size: .2rem;
          line-height: .29rem;
          margin-bottom: 0.1rem;
          transition: color .5s ease-in-out;
        }
        a:hover {
          color: #866638;
        }
      }
    }
    .bottom-icon1 {
      width: 100%;
      margin-bottom: 0.5rem;
      background: #222;
      img {
        width: 100%;
      }
    }
    .bottom-description {
      color: #999;
      font-size: .16rem;
      line-height: 1.66;
      word-break: break-all;
    }
    .bottom-copyright {
      border-top: 1px solid #CCC;
      color: #999;
      padding: 0.5rem 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.bottom-icon1{
  width: 1200px;
  position: relative;
  margin: 40px auto 0;
}
.bottom-icon2{
  width: 1200px;
  margin: 40px auto;
  text-align: center;
  font-size: 30px;
  p{
    color: #fff;
    margin: 40px auto;
  }
}
</style>