<template>
  <view>
    <view
      v-if="dataList.length > 0"
      class="rightFloatingFrame-contenter"
      :class="{ 'rightFloatingFrame-contenter-act': !isMicrify }"
    >
      <view class="item-box-right">
        <view class="item-box">
          <view
            class="item"
            v-for="item in dataList"
            :key="item.id"
            @click="openUrlwin(item)"
          >
            <image
              class="itemImg"
              :src="$config.getImgUrl(item.floatingPicApp)"
              mode=""
            />
            <view class="item-text">{{ item.name }}</view>
          </view>
        </view>
        <image
          @click="micrifyChange"
          class="micrify-img"
          src="../../static/image/right_jiantou_01@2x.png"
          mode=""
        ></image>
      </view>
    </view>
    <view class="rightFloatingFrame-arrow">
      <image
        v-if="isShowArrow"
        @click="micrifyChange"
        class="enlarge-img"
        src="../../static/image/right_jiantou_02@2x.png"
        mode=""
      ></image>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    login: {
      // type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isMicrify: true,
      dataList: [],
      isShowArrow: false,
    };
  },
  mounted() {
    this.getListFloatingWindows();
  },
  methods: {
    getListFloatingWindows() {
      this.$api.getListFloatingWindows(
        {},
        (err, res) => {
          if (res) {
            this.dataList = res.filter((item) => {
              return item.name != this.$t('访问移动端');
            });
            // #ifdef APP-PLUS
            this.dataList = res.filter((item) => {
              return !item.name.includes(this.$t('下载'));
            });
            // #endif
          }
        },
        false
      );
    },
    micrifyChange() {
      this.isMicrify = !this.isMicrify;
      setTimeout(() => {
        this.isShowArrow = !this.isShowArrow;
      }, 500);
    },
    openUrlwin(item) {
      if (item.jumpType === 7) {
        if (item.jumpContent) {
          uni.navigateTo({
            url: item.jumpContent,
          });
        }
      }
      if (!this.login) {
        uni.navigateTo({
          url: "/pages/Login/Login",
        });
      } else {
        if (item.editStatus == 1) {
          //1:公告 2:活动 3:专题 4:游戏
          if (item.jumpType === 0) {
            if (item.jumpContent) {
              // uni.navigateTo({
              //   url: "../webViewQQ/webViewQQ?url=" + item.jumpContent,
              // });
              
              // #ifdef APP-PLUS
              plus.runtime.openURL(item.jumpContent);
              // #endif
              // #ifdef H5
              if(item.openMode === 1){
                window.open(item.jumpContent, "_blank");
              }else{
                uni.navigateTo({
                  url: (window.location.href = item.jumpContent),
                });
              }
              // #endif
            }
          } else if (item.jumpType === 1) {
            // if (item.urlId) {
            // 	this.$sk.navigateTo('../MessageDetail/MessageDetail?id='+ item.urlId+'&type=2');
            // }

            uni.navigateTo({
              url:
                "../messageDetail/messageDetail?type=2&id=" + item.jumpContent,
            });
          } else if (item.jumpType === 2) {
            if (item.jumpContent) {
              uni.navigateTo({
                url: "../actDetail/actDetail?id=" + item.jumpContent,
              });
            }
          } else if (item.jumpType === 3) {
            if (item.jumpContent) {
              uni.navigateTo({
                //专题
                url: "/pages/actDetail/actDetail?ByAppFlag=" + item.jumpContent,
              });
            }
          } else if (item.jumpType === 4) {
            this.$emit("goPlayGame", item.jumpContent);
          }
        } else {
          if (item.name.includes(this.$t('客服'))) {
            uni.navigateTo({
              url:'/pages/subCustomerService/subCustomerService',
            });
          } else if (item.name.includes(this.$t('下载'))) {
            // 下载APP
            let u = navigator.userAgent;
            if (
              (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) &&
              this.$config.androidDownloadUrl
            ) {
              window.location.href = this.$config.androidDownloadUrl;
            }
            if (
              !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) &&
              this.$config.iosDownloadUrl
            ) {
              window.location.href = this.$config.iosDownloadUrl;
            }
          }
        }
      }
    },
  },
};
</script>

<style scoped>
@import url("./rightFloatingFrame.css");
</style>
