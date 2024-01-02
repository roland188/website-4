<!-- 游戏列表 -->
<template>
      <!-- 右侧列表 -->
    <view class="secondList">
      <view v-if="gameList.length > 0">
        <block v-for="(item, index) in gameList" :key="index">
          <!-- :class="[1,2,4,6].includes(id) ? 'game1' : ''"  -->
            <view
            class="game"
                :class="'game1'"
            >
            <view
                class="inner inner1"
                @tap="difference(item, navIndex, index)"
            >
                <image
                class="img"
                :src="
                    item.imgUrlApp
                    ? $config.getImgUrl(item.imgUrlApp)
                    : item.pictureUrl
                    ? $config.getImgUrl(item.pictureUrl)
                    : noDate
                "
                mode="widthFix"
                alt=""
                ></image>

            </view>
            </view>
        </block>
      </view>
      <view v-else class="search-none">
        <view class="none-con">
          <image
            class="none-img"
            :src="require('../../static/image/mb/null-data.png')"
            mode="widthFix"
          ></image>

          <view class="wen-none">{{ $t('这里空空的') }}</view>
          <view class="wen-none">{{ $t('什么都没有哦') }}</view>
        </view>
      </view>
    </view>
  </template>
  
  <script>
  export default {
    props: {
      gameList: Array,
    },
    data() {
      return {
        noDate: require("@/static/image/gameerror.png"),
        id: 1,
      };
    },
    created(){
    },
    mounted() {    
             
    },
    methods: {
      difference(item, index) {
        this.$emit("difference",item, index,);
      },
    },
  };
  </script>
  
  <style lang="less" scoped>
    .secondList {
      position: relative;
      
      display: grid;
      grid-template-columns: repeat(2,1fr);
      gap: 20upx 24upx;
      align-content: flex-start;
      padding: 8upx 16upx 0;
      .game {
        flex: 1;
        // height: 226upx;
        margin-bottom: 2%;
        padding-right: 8upx;
        padding-top: 8upx;
        overflow: hidden;
        border-radius: 25upx;
        // background: url("../../static/image/indexImg/game-bg.png") no-repeat center/contain;
        .inner {
          position: relative;
          width: 100%;
          padding-top: 100%;
          .img {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
  
          .title {
            position: absolute;
            right: 9%;
            bottom: 17%;
            width: 225upx;
            height: 64upx;
            font-size: 22upx;
            display: -webkit-box;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
          }
        }
      }
      .search-none {
        width: 100%;
        color: #58576E;
        font-size: 24upx;
        text-align: center;
        margin-top: 50upx;
        .wen-none {
          color: #8A8989;
          font-size: 28upx;
        }
      }
    }

  
  </style>
  