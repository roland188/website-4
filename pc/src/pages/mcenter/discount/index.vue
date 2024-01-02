<template>
  <div class="discount-layout">
    <div class="discount-title">{{ $t('自助优惠') }}</div>
    <div class="discount-content">
      <div class="item-list" :key="i" v-for="(item, i) in discountActivitiesList" @click="toPage(item)">
        <div class="icon" :class="'icon' + i"></div>
        <div class="name">{{ item.name }}</div>
      </div>
    </div>
    <div v-show="discountActivitiesList.length === 0">--{{ $t('暂无记录') }}--</div>
    <component :is="disCom" :dd="currentData" :key="currentData.id" @detail="goActivity" />
    <ActDetail ref="actDetail"></ActDetail>
  </div>
</template>
<script>
import Feedback from "./Feedback.vue";
import Lucky from "./Lucky.vue";
import Rescue from "./Rescue.vue";
import ActDetail from "../../actDetail/actDetail";

export default {
  components: {
    ActDetail,
  },
  data() {
    return {
      disCom: null,
      currentData: {},
      discountList: [
        //亿元回馈
        {
          type: 11,
          path: "/discount/feedback",
          com: Feedback,
          name: this.$t("亿元回馈"),
          id: "",
        },
        //电子幸运注单
        {
          type: 6,
          path: "/discount/lucky",
          com: Lucky,
          name:this.$t("电子幸运注单"),
          id: "",
        },
        //电子扭转乾坤
        {
          type: 9,
          path: "/discount/rescue",
          com: Rescue,
          name: this.$t("电子扭转乾坤"),
          id: "",
        },
        // //捕鱼投注达人
        // {
        //   type: 9,
        //   path: '/discount/rescue',
        //   name: this.$t('捕鱼投注达人'),
        //   id: '',
        // },
        // //棋牌全民PK
        // {
        //   type: 9,
        //   path: '/discount/rescue',
        //   name: this.$t('棋牌全民PK'),
        //   id: '',
        // },
        // //棋牌捕鱼紫气东来
        // {
        //   type: 9,
        //   path: '/discount/rescue',
        //   name: this.$t('棋牌捕鱼紫气东来'),
        //   id: '',
        // },
      ],
      discountActivitiesList: [],
    };
  },
  created() { },
  mounted() {
    this.getList();
  },
  methods: {
    goActivity(id) {
      this.$refs.actDetail.openDialog(id, 2);
      // this.$router.push({
      //   path: '/home',
      //   query: {
      //     active: id
      //   }
      // })
    },
    toPage(data) {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      let list = {};
      this.discountList.forEach((item) => {
        if (item.type == data.type) {
          list = item;
        }
      });
      this.currentData = {
        id: data.id,
        name: data.name,
        marquee: data.marquee || "",
      };
      this.disCom = list.com;
      // console.log('dataaaa ====', data)
      // this.$router.push({
      //   path: list.path,
      //   query: {
      //     did: data.id,
      //     name: data.name,
      //   },
      // });
    },
    getList() {
      this.$http
        .post(this.$api.getThematicActivitiesListByApp, { pageSize: 40 })
        .then((res) => {
          if (res.code == 0) {
            this.discountActivitiesList = (
              res.data.content.length
                ? res.data.content
                : this.discountActivitiesList
            ).filter((item) => {
              return item.type == 11 || item.type == 6 || item.type == 9;
            });
          }
        });
    },
  },
  computed: {},
  filters: {
    //过滤日期
    censusDate(val) {
      if (val) {
        var date = new Date(val); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var M = date.getMonth() + 1;
        var D = date.getDate();
        return $t('{x}月{y}日', { x: M, y: D });
      } else {
        return "--/--";
      }
    },
  },
  watch: {
    $route: {
      handler(val, oldVal) {
        if (this.$route.query.id) {
          // this.getActDetail(this.$route.query.id);
        }
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.discount-layout {
  position: relative;
  overflow: auto;
  min-height: 500px;
  max-height: 700px;
  max-width: 1180px;
  margin: 10px auto;

  .discount-title {
    font-size: 0.3rem;
    font-weight: bold;
    margin-bottom: 0.3rem;
    color: #3e444d;
    border-bottom: 1px solid rgba(233, 157, 66, 1);
    padding: 0 0.1rem 0.3rem;
  }

  .discount-content {
    display: grid;
    padding: 0 0.1rem;
    gap: 0.2rem 0.4rem;
    grid-template-columns: repeat(2, 1fr);

    .item-list {
      flex: 1;
      height: 0.8rem;
      display: flex;
      align-items: center;
      border-radius: 5px;
      padding: 0.1rem 0.2rem;
      box-sizing: border-box;
      background-color: rgba(242, 242, 242, 1);
      text-align: center;
      cursor: pointer;
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
      background: url("../../../assets/image/discount/arrow.png") no-repeat right 0.15rem center/0.3rem;

      .name {
        font-size: 0.2rem;
        font-weight: 700;
      }

      @for $i from 0 to 6 {
        .icon#{$i} {
          width: 0.34rem;
          height: 0.34rem;
          padding-right: 0.2rem;
          background: url("~@/assets/image/discount/icon#{$i}.png") no-repeat center/contain;
        }
      }
    }
  }
}
</style>
