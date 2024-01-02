<!-- 客服中心 -->
<template>
  <view :class="{thme1: !$config.isRxpjProject, thme2: $config.isRxpjProject}">
    <view class="scs-page ny-bg-image" :style="'padding-top: var(--status-bar-height);background-image: url(' + $config.themeImgUrl('index/bg') + ')'">
      <header-service  v-show="!['Dispensing','Savemoney'].includes(currPage)" :currPage="getShowPage" :title="getShowTitle" 
                      @jump="jump"  />
      <component @jump="jumpPage" :is="getShowPage" />
    </view>
  </view>
</template>

<script>
import home from "../common/home"
import i18nT from '../../mixins/i18n'
import ForgetPassword from '../../forgetPassword.vue'
import AccountThaw from '../../accountThaw.vue'
import UpdatePassword from '../../updatePassword.vue'
import Dispensing from '../../dispensing.vue'
import Disrecord from '../../disrecord.vue'
import Saverecord from '../../saverecord.vue'
import Withdrawal from '../../withdrawal.vue'
import Bankname from '../../bankname.vue'
import Bankcard from '../../bankcard.vue'
import Savemoney from '../../savemoney.vue'
import Suggestion from '../../suggestion.vue'
import SetWithdrawalpsd from '../../setWithdrawalpsd.vue'
import UpdateBankName from '../../updateBankName.vue'
import Problem from '../../problem.vue'
import ProblemDetail from '../../problemDetail.vue'
import Phoneser from '../../phoneser.vue'
import serverWebView from '../../serverWebView.vue'
import headerService from '../header/header2.vue'
export default {
  components: {
    headerService,
	// Home,
	ForgetPassword,
	AccountThaw,
	UpdatePassword,
	Dispensing,
	Disrecord,
	Saverecord,
	Withdrawal,
	Bankname,
	Bankcard,
	Savemoney,
	Suggestion,
	SetWithdrawalpsd,
	UpdateBankName,
	Problem,
	ProblemDetail,
	Phoneser,
	serverWebView,
  },
  mixins: [i18nT, home],
  data() {
    return {
      currPage: 'Home',
      isShowBack:true
    }
  },

}
</script>

<style lang="scss"  scoped src="../../scs.scss"></style>
