<template>
  <div class="usdt-floating" v-if="window.projectImgUrl=='funw' || window.projectImgUrl=='amxpj'">
    <el-popover
      popper-class="usdtDeposit"
      placement="left-start"
      width="260"
      trigger="hover"
    >
      <div class="usdtBox">
        <div class="content">
          <img
            class="usdt"
            :src="require('../../assets/image/dze/usdt.png')"
            alt=""
          />
          <div class="contentText usdtText">
            <div>{{ $t('USDT快速支付') }}</div>
            <div>{{ $t('数字货币，新会员优惠') }}</div>
          </div>
        </div>
        <div class="urlBox">
          <div class="usdt_wrapper" @click="goToDeposit('/mcenter/recharge', 0)">
            <img
              class="usdt_img"
              :src="require('../../assets/image/dze/usdt_now.png')"
              alt=""
            />
            {{ $t('立即充值') }}
          </div>
          <div class="usdt_wrapper" @click="goToDeposit()">
            <img
              class="usdt_img"
              :src="require('../../assets/image/dze/usdt_know.png')"
              alt=""
            />
            {{ $t('了解USDT') }}
          </div>
        </div>
      </div>

      <div slot="reference" class="marginB proxyStyle"></div>
    </el-popover>
  </div>
</template>

<script>
export default {
  data() {
    return {
      window
    }
  },
  methods: {
    goToDeposit(path, method) {
      if (!this.$common.getUser() && path) {
        // this.$message({
        //   message: this.$t('请先登录'),
        //   type: "warning",
        // });
        this.$common.openLogin()
        return;
      }else if(!path) {
        window.open("https://1555vns.com/", "_blank");
      }else{
        this.$router.push({ path, query: { method } });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.usdt-floating {
  position: absolute;
  top: 20%;
  left: 2%;
  z-index: 111;
  .proxyStyle {
    width: 80px;
    height: 80px;
    background: url("../../assets/image/dze/usdtDeposit.gif") no-repeat;
    background-size: 100% 100%;
  }
}

.usdtBox {
  padding: 5px;
  .content {
    display: flex;
    align-items: center;
    .usdt {
      height: 50px;
    }
    .contentText {
      margin-left: 10px;
      font-size: 13px;
      div:nth-child(1) {
        color: #000;
        font-weight: 700;
        font-size: 16px;
      }
    }
    .usdtText {
      color: #ff6b00;
    }
  }
  .urlBox {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    .usdt_img {
      height: 14px;
    }
    div {
      color: #fff;
      background-color: #fc4d5e;
      border-radius: 20px;
      padding: 10px 20px;
      cursor: pointer;
      &:hover {
        opacity: 0.9;
      }
    }
    .usdt_wrapper:nth-child(1) {
      background: linear-gradient(225deg, #9b7c4c 0%, #ffe7c1 100%);
    }

    .usdt_wrapper:nth-child(2) {
      background: #fbf6ef;
      border: 1px solid #9b7c4c;
      border-radius: 24px;
      color: #000;
    }
    div:nth-child(1) {
      background-color: #fc4d5e;
    }
    div:nth-child(2) {
      background-color: #ff8c19;
    }
  }
}
</style>

<style lang="scss">
.usdtDeposit {
  background: #fbf7ef !important;
  border: none !important;

  .popper__arrow {
    border-right-color: #fd9344;
  }

  .popper__arrow::after {
    border-right-color: #fff4d5 !important;
  }
}
</style>