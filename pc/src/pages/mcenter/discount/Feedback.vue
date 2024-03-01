<template>
  <div class="feedback-layout discount-layout">
    <div class="header">
      <div class="discount-title" @click="onBack">{{ $t('自助优惠') }}</div>
      <img
        class="icon"
        src="../../../assets/image/discount/title-arrow.png"
        alt=""
      />
      <div class="title">{{ infoHtml.name || dd.name }}</div>
    </div>
    <div class="content">
      <!-- <div class="titps-top"> -->
      <Marquee v-if="dd.marquee" :text="dd.marquee" />
      <!-- </div> -->
      <el-table
        class="tabel-layout"
        :data="listData"
        style="width: 100%"
        :empty-text="'--' + $t('暂无记录') + '--'"
        :header-cell-style="{
          background: '#fff',
          color: '#606060',
          fontSize: '14px',
          fontWeight: '500',
          borderTop: '2px solid #eaeaea',
        }"
      >
        <el-table-column
          prop="checkTimeStart"
          :label="$t('开始日期')"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <div>
              {{ scope.row.checkTimeStart | fnTime }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="checkTimeStop"
          :label="$t('结束日期')"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <div>
              {{ scope.row.checkTimeStop | fnTime }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="audit" :label="$t('流水倍数')" align="center">
        </el-table-column>
        <el-table-column prop="amountRwLoss" :label="$t('盈亏预算')" align="center">
        </el-table-column>
        <el-table-column prop="amountReward" :label="$t('盈亏预算')" align="center">
        </el-table-column>
        <el-table-column prop="status" :label="$t('操作')" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 0">
              <el-button
                size="mini"
                type="danger"
                class="redBtn"
                @click="handleEdit(scope.row)"
                >{{ $t('领取奖励') }}
              </el-button>
            </div>
            <div v-if="scope.row.status == 1">{{ $t('已领取') }}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="tipbox">
      <p class="fullColor" style="text-align: left">
        <span class="fullColor">{{ $t('温馨提示') }}：</span>
        {{ $t('如遇网络因素不显示当前符合的注单，请稍后刷新网络后重试或点击下面的自助提交') }}
        {{ $t('请点击') }}
        <span class="tipColor" @click="customerService"> {{ $t('这里') }} </span>
        {{ $t('自助提交申请优惠。') }}
      </p>
    </div>
    <div class="tipbox2">
      <span class="remk" @click="openDetail"> {{ $t('优惠详情') }} </span>
    </div>
  </div>
</template>
<script>
import Marquee from "@/components/Marquee/index.vue";
export default {
  props: {
    dd: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    Marquee,
  },
  data() {
    return {
      id: "",
      infoHtml: {},
      datainfo: {},
      listData: [],
    };
  },
  filters: {
    fnTime: function (value) {
      var date = new Date(value); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() + " ";
      return Y + M + D;
    },
  },
  created() {
    this.id = this.dd.id;
    this.getData();
  },
  methods: {
    handleEdit(i) {
      this.$http
        .put(
          this.$api.getReceiveActivities +
            this.id +
            "&betNo=" +
            encodeURIComponent(i.recordsNumber)
        )
        .then((res) => {
          if (res.code == 0) {
            this.$message.success(this.$t('操作成功'));
            this.getData();
            this.getUserBalance();
          } else {
            this.$message.error(res.msg || this.$t('操作失败'));
          }
        });
    },
    async getUserBalance() {
      var _this = this;
      let data = {
        clientId: this.$common.getUser().tenant_id, //tenant_id
        clientIp: this.$config.clientIp,
        memberId: this.$common.getUser().user_id, //userid
        username: this.$common.getUser().username,
      };
      var res = await _this.$http.post(_this.$api.getuserMoney, data);
      if (res.code == 0) {
        //余额存本地
        this.$common.setUserBalance(res.data);
      } else {
      }
    },
    getData() {
      this.$http
        .get(this.$api.getThematicActivitiesByApp + "/" + this.id)
        .then((res) => {
          if (res.code == 0 && res.data) {
            this.infoHtml = res.data;
            this.datainfo = res.data.compensationVO;
            this.listData = this.datainfo.receivedList;
          }
        });
    },
    openDetail() {
      this.$emit("detail", this.dd.id);
      // this.$router.push({
      //     path:'/actDetail',
      //     query:{
      //         byAppId: this.id,
      //     }
      // })
    },
    customerService() {
      if (['betc88,wynn','dola789'].includes(window.projectImgUrl)) {  // betcome直接跳客服窗口
        const url = this.$common.getCustomerService();
        window.open(url, "_blank");
        return;
      }
      if (window.customerServiceStatus == 1) {
        //新客服
        var _this = this;
        var obj = {};
        obj.host = _this.$common.getHost();
        obj.clientCode = window.clientCode;
        obj.clientItem = window.childCode;
        obj.username =
          this.$common.getUser() && this.$common.getUser().username;
        // obj.language = this.$common.getLocale();
        obj.theme = window.theme;
        obj.projectImgUrl = window.projectImgUrl;
        obj.orgin = window.location.origin + "/activity";
        var str = JSON.stringify(obj);
        str = window.btoa(str);
        var url =
          _this.$config.customerServiceUrl + "/customerService/pc?s=" + str;
        window.open(url, "_blank");
      } else {
        //旧客服
        const url = this.$common.getCustomerService();
        window.open(url, "_blank");
      }
    },
    onBack() {
      this.$router.push({
        path: "/discount",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./discount.scss";
.feedback-layout {
  position: relative;
  overflow: hidden;
  min-height: 900px;
  .header {
    margin: 20px 0;
    display: flex;
    align-items: center;
    font-size: 0.3rem;
    margin-bottom: 0.3rem;
    padding: 0 0.1rem 0.3rem;
    border-bottom: 1px solid rgba(233, 157, 66, 1);
    .discount-title {
      font-weight: bold;
      color: #3e444d;
      cursor: pointer;
    }
    .title {
      color: #101010;
    }
    .icon {
      margin: 0 0.2rem;
      width: 0.3rem;
      height: 0.3rem;
    }
  }
}
</style>
