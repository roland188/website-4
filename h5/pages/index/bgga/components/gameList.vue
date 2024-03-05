<!-- 游戏列表 -->
<template>
  <view class="game_content">
    <view class="game-item">
      <view class="game-list" v-for="(item,index) in leftArray">
        <view class="game-title">
          <view class="title">
            <image class="img" :src="getMyImg(item)" mode="acpectFit"></image>
            {{ item.name }}
          </view>
          <view class="right-all" 
            v-if="index != 0"
            @tap="toGamePage(item,index)">{{ $t('查看全部') }}</view>
        </view>
        <view class="swiper-wrap" v-if="index == 0">
          <scroll-view
            :enable-flex="true"
            scroll-with-animation
            :throttle="false"
            :scroll-left="0"
            :scroll-x="false"
            class="game-scroll"
          >
            <view class="game-li1"
             :class="{'game-li2' : item.children.length > 5}">
              <view
                class="item"
                :key="i"
                v-for="(li,i) in item.children"
                @tap="difference(li, 1)"
              >
                <image class="img" mode="widthFix"
                    :src="li.imgUrlApp
                        ? $config.getImgUrl(li.imgUrlApp)
                        : li.pictureUrl
                        ? $config.getImgUrl(li.pictureUrl)
                        : noDate">
                </image>
              </view>
            </view>
          </scroll-view>
        </view>
        <view class="swiper-wrap" v-if="index != 0">
          <scroll-view
            :enable-flex="true"
            scroll-with-animation
            :throttle="false"
            :scroll-left="0"
            :scroll-y="false"
            class="game-scroll"
          >
            <view class="game-li1" :class="{'game-li2' : paysList.length > 5}">
              <view
                class="item"
                :key="i"
                v-for="(li,i) in gameList(item.id)"
                @tap="difference(li, item.type)"
              >
                <image class="img" mode="widthFix"
                    :src="li.imgUrlApp
                        ? $config.getImgUrl(li.imgUrlApp)
                        : li.pictureUrl
                        ? $config.getImgUrl(li.pictureUrl)
                        : noDate">
                </image>
                <view class="gamename">{{ li.name }}</view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    arr: Array,
    leftArray: Array,
    paysList: Array,
    gamemenusparent: [Object, Array],
  },
  data() {
    return {
      navTop: 0, // 滚动的高度
      navIndex: 0, //左侧列表索引
      noDate: require("@/static/image/gameerror.png"),
      viewId:'',
      pgList:[]
    };
  },
  computed:{
  },
  created(){
    this.getData({gameKindId:1,vendorId:2000})
    console.log(this.leftArray,'this.leftArray')
  },
  methods: {
    gameList(id){
      let list = this.paysList[id]
      if(id == 9){
        // this.leftArray.forEach(i => {
        //   if(i.id === 9){
        //     return list = i.children
        //   }
        // })
        return list = this.pgList
      }
      if(!list) return
      let idx = 9
      if(id == 2){
        idx = 3
      }else if(list.length < 9){
        idx = list.length
      }
      return list.slice(0,idx)
    },
    getMyImg(item) {
      if(item.id == 0) {
          return item.menuIconActiveApp
      }
      return this.$config.getImgUrl(item.menuIconApp)
    },
    getHeight(item){
      let height = ''
      if(item.children.length < 5){
        height = 320
      }else if(item.children.length > 5){
        height = 640
      }else if(item.children.length >18){
        return height = 960
      }else{
        return height = 1280
      }
      return `height:${height}rpx`
    },
    toGamePage(item,index){
      uni.navigateTo({
          url: `/pages/gamePage/gamePage?index=${item.id}`,
      });
    },
    difference(item,type) {
      this.$emit("difference", item,type);
    },
    // 厂商游戏数据
    getData(data) {
      let self = this;
      let req = {
        gameKindId:  data.gameKindId,
        status: 1,
        currentPage: 1,
        pageSize: 9,
        vendorId: data.vendorId,
      }
      self.$api.gamePageList(
        req,
        function (err, res) {
          if (err) {
            console.log("%c" + "gameSearch", "color:#a70a0a;", err);
          } else {
            self.pgList.push(...res.list)
          }
        },
        true
      );
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep  
.swiper-wrap{
  width: 100%;
  .swiper{}
  .uni-swiper-slide-frame{
    display: grid;
    gap: 20upx 24upx;
    grid-template-rows: repeat(3,2fr);
    flex-wrap: wrap;
    flex-direction: column;
  }
  .item{
    height: 249rpx;
    // margin-right: 30rpx;
    border-radius: 20rpx;
    overflow: hidden;
   .img{
    height: 100%;
   } 
   .gamename{
    text-align: center;
    line-height: 1.2;
   }
  }
  .grid-text {
      font-size: 14px;
      color: #909399;
      padding: 10rpx 0 20rpx 0rpx;
      /* #ifndef APP-PLUS */
      box-sizing: border-box;
      /* #endif */
  }
}
.game-scroll{
    z-index: 1;
    overflow-x: auto;
    position: relative;
  .game-li1{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    height: 100%;
    gap: 20rpx;
    vertical-align: middle;
  }
  .game-li2{
    flex-direction: row;
  }
  .item{
    width: 222rpx;
    height: 300rpx;
    border-radius: 20upx;
  }
  .item1{
    height: auto;
    padding-bottom: 10rpx;
    background-color: #27282A;
    .img{
      border-radius: 20upx;
      height: 222rpx !important;
      width: 100%;
    }
    .gamename{
      height: 40rpx;
      padding: 0 10rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: block;
    }
  }
}
// 游戏列表
.game_content{
  color: #fff;
  padding: 20rpx 0;
  margin: 20rpx 0;
  .game-list{
    .game-title{
      display: flex;
      margin: 30rpx 0;
      justify-content: space-between;
      align-items: center;
      .title{
        display: flex;
        align-items: center;
      }
      .img{
        width: 40rpx;
        height: 40rpx;
        margin-right: 20rpx;
      }
      .right-all{
        color: #0F0F0F;
        padding: 4rpx 30rpx;
        border-radius: 40rpx;
        background: #00FF5F;
      }
    }
    
  }
}
</style>
