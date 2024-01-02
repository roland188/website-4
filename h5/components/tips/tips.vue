<!-- 
公共弹框
作者：丹泽尔
遵循父子组件调用方式
msg{
	isShow:		Boolean    	true显示弹框 false不显示
	types:		Number     	弹框类型1.带标题； 3.首页公告弹框
	icon: 		Number     	1:弹框内容错误图片，2：弹框内容对号图片，没有则无需传入
	content		String		提示的内容	
	showCancel	Boolean		是否显示取消按钮，赋值为false时	cancelText可不传
	cancelText	String		取消按钮的文字，最多 4 个字符	
	confirmText	String		确定按钮的文字，最多 4 个字符	
	success		Number		子组件传给父组件的值，用来做逻辑判断
	remove      Boolean      是否是删除按钮 false  true
	notices     Array       首页公告内容，数据格式 [
											{title:"",conent:""},
											{title:"",conent:""},
										],
}
父组件接受事件名称：childFn

调用案例：请看addCard.vue查看

-->
<template>
  <view>
    <view
      v-if="model.types == 1"
      class="cu-modal myModal"
      :class="{ show: model.isShow }"
      @tap="onbut(100)"
      @touchmove.stop.prevent
    >
      <view class="cu-dialog myDialog" @tap.stop>
        <view class="cu-bar myBar justify-end newToastHeader">
          <view class="content">
            <text class="tips-title themeTextOne oneTitleColor8">{{
              $t('数值货币提款申请')
            }}</text></view
          >
        </view>
        <view class="padding-aa">
          <view class="tip-conent myContent">
            <image
              src="../../static/image/xf/cuo.png"
              v-if="model.icon == 1"
              class="tip-conent-img"
              mode=""
            ></image>
            <image
              src="../../static/image/xf/dui.png"
              v-if="model.icon == 2"
              class="tip-conent-img"
            ></image>
            <text
              class="tip-text themeTextOne oneTitleColor8"
              :class="model.isLeft ? 'aa' : ''"
              >{{ model.content }}</text
            >
          </view>
        </view>
        <view class="img-but">
          <view
            v-if="model.showCancel"
            @click="onbut(100)"
            class="alertBut cancelBut"
            >{{ model.cancelText }}</view
          >
          <view
            @click="onbut(model.success)"
            class="alertBut"
            :class="[model.remove ? 'removeBtn themeRemoveBtn16' : 'submitBut']"
            >{{ model.confirmText }}</view
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    msg: {
      isShow: Boolean,
      types: Number,
      content: String,
      showCancel: Boolean,
      cancelText: String,
      confirmText: String,
      icon: Number,
      success: Number,
      notices: Array,
    },
  },
  data() {
    return {
      model: {},
      phone: "",
      code: "",
      disabledBut: false,
      codeButtext: this.$t('获取验证码'),
      phoneError: false,
      codeError: false,
      codeErrorText: "",
    };
  },
  watch: {
    msg: {
      handler(newValue, oldValue) {
        this.model = newValue;
      },
      deep: true,
    },
  },
  created() {
    this.model = this.msg;
    console.log(this.model);
    uni.hideTabBar({});
  },

  methods: {
    onbut(e) {
      if (this.model.types == 3) {
        setTimeout(() => {
          uni.showTabBar({});
        }, 300);
      }

      //关闭弹框值的操作一定要放到父页面去操作
      this.$emit("childFn", e);
      this.codeErrorText = "";
      this.code = "";
    },
    showToast(title) {
      console.log(title);
      uni.showToast({
        title: title,
        duration: 2000,
        icon: "none",
        position: "bottom",
      });
    },
  },
  computed: {
    hideModal() {
      //点击遮罩层空白处，隐藏
      return this.model.showCancel ? 100 : this.model.success;
    },
  },
};
</script>

<style lang="scss" scoped>
.phone-card {
  background-color: #ffffff;
  top: 30%;
  position: absolute;
  width: 80%;
  left: 10%;
  border-radius: 8px;
  .header {
    font-size: 36rpx;
    font-weight: bold;
    padding: 32rpx 0px;
    .close-img {
      width: 34rpx;
      height: 34rpx;
      float: right;
      right: 32rpx;
    }
  }
  .conent {
    padding: 0px 40rpx;
    .phone-box {
      display: flex;
      align-items: center;
      .input-p-box {
        flex-grow: 2;
      }
    }
    .title {
      text-align: left;
      white-space: nowrap;
    }
    .codeM {
      margin-right: 30rpx;
    }
    .code-box {
      margin-top: 32rpx;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .code-text {
        color: var(--themeBtn);
        font-size: 22rpx;
      }
      .code-time {
        width: 50%;
      }
      .time-text {
        color: #a7a7a7;
      }
    }
    .phone-input {
      background-color: #f7f7f7;
      border-radius: 18px;
      height: 70rpx;
      text-align: left;
      padding-left: 10px;
      line-height: 70rpx;
    }
    .errText {
      font-size: 22rpx;
      color: #ff5e5e;
      margin: 15rpx 0px;
    }
  }
  .btn-sub {
    text-align: center;
    font-size: 30rpx;
    border-top: 1px solid #f4f4f4;
    padding: 20rpx 0px;
    color: var(--themeBtn);
    margin-top: 16px;
  }
}
.bg-white {
  background: linear-gradient(to right, #fefdf9, #f6d7a6);
}
.img-but {
  text-align: center;
  display: flex;
  justify-content: center;
  border-top: 1px solid var(--borderColor);
}

.tip-conent {
  margin-bottom: 50rpx;
  /* line-height: 3; */
  text-align: center !important;
}

.tip-text {
  font-size: 26rpx;
  /* color: #484440; */
  font-weight: 700;
  vertical-align: middle;
  word-break: break-all;
  text-align: left !important;
}

.tips-title {
  font-size: 36rpx;
  /* color: #484440; */
  font-weight: 700;
}

.success-img {
  width: 50px;
  height: 50px;
}

.tip-conent-img {
  width: 37rpx;
  height: 37rpx;
  vertical-align: middle;
  margin-right: 10rpx;
  display: inline-block;
}

.cancelBut {
  /* background: linear-gradient(-60deg, rgba(219, 240, 255, 1) 0%, rgba(214, 226, 246, 1) 100%); */

  color: var(--textTwo);
}

.submitBut {
  color: var(--themeBtn);
  border-left: 1px solid var(--borderColor);
  /* background: linear-gradient(90deg, rgba(240, 193, 113, 1) 0%, rgba(243, 218, 158, 1) 100%); */
}
.removeBtn {
  color: var(--themeBtn);
  border-left: 1px solid var(--borderColor);
}

.alertBut {
  flex-grow: 1;
  font-size: 14px;
  height: 2rem;
  line-height: 2rem;
}

.swiper {
  min-height: 450rpx;
  max-height: 550rpx;
}

.cu-dialog {
  max-width: 80%;
  border-radius: 10px;
  background-color: #fff;
  top: 24%;
}

.tanTitle {
  color: #484440;
  font-size: 38rpx;
  text-align: center;
  font-weight: 600;
  line-height: 3;
}

.tanCon {
  color: #484440;
  font-size: 24upx;
  overflow-y: scroll;
  padding: 0px 20px;
  text-align: left;
  text-indent: 15px;
  max-height: 300rpx;
}

.swiper-item {
}

.indexTanTop {
  width: 100%;
  height: 175rpx;
  flex-grow: 0;
  flex-shrink: 0;
}

.ViewallBut {
  background: linear-gradient(to right, #ffb06d, #ffbf8a);
  width: 80%;
  font-size: 17px;
  margin-bottom: 20px;
  color: #fff;
}

.colse-img {
  text-align: center;
  position: absolute;
  bottom: 10%;
  width: 100%;
}

.indexTanCha {
  width: 45px;
  height: 45px;
}

/* qq添加及修改 */
.myModal {
  /* padding-top: 320upx; */
}

.myModal::before {
  vertical-align: top !important;
}

.myDialog {
  vertical-align: top !important;
  max-width: 70%;
}

.myBar {
  min-height: 69upx !important;
}

.myContent {
  margin-bottom: 50rpx;
}

button::after {
  border: none;
}
.aa {
  text-align: left !important;
  display: block;
}
.padding-aa {
  padding: 10upx 50upx;
}
.newToastHeader {
  height: 114upx;
}
</style>
