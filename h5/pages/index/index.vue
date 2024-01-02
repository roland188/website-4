<!-- 首页 -->
<template>
    <view class="content">
		 <betc88Index v-if="skinId === 'betc88'"/>
		 <kubetIndex v-if="skinId === 'kubet'"/>
     <sovip v-if="skinId === 'sovip'"></sovip>
		 <bgga v-if="skinId === 'bgga'"/>
         <myTabBar :current="0" ref="menuBar"/>
    </view>
</template>

<script>
import betc88Index from './betc88/index.vue'
import kubetIndex from './kubet/index.vue'
import bgga from './bgga/index.vue'
import sovip from "./sovip/index.vue"
import myTabBar from '@/components/myTabBar/index.vue';
import config from "@/utils/config"
export default {
  data() {
    return {
      skinId: config.projectImgUrl 
    };
  },
  components:{
	betc88Index,
	kubetIndex,
	bgga,
  sovip,
	myTabBar
  },
};
</script>

