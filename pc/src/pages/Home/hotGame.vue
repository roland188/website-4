<template>
  <div>
    <div class="game-hot" v-if="hotGameList.length>0">
      <div class="item-region"  v-for="(item,index) in hotGameList" :key="index" >
        <div class="game-item" @click="onClick">
          <img :class="{'item-favorite': true, 'active': item.isFavorite}" :src="require('../../assets/image/qqImg/' + (item.isFavorite ? 'btn_sc_on_2' : 'btn_sc_off_2') + '.png')"/>
          <img loading="lazy" class="img" :src="item.pictureUrl?($config.imgHost+item.pictureUrl) : item.imgUrl?($config.imgHost+item.imgUrl):''" :onError="noData">
        </div>
        <p class="title">{{item.name}}</p>
      </div>      
        <!--以下看需要添加-->
        <!-- <div class="swiper-button-prev" :class="'swiper-button-prev' + index"></div>
        <div class="swiper-button-next" :class="'swiper-button-next' + index"></div> -->
    </div>
    <div class="no-game" v-if="hotGameList.length == 0">
      <img :src="require('../../assets/image/qqImg/img_none_sj.png')"/>
      <span>{{ $t('无记录') }}</span>
    </div>
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
      onClick() {
        let realIndex = ''
        switch(this.index){
          case 0:
            realIndex = this.$refs.mySwiper0.$swiper.realIndex //获取下标
          break
          case 1:
            realIndex = this.$refs.mySwiper1.$swiper.realIndex //获取下标
          break
          case 2:
            realIndex = this.$refs.mySwiper2.$swiper.realIndex //获取下标
          break
        }
        console.log(realIndex,'realIndex')
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
    display: flex;
    flex-wrap: wrap;
    .item-region {
      width: 12.5%;
      margin: 0.1rem 0;
      text-align: center;
      cursor: pointer;

      .game-item{
        min-width: 1rem;
        min-height: 1rem;
        color: #fff;
        font-size: 20px;
        position: relative;
        // border: 3px solid #fead00;
        border-radius: 0.18rem;
        overflow: hidden;
        text-align: center;        
        width: fit-content;
        height: fit-content;
        margin: 0 auto;
        .item-favorite {
          position: absolute;
          right: 0.06rem;
          top: 0.06rem;
          width: 0.3rem;
          height: 0.3rem;
          cursor: pointer;
        }
        .item-favorite.active {
          position: absolute;

        }
        img{
          width: 1rem;
          height: 1rem;
          border-radius: 0.18rem;
          margin: 10px auto;
        }
        .title{
          text-align: center;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: .2rem;
          overflow: hidden;
          color: #666666;
          // background-color: #fead00;
        }
      }
    }
    
  }
  .no-game {
    display: flex;
    flex-direction: column;
    min-height: 4.82rem;
    justify-content: center;
    align-items: center;
    img {
      width: 2.1rem;
    }
    span {
      margin-top: 0.2rem;
    }
  }
</style>