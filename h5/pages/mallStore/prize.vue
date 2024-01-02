<template>
    <view class="prize-layout">
        <uni-nav-bar class="prize-nav" left-icon="back" :title="$t('奖品列表')" @clickLeft="goBack"></uni-nav-bar>
        <view class="prize-list">
            <template v-if="reqDataSuccess">
                <view class="prize-item" v-for="(item,i) in prizeList" :key="i">
                    <view class="img">
                        <image class="img-item" :src="$config.getImgUrl(item.imgUrlApp)"  />
                    </view>

                    <text>{{item.name}}</text>
                </view>
                <view style="width: 50%;"></view>
            </template>
            <template v-else>
                <view class="nothing">{{$t('暂无数据')}}</view>
            </template>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            headerTitle: this.$t('奖品列表'),
            showArrow: true,
            prizeList: [],
            reqDataSuccess: true
        };
    },
    onLoad() {
        this.getPrizeList();
    },
    methods: {
      clear(e) {
        // TODO nvue 取消冒泡
        e.stopPropagation()
      },
        // 返回
        goBack () {
          uni.navigateBacks();
			// this.$pageBack.pageBack()
            // uni.navigateBack({
            //      delta: 1
            // })
        },
        getPrizeList() {
            this.$api.shoppingMallList((err, res) => {
                if (err) return
                this.prizeList = res.lotteryMallVOList
                if (res.lotteryMallVOList.length == 0) {
                    this.reqDataSuccess = false
                }
            })
        }
    }
};
</script>

<style lang="scss" scoped>
.prize-layout {
    width: 100vw;
    height: 100vh;
    padding: 0 9px 64px;
    box-sizing: border-box;
    overflow: auto;
    background-color: #fff;
    overflow-x: hidden;
    .prize-nav {
      transform: translateX(-9px);
    }
    // 导航栏
    .van-nav-bar {
        background-color: #000 !important;
        color: #fff;
    }
    .van-icon-arrow-left::before {
        color: #fff;
    }
    .van-nav-bar__title {
        color: #fff;
    }
    .van-nav-bar__text {
        color: #fff;
    }
    .van-nav-bar__arrow {
        font-size: 12px;
        margin-right: 0;
    }
    .prize-list {
        margin-top: 20px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        .prize-item {
            width: 50%;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 12px;
            .img {
                width: 75px;
                height: 75px;
                .img-item {
                    width: 100%;
                    height: 100%;
                }
            }

            > text {
                padding: 9px 0;
                text-align: center;
                margin: 0;
            }
        }
        .nothing {
            color: #999;
            margin-top: 60px;
        }
    }
}
</style>
