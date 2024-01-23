<template>
  <view>
    <view class="game-hot" v-if="hotGameList.length>0">
      <view class="item-region"  v-for="(item,index) in hotGameList" :key="index"  @click="onClick(item)">
        <view class="game-item">
          <img :class="{'item-favorite': true, 'active': item.isFavorite}" :src="require('@/static/image/qqImg/' + (item.isFavorite ? 'btn_sc_on_2' : 'btn_sc_off_2') + '.png')"/>
          <img loading="lazy" class="img" :src="item.pictureUrl?($config.imgHost+item.pictureUrl) : item.imgUrl?($config.imgHost+item.imgUrl):''" :onError="noData">
        </view>
        <view class="title">{{item.name}}</view>
      </view>      
    </view>
    <view class="no-game" v-if="hotGameList.length == 0">
      <img :src="require('@/static/image/qqImg/img_none_sj.png')"/>
      <view class="no-game-text">{{ $t('无记录') }}</view>
    </view>
  </view>
</template>
<script>
import api from '@/utils/api'; //接口名字
export default {
    props:['hotGameList','index'],
    data() {
        return {
            noData: 'this.src="' + require("@/static/image/indexImg/searchlost.png") + '"',
        }
    },
    methods: {
      onClick(item) {
        console.log('clicking...')
        this.$emit('goGameDataClick', {
          item
        })
      },
      //点击进入游戏
      async getToken(req) {
          let self = this;
          var issafariBrowser =
              /Safari/.test(navigator.userAgent) &&
              !/Chrome/.test(navigator.userAgent);
          if (!self.$server.getUser()) {
              // self.showLogin = true;
              // self.$message.warning(self.$t('请先进行登录'));
              this.$common.openLogin()
              return;
          }
          let tenantId = self.$server.getUser().tenant_id;
          let username = self.$server.getUser().username;
          let uid = self.$server.getUser().user_id;
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
      width: 33.33%;
      margin: 0.1rem 0;
      text-align: center;
      cursor: pointer;

      .game-item{
        min-width: 120upx;
        min-height: 120upx;
        color: #fff;
        font-size: 20px;
        position: relative;
        // border: 3px solid #fead00;
        border-radius: 0.18rem;
        overflow: hidden;
        text-align: center;        
        width: fit-content;
        height: fit-content;
        max-width: 100%;
        max-height: 100%;
        margin: 0 auto;
        .item-favorite {
          position: absolute;
          right: 10upx;
          top: 10upx;
          width: 40upx;
          height: 40upx;
          cursor: pointer;
        }
        .item-favorite.active {
          position: absolute;

        }
        img{
          width: 128upx;
          height: 128upx;
          border-radius: 8upx;
          margin: 10px auto 0px auto;
        }
      }
      
      .title{
          text-align: center;
          text-overflow: ellipsis;
          font-size: 22upx;
          overflow: hidden;
          color: #666666;
          padding: 0 20upx;
          overflow-wrap: break-word; /* For newer browsers */
          word-wrap: break-word;     /* For older browsers */
          white-space: normal;       /* Allow wrapping */
          // background-color: #fead00;
        }
    }
    
  }
  .no-game {
    display: flex;
    flex-direction: column;
    min-height: 400upx;
    justify-content: center;
    align-items: center;
    img {
      width: 200upx;
    }
    .no-game-text {
      margin-top: 12upx;
      font-size: 20upx;
    }
  }
</style>