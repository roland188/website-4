<template>
    <div class="game-hot">
        <swiper :ref="'mySwiper'+index" :options="swiperOption" v-show="hotGameList.length>0" @click-slide="onClick">
            <swiper-slide class="item" v-for="(item,index) in hotGameList" :key="index" >
                <img loading="lazy" class="img" :src="item.pictureUrl?($config.imgHost+item.pictureUrl) : item.imgUrl?($config.imgHost+item.imgUrl):''" :onError="noData">
                <p class="title">{{item.name}}</p>
            </swiper-slide>
        </swiper>
        <!--以下看需要添加-->
        <div class="swiper-button-prev" :class="'swiper-button-prev' + index"></div>
        <div class="swiper-button-next" :class="'swiper-button-next' + index"></div>
    </div>
</template>
<script>
import api from '../../utils/api'; //接口名字
export default {
    props:['hotGameList','swiperOption','index'],
    data() {
        return {
            noData: 'this.src="' + require("@/assets/image/pubilc/searchlost.png") + '"',
        }
    },
    methods: {
      onClick(){
        // console.log(index,realIndex,'realIndex')
        let realIndex = ''
        switch(this.index){
          case 0:
            realIndex = this.$refs.mySwiper0.$swiper.clickedIndex //获取下标
          break
          case 1:
            realIndex = this.$refs.mySwiper1.$swiper.clickedIndex //获取下标
          break
          case 2:
            realIndex = this.$refs.mySwiper2.$swiper.clickedIndex //获取下标
          break
        }
        console.log(realIndex,'this.$refs.mySwiper0.$swiper.realIndex')
        let item = this.hotGameList[realIndex];
        this.getToken(item);
      },
      //点击进入游戏
      async getToken(req) {
          let self = this;
          var issafariBrowser =
              /Safari/.test(navigator.userAgent) &&
              !/Chrome/.test(navigator.userAgent);
          if (!self.$common.getUser()) {
              // self.showLogin = true;
              // self.$message.warning(self.$t('请先进行登录'));
              this.$common.openLogin()
              return;
          }
          let tenantId = self.$common.getUser().tenant_id;
          let username = self.$common.getUser().username;
          let uid = self.$common.getUser().user_id;
          let datas = {
              'tenantId': tenantId,
              'username': username,
              'gameId': req.id,
              'clientIp': self.$config.clientIp,
              'memberId': uid,
              'terminalType': 1
          };
          self.$common.setGameRequestData(datas);

          const res = await self.$http.post(api.getToken, datas, true);
          if (res.code == 0) {
              window.open(res.data);
          } else {
              if (req.openMode === 1) {
                  self.winOpen.location.href = '/error.html?type=1';
              }
              if (req.status === 0) {
                  self.$message.error(self.$t('维护中'));
              } else {
                  self.$message.error(self.$t('进入游戏失败，请稍后重试'));
              }
          }
      },
    }

}
</script>
<style lang="scss" scoped>

.game-hot{
    width: 100%;
    .swiper-button-prev{
      position: absolute;
      right: 32px;
      left: inherit;
      top: 5px;
      width: 32px;
      height: 32px;
      font-size: 12px;
      border: 1px solid #fff !important;
      color: #fead00 !important;
      &::after{
        font-size: 14px;
      }
    }
    
    .swiper-button-next{
      position: absolute;
      right: 0;
      left: inherit;
      top: 5px;
      width: 32px;
      height: 32px;
      border: 1px solid #fff !important;
      color: #fead00 !important;
      font-weight: 700;
      border-left: none;
      &::after{
        font-size: 14px;
      }
    }
    .item.swiper-slide{
      position: relative;
      width: 220px !important;
      height: 236px;
      color: #fff;
      font-size: 20px;
      border: 3px solid #fead00;
      border-radius: 15px;
      overflow: hidden;
      cursor: pointer;
      text-align: center;
      img{
        width: 160px;
        height: 160px;
        border-radius: 20px;
        margin: 20px auto;
      }
      .title{
        line-height: 36px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        background-color: #fead00;
      }
    }
  }
</style>