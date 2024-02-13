<template>
  <div class="footer">
    <div class="bt_title" v-if="projectImgUrl != 'bgga'">
      <a href="https://www.gotechgroup.com/">
        <div class="top-title">
          <div>
            <p>{{$t('官方合作伙伴')}}</p>
            <p>{{$t('阿尔梅里亚大学和 GTG')}}</p>
          </div>
          <img loading="lazy"
              v-lazy="require('../../../../assets/image/qqImg/icon-title2.png')" />
          <img loading="lazy" class="vip"
              v-lazy="require('../../../../assets/image/qqImg/icon-title1.png')" />
        </div>
      </a>
    </div>
    <div class="title_items">
      <div class="title">{{$t('信息')}}</div>
      <div class="list">
        <div class="items"
          v-for="(item,index) in list"
          :key="index">
          <p class="title">{{item.name}}</p>
        </div>
      </div>
    </div>
    <div class="logo-bg">
      <div class="logo-left">
        <img :src="$config.pcLogo ? $config.imgHost + $config.pcLogo : $common.getTitleImgUrl('Logo')" >
        <div>
          <span v-show="isShow">{{ projectName }} {{$t('是线上最佳国际博彩平台，我们平台提供多服务；体育到各种小游戏，我们体育拥有最全面的赛事滚球盘服务... ')}} </span>
          <span v-show="!isShow">{{ projectName }} {{$t('是线上最佳国际博彩平台，我们平台提供多服务；体育到各种小游戏，我们体育拥有最全面的赛事滚球盘服务。我们每日，每周和每月都享受有活动和赛事。玩家可通过电脑，平台和手机上在线观看个各种免费体验赛事直播。')}} </span>
          <span class="btn" @click="isShow = !isShow">{{$t('更多')}}</span>
        </div>
      </div>
      <div class="content-right">
        <!-- PHƯƠNG THỨC THANH TOÁN  -->
        <div class="logo-titlt">{{$t('支付方式')}}</div>
        <img src="../../../../assets/image/qqImg/logo-right.png" alt="">
      </div>
    </div>
    <div class="bottom-icon1">
      <img :src="$config.getLocaleImg('bottom-icon2')">
    </div>
    <div class="bottom-icon2">
      <p>{{$t('供应商')}}</p>
      <img src="../../../../assets/image/qqImg/bottom-icon2.png" alt="">
    </div>
    <!-- 展示列表 -->
    <!-- <div class="article_list">
      <span v-for="(item,index) in article" :key="index" @click="openPage(index)">{{item}}</span>
    </div> -->
    <!-- 防伪标志 -->
    <div class="anit_mark">
      <!-- Copyright © {{ new Date().getFullYear() }}  -->
      {{ { 
        amxpj: 'Grand Lisboa Casino', 
        amwnsr: 'Macau Venetian', 
        bgga: 'Copyright ©2023 BG.game', 
        gtgame: 'GoTech' }[projectImgUrl] || `Copyright © ${projectName}- BẢN NÂNG CẤP MỚI🔥TRANG WEB CHÍNH THỨC 🌐ĐẢM BẢO UY TÍN✔️ Reserved` }} 
      <!-- Reserved @v{{numVer}} -->
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
            list: [
                {
                    name: this.$t('关于我们'),
                },
                {
                    name: this.$t('隐私政策'),
                },
                {
                    name: this.$t('条件条款'),
                },
                {
                    name: this.$t('常见问题解答'),
                },
                {
                    name: this.$t('免责声明'),
                },
                {
                    name: this.$t('负责任地玩'),
                },
                {
                    name: this.$t('愿景使命'),
                },
                {
                    name: this.$t('促销条款'),
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
          if (['vi'].includes(window.locale)) { // betcome直接跳客服窗口
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
  margin: 0 auto;
  background: linear-gradient(180deg,#fff,#cff0fe 30%,#fff 70%);
  .list {
    overflow: hidden;
    .items {
      width: 240px;
      float: left;
      &:hover{
      .title {
        color: #fead00;
      }

      }
      .title {
        text-align: center;
        color: #000;
        font-size: 20px;
      }
    }
  }
  .cooperation {
    width: 1200px;
    margin-top: 20px;
    padding-bottom: 27px;
    border-bottom: 1px solid #1a1a1a;
    overflow: hidden;
    display: flex;
    justify-content: center;
    .item {
      height: 31px;
      overflow: hidden;
      float: left;
      margin-right: 10px;
      cursor:pointer;
      &:hover {
        background-position: 50% 100%;
      }
    }
  }
  .article_list {
    width: 1200px;
    margin-top: 20px;
    text-align: center;
    color: #b4b4b4;
    span {
      display: block;
      cursor: pointer;
      font: 14px/14px normal;
      &:nth-child(n + 2) {
        border-left: 1px solid #505050;
      }
      &:nth-child(2) {
        animation: changecolor 1s infinite;
      }
      &:hover {
        color: orange;
      }
    }
  }
  .anit_mark {
    width: 100%;
    margin: 21px auto 0;
    line-height: 60px;
    color: #000;
    font-size: 16px;
    background: linear-gradient(180deg,hsla(0,0%,100%,.92),#8bdbff);
    text-align: center;
  }
}
@keyframes changecolor {
  0% {
    color: white;
  }
  100% {
    color: rgb(226, 194, 125);
  }
}
.bt_title{
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #25aae1;
  .top-title{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 120px;
    color: #fff;
    font-size: 24px;
    .vip{
      padding-left: 25px;
      margin: 0;
      border-left: 1px solid #8b8b8b
    }
    img{
      margin: 0 20px;
    }
  }
}
.title_items{
  width: 1200px;
  color: #000;
  margin: 40px auto;
  text-align: center;
  .title{
    font-size: 30px;
    margin: 20px 0;
    text-align: center;
    cursor: pointer;
  }
  .list{
    display: grid;
    font-size: 20px;
    grid-template-columns: repeat(4,1fr);
  }
}
.logo-bg{
  width: 1200px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin: 80px auto 0;
  color: #000;
  .logo-left{
    width: 50%;
    font-size: 16px;
    img{
      max-width: 350px;
      margin-bottom: 30px;
    }
    .btn{
      color: #f97316;
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .content-right{
    font-size: 24px;
    img{
      margin-top: 40px;
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