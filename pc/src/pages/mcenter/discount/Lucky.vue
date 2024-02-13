<template>
  <div class="lucky-layout discount-layout">
    <commonHeader :title="dataList.name || dd.name" />
    <div class="content">
      <!-- <div class="titps-top"> -->
      <Marquee v-if="dd.marquee" :text="dd.marquee" />
      <!-- </div> -->
      <el-table
        :data="unreceivedList"
        style="width: 100%"
        highlight-current-row
        max-height="373"
        :empty-text="'--' + $t('暂无记录') + '--'"
        @current-change="handleCurrentChange"
      >
        <el-table-column :label="$t('电游平台')" width="120">
          <template slot-scope="scope">{{ scope.row.vendorCode }}</template>
        </el-table-column>
        <el-table-column :label="$t('游戏时间')" width="200">
          <template slot-scope="scope">{{
            scope.row.betTime | timeSwitchAll
          }}</template>
        </el-table-column>
        <el-table-column
          prop="betAmount"
          :label="$t('下注金额')"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="betNo"
          :label="$t('幸运注单号')"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="amount"
          :label="$t('活动礼金')"
          width="120"
        ></el-table-column>
        <el-table-column :label="$t('操作')">
          <template slot-scope="scope">
            <!-- 领取 -->
            <div
              class="receive_btn"
              v-if="!received"
              @click="applyFn(scope.row)"
            >
              {{ $t('申请') }}
            </div>
            <!-- 已领取 -->
            <div class="isReceive_btn" v-else>{{ $t('已失效') }}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="tipbox">
        <p class="fullColor" style="text-align: left">
          <span class="fullColor"
            >{{ $t('如遇网络因素不显示当前符合的注单，请稍后刷新网络后重试或点击下面的自助提交') }}</span
          >
          {{ $t('请点击') }}
          <span class="tipColor" @click="customerService()"> {{ $t('这里') }} </span>
          {{ $t('自助提交申请优惠。') }}
        </p>
      </div>
      <template v-if="receivedList.length > 0">
        <div class="tipbox-title">
          <p class="fullColor">
            <span class="fullColor">{{ $t('今日申请记录') }}</span>
          </p>
        </div>
        <el-table
          :data="receivedList"
          style="width: 100%"
          highlight-current-row
          max-height="373"
          :empty-text="'--' + $t('暂无记录') + '--'"
          @current-change="handleCurrentChange"
        >
          <el-table-column :label="$t('申请时间')" width="200">
            <template slot-scope="scope">{{
              scope.row.receiveTime | timeSwitchAll
            }}</template>
          </el-table-column>

          <el-table-column
            :label="$t('申请平台')"
            width="180"
            prop="vendorCode"
          ></el-table-column>
          <el-table-column
            prop="betNo"
            :label="$t('投注单号')"
            width="150"
          ></el-table-column>
          <el-table-column
            prop="amount"
            :label="$t('活动礼金')"
            width="150"
          ></el-table-column>
          <el-table-column
            prop="betAmountValid"
            :label="$t('下注金额')"
            width="150"
          ></el-table-column>
          <el-table-column
            fixed="right"
            prop="remark"
            :label="$t('备注')"
          ></el-table-column>
        </el-table>
      </template>
      <div class="tipbox2">
        <span class="remk" @click="openDetail"> {{ $t('优惠详情') }} </span>
      </div>
    </div>
  </div>
</template>
<script>
import commonHeader from "./commonHeader.vue";
import Marquee from "@/components/Marquee/index.vue";
export default {
  props: {
    dd: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    commonHeader,
    Marquee,
  },
  data() {
    return {
      dataList: {},
      currentRow: null, //当前选中行
      award: "xxx", //领取的奖励
      id: "", //活动id
      receivedList: [],
      unreceivedList: [],
      dailyAppCount: "",
      received: false, //领取状态  false表示还未领取
    };
  },
  filters: {
    timeSwitch(val) {
      if (val) {
        var date = new Date(val); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + ".";
        var M =
          (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + ".";
        var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var time = Y + M + D;
        return time;
      }
    },
    timeSwitchAll(val) {
      if (val) {
        var date = new Date(val); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + "-";
        var M =
          (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-";
        var D =
          (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
        var h =
          (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
          ":";
        var m =
          (date.getMinutes() < 10
            ? "0" + date.getMinutes()
            : date.getMinutes()) + ":";
        var s =
          date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        var time = Y + M + D + h + m + s;
        return time;
      }
    },
  },
  created() {
    this.id = this.dd.id;
    this.getData();
  },
  methods: {
    async getData() {
      const res = await this.$http.get(
        this.$api.getThematicActivitiesByApp + "/" + this.id,
        "",
        true
      );
      if (res.code == 0 && res.data) {
        this.dataList = res.data;
        this.dailyAppCount = this.dataList.dailyAppCount;
        this.receivedList = res.data.speActLuckyTimesVO.receivedList;
        this.unreceivedList = this.dataList.speActLuckyTimesVO.unreceivedList;
        this.received = this.dataList.speActLuckyTimesVO.received;
      }
    },
    handleCurrentChange(val) {
      //选中行
      this.currentRow = val;
    },
    applyFn(item) {
      var _this = this;
      this.$confirm(this.$t('是否确认申请该注单奖励？'), "", {
        confirmButtonText: this.$t('确认'),
        cancelButtonText: this.$t('取消'),
        showClose: false,
      }).then(() => {
        //申请
        this.getFn(item);
      });
    },
    async getFn(item) {
      const res = await this.$http.put(
        this.$api.getReceiveActivities +
          item.thematicActivitiesId +
          "&betNo=" +
          encodeURIComponent(item.betNo)
      );
      if (res.code == 0) {
        this.$message({
          type: "success",
          message: res.data,
        });
        this.getData(this.id);
        //更新余额
        this.getUserBalance();
      } else {
        this.$message({ type: "warning", message: res.msg });
      }
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
    openDetail() {
      this.$emit("detail", this.dd.id);
      // this.$router.push({
      //     path:'/actDetail',
      //     query:{
      //         byAppId: this.id
      //     }
      // })
    },
    customerService() {
      if (['vi'].includes(window.locale)) { // betcome直接跳客服窗口
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
  },
};
</script>
<style lang="scss" scoped>
@import "./discount.scss";
.lucky-note-layout {
}
::v-deep {
  .el-table {
    th.el-table__cell.el-table_1_column_4 {
      .cell {
        font-size: 0.16rem;
      }
    }
  }
}
</style>
