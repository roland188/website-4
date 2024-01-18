<template>
 <div class="vipLayout-body">
    <div class="vip-banner-wrap"></div>
    <div class="vip-level-main" :class="{'viet-bg': ['vi'].includes(locale)}">
      <div class="center-body">
        <div class="user-info-card">
          <div class="left-wrap">
            <div class="user-head-info">
              <div class="name">{{ $common.getUser().username }}</div>
              <div class="member-level">{{ levelInfo.vipName }}</div>
              <div class="vip-notice">
               {{ ['vi'].includes(locale) ? $t('系统于越南时间每天凌晨5点30分进行VIP促销') : $t('每日北京时间凌晨6点30分 系统进行VIP等级结算') }}
              </div>
            </div>
            <!-- 存款进度条-->
            <!-- <div class="processWrap">
              <div class="process-top">
                <span class="process-left">存款金额</span>
                <span class="uponline" v-if="levelInfo.recharge - levelInfo.upgradeRecharge >= 0"
                  >已满足升级条件</span
                >
                <span class="uponline" v-else
                  >升级还需：{{
                    Math.abs(levelInfo.recharge - levelInfo.upgradeRecharge)
                  }}</span
                >
              </div>
              <div class="deposit-process">
                <div
                  class="step-inner step-bg-01"
                  :style="{
                      width:
                        getPercent(levelInfo.recharge, levelInfo.upgradeRecharge) +
                        '%',
                    }"
                ></div>
                <span
                  class="step-num"
                  v-if="levelInfo.recharge - levelInfo.upgradeBet >= 0"
                  >{{
                    Math.floor(levelInfo.recharge) +
                    "/" +
                    levelInfo.upgradeRecharge
                  }}</span
                >
                <span class="step-num" v-else>{{
                  Math.floor(levelInfo.recharge) +
                  "/" +
                  levelInfo.upgradeRecharge
                }}</span>
              </div>
            </div> -->
            <template v-if="['vi'].includes(locale)">
              <!-- 有效流水-->
              <div class="processWrap">
                <div class="process-top">
                  <span class="process-left">{{ $t('存钱升级')}}</span>
                  <span class="uponline" v-if="levelInfo.recharge - levelInfo.upgradeRecharge  >= 0">
                    {{$t('已满足升级条件')}}
                  </span>
                  <span class="uponline" v-else
                    >{{$t('晋升下级还需')}}：{{ Math.abs(levelInfo.recharge - levelInfo.upgradeRecharge) }}</span
                  >
                </div>
                <div class="deposit-process">
                  <div
                    class="step-inner step-bg-02"
                    :style="{ width: getPercent(levelInfo.recharge, levelInfo.upgradeRecharge) +'%' , }"
                  ></div>
                  <span
                    class="step-num"
                    v-if="levelInfo.bet - levelInfo.upgradeBet >= 0"
                    >{{ Math.floor(levelInfo.recharge) + "/" + levelInfo.upgradeRecharge}}</span
                  >
                  <span class="step-num" v-else>{{ Math.floor(levelInfo.recharge) + "/" + levelInfo.upgradeRecharge }}</span>
                </div>
              </div>
              <div class="bottom-deposit-info">
                <div class="deposit">
                  {{ $t('存款积累历史') }}：<span>{{ levelInfo.allRecharge || 0 }}</span>
                </div>
              </div>
            </template>

            <template v-else>
              <!-- 有效流水-->
              <div class="processWrap">
                <div class="process-top">
                  <span class="process-left">{{ $t('有效流水')}}</span>
                  <span class="uponline" v-if="levelInfo.bet - levelInfo.upgradeBet >= 0">
                    {{$t('已满足升级条件')}}
                  </span>
                  <span class="uponline" v-else
                    >{{$t('晋升下级还需')}}：{{ Math.abs(levelInfo.bet - levelInfo.upgradeBet) }}</span
                  >
                </div>
                <div class="deposit-process">
                  <div
                    class="step-inner step-bg-02"
                    :style="{ width:getPercent(levelInfo.bet, levelInfo.upgradeBet) +'%',}"
                  ></div>
                  <span
                    class="step-num"
                    v-if="levelInfo.bet - levelInfo.upgradeBet >= 0"
                    >{{ Math.floor(levelInfo.bet) + "/" + levelInfo.upgradeBet }}</span
                  >
                  <span class="step-num" v-else>{{ Math.floor(levelInfo.bet) + "/" + levelInfo.upgradeBet }}</span>
                </div>
              </div>
              <div class="bottom-deposit-info">
                <div class="deposit">
                  {{$t('历史累计有效流水')}}：<span>{{ levelInfo.allBet || 0 }}</span>
                </div>
              </div>
            </template>
          </div>
          <div class="right-wrap">
            <div
              class="vip-pic"
              v-if="levelInfo.vipLevel == levelInfo.maxVipLevel"
              v
              style="font-size: 34px"
            >
              {{$t('敬请期待')}}
            </div>
            <div class="vip-pic" v-else>VIP{{ levelInfo.vipLevel + 1 }}</div>
          </div>
        </div>
        <!--        VIP奢华礼遇-->
        <div class="vip-vod-wrap">{{$t('VIP奢华礼遇')}}</div>

        <div class="tabs-body-layout">
          <div class="tabs-head">
            <div
              class="vip-item-wrap"
              :class="[item.active ? 'active' : '']"
              v-for="item in vipList"
              :key="item.id"
              @click="changeVipItem(item)"
            >
              <img
                type="base"
                v-if="!item.active"
                class="icon-img"
                alt=""
                :src="require('./image/VIP_list_icon'+item.id+'.png')"
              />
              <img
                type="base"
                v-if="item.active"
                class="icon-img"
                alt=""
                :src="require('./image/VIP_list_icon'+item.id+'_i.png')"
              />
              <div class="icon-info">
                <div class="title-name">{{ $t(item.name) }}</div>
                <div class="bottom-text">{{$t('点击查看明细')}}</div>
              </div>
            </div>
          </div>
          <component :is="tempName" :descriptionList="descriptionList"></component>
        </div>
      </div>
    </div>
  </div>
  </template>

  <script>
   import VipTemp01 from "./components/vip01";
   import VipTemp02 from "./components/vip02";
   import VipTemp03 from "./components/vip03";
   import VipTemp04 from "./components/vip04";

 export default {

    components: {
    VipTemp01,
    VipTemp02,
    VipTemp03,
    VipTemp04,
  },
  data() {
    return {
        vipList:([
      {
        name: this.$t("VIP专项特权"),
        active: true,
        id: "01",
      },
      {
        name: this.$t("VIP返水特权"),
        id: "02",
        active: false,
      },
      {
        name: this.$t("活动说明"),
        id: "03",
        active: false,
      },
      {
        name: this.$t("活动细则"),
        id: "04",
        active: false,
      },
    ]),
    levelInfo:({
      bet: 0,
      insuranceBet: 0,
      upgradeBet: 0,
      upgradeRecharge: 0,
      allRecharge: 0,
      allBet: 0,
      recharge: 0,
      vipLevel: 0,
    }),
    tempName:'VipTemp01',
    descriptionList: {}, // 活动说明
    projectImgUrl: window.projectImgUrl,
    locale: window.locale,
    };
  },
  created() {
    // this.getUserLevel()
    this.getVipfaq()
    this.getUserVIPlist()
  },
  methods:{
    async getVipfaq(){
      let res = await this.$http.get(this.$api.getVipfaq)
        if (res.code == 0) {
        this.descriptionList = res.data || {};
      }
    },
    getPercent(start, total) {
        if (start >= total) {
            return 100
        }
        return Math.floor((start / total) * 100);
	},
    async getUserLevel(){
        let res = await this.$http.get(this.$api.getUserLevel)
      console.info(777777, res)
        if (res.code == 0) {
        this.levelInfo = res.data;
      }
    },
    changeVipItem(item){
      this.tempName = "VipTemp" + item.id;
      const target = this.vipList.find((vip) => vip.id == item.id);
      this.vipList.forEach((vip) => {
        if (vip.id != item.id) {
          vip.active = false;
        }
      });
      target.active = true;
    },
    async getUserVIPlist() {
      let res = await this.$http.get(this.$api.getUserVIPlist);
      if (res.code == 0) {
        this.levelInfo = res.data.mnv;
      }
    },
  },

};
  </script>

  <style lang="scss">
  @import "./vipLevel.scss";
  </style>
