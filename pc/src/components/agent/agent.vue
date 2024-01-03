<template>
  <div id="agent">
    <div class="agent-tabs">
      <ul>
        <li
          :class="item.index === activeIndex ? 'active' : ''"
          v-for="item in tabList"
          :key="item.index"
          @click="tabChange(item.index)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
    <div class="agent-content">
      <AgentDetail v-if="activeIndex === 0" />
      <AgentApply v-if="activeIndex === 2" />
    </div>
  </div>
</template>

<script>
import AgentApply from "./agentApply.vue";
import AgentDetail from "./agentDetail.vue";
export default {
  components: {
    AgentApply,
    AgentDetail,
  },
  name: "agent",
  data() {
    return {
      activeIndex: 0,
      agentUrl: '',
      tabList: [
        // { name: "代理加盟", index: 0 },
        { name: this.$t('代理登陆'), index: 1 },
        { name: this.$t('代理注册'), index: 2 },
      ],
    };
  },
  computed: {},
  mounted() {
    // let plats = window.projectImgUrl;
    // if(plats === 'amxpj') {
    //   this.agentUrl = 'https://agent.tp9km5qt.vip'//新葡京国际
    //   this.tabList.unshift({ name: "代理加盟", index: 0 });
    // } else if (plats === 'qxyl') {
    //   this.agentUrl = 'https://qxylagent.bets888803.com'; //千禧娱乐
    //   this.tabList.unshift({ name: "代理加盟", index: 0 });
    // }else if (plats === 'jryl'){
    //   this.agentUrl = 'http://tycagent.bets8888.cc'//巨人娱乐
    //   this.activeIndex = 2;
    // }else if (plats === 'tyca'){
    //   this.agentUrl = 'http://tycagent.bets8888.cc'//必赢太阳娱乐
    //   this.activeIndex = 2;
    // }else if (plats === 'amwnsr'){
    //   this.agentUrl = 'https://agent.715639.com'// 澳门威尼斯人
    //   this.activeIndex = 2;
    // } else if(plats === 'funw'){
    //    this.agentUrl = 'https://agent.6hqpxiwqfg.com'// funw 泛游
    //    this.activeIndex = 2;
    // }
    // else if(plats === 'bqty'){
    //    this.agentUrl = 'https://agent.6hqpxiwqfg.com'// bqty
    //    this.activeIndex = 2;
    // }
  },
  methods: {
    tabChange(index) {
      const proxyUrl =  this.$common.getClientCodeRes()?.agentDomain;
      if(index === 1){
         let win = window.open()
         win.location.href = proxyUrl
      } else {
        this.activeIndex = index
      }
      
    },
  },
};
</script>

<style lang="scss" scoped>
#agent {
  display: flex;
  justify-content: space-between;
  width: 1200px;
  margin: 0 auto;
  .agent-tabs {
    li {
      width: 120px;
      height: 55px;
      text-align: center;
      line-height: 55px;
      margin-bottom: 1px;
      font-size: 14px;
      background-color: #fc0000;
      background-image: linear-gradient(to right, #b80000, #fc0000, #ba0000);
      color: #fcf5ab;
      cursor: pointer;
      &.active {
        background-color: #fde59f;
        background-image: linear-gradient(to right, #fec463, #fde59f, #fec463);
        color: #9c6402;
      }
      &:hover {
        filter: brightness(1.1);
      }
    }
  }
  .agent-content {
    // width: 1050px;
    flex: 1;
    border-radius: 3px;
  }
}
</style>
