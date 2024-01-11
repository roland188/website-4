<template>
  <div class="award-page">
    <!-- <div class="award-coat" v-show="isShow">
      <div v-if="['amwnsr','wbgj','amxpj','funw'].includes(projectImgUrl)">
        <img class="bg-img" :src="require('./image/'+projectImgUrl+'/i-bg.gif')" @click="goReceive" />
      </div>
      <div v-else>
        <img class="bg-img" src="./image/i-bg.gif" @click="goReceive" />
      </div>
      <img class="close" src="./image/i-close.png" @click="closeCoat" />
    </div> -->
    <el-dialog
      class="award-inside"
      :visible.sync="adVisible"
      width="400px"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="zp-container">
        <div v-if="['amwnsr','wbgj','amxpj','funw'].includes(projectImgUrl) ">
          <div class="head-bg" :style="getHeadBgUrl"></div>
        </div>
       <div v-else>
          <div class="head-bg" :style="'background-image:url('+require('./image/i-bg.png')+')'"></div>
       </div>
        <div class="contaier">
          <div class="t-state">
            {{ amount > 0 ? $t("领取成功") : $t("手速太慢啦") }}
          </div>
          <div class="amount" v-if="amount > 0">
            {{ $t('金额') }}：
            <span> {{ amount }} </span>
            {{ $t('元') }}
          </div>
          <div class="award-btn" @click="onReceive">
            {{ amount > 0 ? $t("收米") : $t("待会再来抢") }}
          </div>
          <img class="close-flex" :src="$config.getLocaleImg('advertise')" @click="openLink" />
        </div>
        <img class="close" src="./image/c-close.png" @click="onReceive" />
      </div>
    </el-dialog>
    <el-dialog class="award-inside" :visible.sync="adVisible2" width="400px" :show-close="false" :close-on-click-modal="false">
        <div class="zp-container">
              <div class="contaier-pop">
                <div class="contaier-flex">
                    <div>{{$t('温馨提示')}}</div>
                    <img class="close-flex" src="./image/i-close.png" @click="closAdv" />
                </div>
                <div style="margin: auto;" v-html="rawHtml" @click="openLink"></div>
            </div>
		</div>  
      </el-dialog>
  </div>
</template>
  <script>
// import { showLogin } from "../../pages/login/login"; 
//   import { mapActions } from "vuex";
export default {
  'name': 'leftAward',
  data() {
    return {
      adVisible: false,
      isShow: false,
      urlId: null,
      amount: "0.00",
      adVisible2: false,
      rawHtml: '',
      projectImgUrl: window.projectImgUrl,
      getHeadBgUrl: {
        background: 'url(' + "'" + require('./image/c-bg-1.png') + "'" + ')' + ' no-repeat',
        backgroundSize: '100% 100%'
      }
       // rawHtml: '<p style="font-size:14px;color: #a7a8a9;padding-bottom: 8px;">本轮抢红包已结束，下轮再接再励。</p><p style="font-size:14px;">&nbsp;&nbsp;&nbsp;<span style="color:#ff5c48;">!!限时疯狂优惠!!</span></p><p style="font-size:20px;padding-top: 8px;">&nbsp;&nbsp;虚拟钱包入款</p><p style="font-size:18px;">&nbsp;&nbsp;最高<span style="color:#42ff31;">5%</span>回馈</p><p style="font-size:14px;">&nbsp;&nbsp;&nbsp;<span style="color:#e3a16b;display: inline-block;padding: 8px;">!!限时疯狂优惠!!</span><image style="width: 100%;height: 62px;" src="https://m.appbet222.com/file/mujun/23af3650-52b3-4da8-b80f-41e600090a98.jpg"></image></p>'
    };
  },
  watch: {
        "$store.state.token"(n) {
            if (n) {
                this.banner();
            } else {
                // this.isShow = false;
            }
        },
    },
  mounted() {
    this.banner();
  },
  methods: {
    getActivitiesData(urlId) {
      this.$http.get(this.$api.getThematicActivitiesByApp + "/" + urlId).then((res) => { });
    },
    // ...mapActions(["increment"]),
    banner: async function () {
      let _this = this;
      let res = await _this.$http.get(_this.$api.banner);
      const worldCupData =
        res.data.find((item) => item?.expand?.actFolder === "worldcupRed") ||
        {};
      this.urlId = worldCupData.urlId;
      this.isShow = Object.keys(worldCupData).length > 0;
      if(this.isShow){
        this.getActivitiesData(worldCupData.urlId)
      }
    },
    getSpinBigWheel() {
      const data = {
        thematicActivitiesId: this.urlId,
      };
      this.$http.post(this.$api.getSpinBigWheel, data).then((res) => {
        if (res.code == 0) {
          this.isShow = !this.isShow;
          this.adVisible = true;
          this.amount = res.data.award.toFixed(2);
        } else {
          if(res.msg) {
            this.rawHtml = res.msg
            this.adVisible2 = true
            }
        }
      });
    },
    getGameMoneyList() {
      let option = {
        clientId: this.$common.getUser().tenant_id,
        clientIp: "192.168.1.1",
        memberId: this.$common.getUser().user_id,
        username: this.$common.getUser().username,
      };
      this.$http.post(this.$api.getGameMoneyList, option, true).then((res) => {
        if (res.code == 0 && res.data) {
          this.$message.success(this.$t("领取成功！余额已更新"));
          let totalBalance = res.data.totalBalance;
          this.increment(totalBalance);
        }
      });
    },
    goReceive() {
      if (!this.$common.getUser()) {
        this.$message.warning(this.$t('请登录'))
        return;
      } else {
        this.getSpinBigWheel();
      }
    },
    onReceive() {
      this.adVisible = false;
      this.isShow = !this.isShow;
      // this.getGameMoneyList() 实时更新余额
    },
    closeCoat() {
      this.isShow = false;
    },
    closAdv() {
        this.adVisible2 = false
    },
    openLink() {
        this.adVisible2 = false
        this.$router.push('/mcenter/recharge')    
      }
  },
};
</script>
  <style lang="less" >
.award-page {
  margin-top: 20px;
  .award-coat {
    width: 146px;
    text-align: center;
    position: absolute;
    top: 12%;
    z-index: 999;

    .bg-img {
      width: 100%;
      height: 120px;
    }

    .close {
      width: 24px;
      height: 24px;
      margin-top: 10px;
    }
  }

  .award-inside {
    .zp-container {
      position: relative;
      text-align: center;

      .head-bg {
        width: 398px;
        height: 279px;
        position: absolute;
        top: -160px;
        background-repeat: no-repeat;
        // background: url(image/c-bg-1.png) no-repeat;
        background-size: 100% 100%;
      }
    }

    .contaier {
      width: 398px;
      min-height: 205px;
      background: url(image/c-bg-2.png) no-repeat;
      background-size: 100% 100%;
      padding-top: 150px;
      font-weight: 500;
      font-size: 16px;
      display: flex;
      justify-content: center;
      flex-direction: column;

      .t-state {
        color: #333333;
      }

      .amount {
        color: #a7162c;

        & > span {
          font-size: 50px;
        }
      }

      .award-btn {
        background: linear-gradient(180deg, #f43133 0%, #6d0126 100%);
        border-radius: 12px;
        margin: 40px;
        padding: 10px;
        color: #fffaef;
        cursor: pointer;
      }
    }

    .contaier-pop {
				width: 285px;
				background: white;
				background-size: 100% 100%;
				padding: 10px;
				font-weight: 500;
				font-size: 16px;
				display: flex;
				justify-content: center;
				flex-direction: column;
                border-radius: 10px;
                .contaier-flex{
                    display: flex;
                    justify-content: space-between;
                    margin: 10px;
                    color: #bbbbbb;
                    .close-flex{
                        width: 20px;
                        height: 20px;
                    }
                }
			}

			.close {
				width: 40px;
				height: 40px;
				margin-top: 20px;
			}
  }

  .el-dialog {
    background: transparent !important;
    // margin-top: 20vh !important;
    box-shadow: none !important;
  }
}
</style>
