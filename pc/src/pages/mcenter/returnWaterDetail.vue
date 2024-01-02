<template>
  <div class="correspondence">
    <div class="screening">
      <el-row>
        <el-col :span="3" class="positioning">
          <el-input v-model="form.moneyMin" placeholder="0">
            <template slot="append"> </template>
          </el-input>
        </el-col>
        <el-col class="line" :span="1">{{$t('至')}}</el-col>
        <el-col
          :span="3"
          class="input-left positioning"
          style="margin-right:30px;"
        >
          <el-input v-model="form.moneyMax" placeholder="0">
            <template slot="append"> </template>
          </el-input>
          
        </el-col>

        <el-col :span="4">
          <el-date-picker
            type="date"
            :placeholder="$t('开始时间')"
            v-model="form.startTime"
            :picker-options="startDatePicker"
            :editable="false"
            :clearable="false"
            style="width: 100%;cursor:pointer;"
          ></el-date-picker>
        </el-col>

        <el-col class="line" :span="1">{{$t('至')}}</el-col>

        <el-col :span="4">
          <el-date-picker
            type="date"
            :placeholder="$t('结束时间')"
            v-model="form.endTime"
            :picker-options="endDatePicker"
            :editable="false"
            :clearable="false"
            style="width: 100%;"
          ></el-date-picker>
        </el-col>

        <el-col :span="2" class="query">
          <span @click="getListData()">{{$t('查询')}}</span>
        </el-col>

        <el-col :span="2" class="reset">
          <span @click="reset()">{{$t('重置')}}</span>
        </el-col>
      </el-row>

      <el-table
        :data="tableData"
        border
        style="margin-top:20px;"
        height="500"
        :key="timer"
      >
        <el-table-column
          prop="createdAt"
          :label="$t('时间')"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="vendorName"
          :label="$t('游戏平台')"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="gameName"
          :label="$t('游戏名称')"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="effectiveBet"
          :label="$t('流水')"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="rebateAmount"
          :label="$t('返水')"
          align="center"
        ></el-table-column>
      </el-table>
      <div class="bottom right">
        <el-pagination
          layout="prev,pager,next"
          :total="total"
          @current-change="getListData"
          :pageSize="10"
          :current-page.sync="form.currentPage"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      startDatePicker: this.beginDate(),
      endDatePicker: this.endDate(),
      nothingShow: false,
      form: {
        moneyMin: "",
        moneyMax: "",
        startTime: "",
        endTime: "",
        pageSize: 10,
        currentPage: 1,
        memberId: this.$common.getUser() ? this.$common.getUser().user_id : "",
      },
      tableData: [],
      total: 0,
      type: 0,
      timer: new Date().getTime(),
    };
  },
  mounted() {
    //切换头部 tab
    this.$emit("switchTab");
    var betNo = "";
    if (this.$route.params.type) {
      this.type = this.$route.params.type;
    }
    if (this.$route.params.betNo) {
      betNo = this.$route.params.betNo;
    }
    this.According(this.type, betNo);
  },
  methods: {
    beginDate() {
      let that = this;
      return {
        disabledDate(time) {
          if (that.form.endTime) {
            return (
              time.getTime() > that.form.endTime || time.getTime() > Date.now()
            );
          } else {
            return time.getTime() > Date.now();
          }
        },
      };
    },
    endDate() {
      let that = this;
      return {
        disabledDate(time) {
          if (that.form.startTime) {
            return (
              time.getTime() < that.form.startTime ||
              time.getTime() > Date.now()
            );
          } else {
            return time.getTime() > Date.now();
          }
        },
      };
    },
    onCopyResult(type) {
      if (type === "success") {
        this.$message({
          message: this.$t("复制成功"),
          type: "success",
        });
      } else {
        this.$message.error(this.$t("复制失败"));
      }
    },
    reset() {
      this.form.moneyMin = "";
      this.form.moneyMax = "";
      this.form.startTime = "";
      this.form.endTime = "";
    },
    conversionTime(timeStamp) {
      if (timeStamp > 0) {
        var date = new Date();
        date.setTime(timeStamp);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        var d = date.getDate();
        d = d < 10 ? "0" + d : d;
        var h = date.getHours();
        h = h < 10 ? "0" + h : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? "0" + minute : minute;
        second = second < 10 ? "0" + second : second;
        // return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
        return y + "-" + m + "-" + d;
      } else {
        return "";
      }
    },
    According(type, betNo) {
      this.type = type; //0 查询待领取返水  1 查询批次返水 详情
      this.betNo = betNo; //查询批次返水   单号

      this.form.moneyMin = "";
      this.form.moneyMax = "";
      this.form.startTime = "";
      this.form.endTime = "";
      this.form.memberId = this.$common.getUser()
        ? this.$common.getUser().user_id
        : "";
      this.tableData = [];
      this.total = 0;
      this.getListData(1);
    },
    format(time, format) {
      var t = new Date(time);
      var tf = function(i) {
        return (i < 10 ? "0" : "") + i;
      };
      return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
        switch (a) {
          case "yyyy":
            return tf(t.getFullYear());
            break;
          case "MM":
            return tf(t.getMonth() + 1);
            break;
          case "mm":
            return tf(t.getMinutes());
            break;
          case "dd":
            return tf(t.getDate());
            break;
          case "HH":
            return tf(t.getHours());
            break;
          case "ss":
            return tf(t.getSeconds());
            break;
        }
      });
    },
    // 查询列表数据
    getListData(val = 1) {
      if (this.type == 0) {
        //待领取返水
        this.getRebateAmountDetail(val);
      } else {
        //查询批次返水详情
        this.getDetailByBetNo();
      }
    },
    getRebateAmountDetail(val) {
      this.form.currentPage = val - 0;

      let form = JSON.parse(JSON.stringify(this.form));
      form.startTime
        ? (form.startTime = this.format(form.startTime, "yyyy-MM-dd HH:mm:ss"))
        : (form.startTime = "");
      form.endTime
        ? (form.endTime = this.format(form.endTime, "yyyy-MM-dd 23:59:59"))
        : (form.endTime = "");

      //待领取 status = 0
      this.$set(form, "currentPage", val);
      this.$set(form, "pageSize", 10);
      this.$set(form, "status", 0);
      this.$set(form, "delFlag", 0);

      this.$http
        .post(this.$api.getRebateAmountDetail, form, true)
        .then((res) => {
          if (res && res.data && res.data.list.length > 0) {
            res.data.list.map((item) => {
              item.createdAt = this.conversionTime(item.createdAt);
            });

            if (res.data.total > 10) {
              this.total = res.data.total;
            } else {
              this.total = 0;
            }
            res.data.list.forEach((item) => {
              item.rebateAmount = this.$common.setNumFixed(
                item.rebateAmount,
                2
              );
              item.effectiveBet = this.$common.setNumFixed(
                item.effectiveBet,
                2
              );
            });
            this.tableData = res.data.list;
            this.nothingShow = false;
          } else {
            this.tableData = [];
            this.total = 0;
            this.nothingShow = true;
            if (res.code !== 0) {
              this.$message.error(res.msg);
            }
          }
        });
    },
    getDetailByBetNo() {
      let form = JSON.parse(JSON.stringify(this.form));
      form.startTime
        ? (form.startTime = this.format(form.startTime, "yyyy-MM-dd HH:mm:ss"))
        : (form.startTime = "");
      form.endTime
        ? (form.endTime = this.format(form.endTime, "yyyy-MM-dd 23:59:59"))
        : (form.endTime = "");

      //批次返水 betNo 单号
      this.$set(form, "betNo", this.betNo);

      this.$http.post(this.$api.getDetailByBetNo, form, true).then((res) => {
        if (res && res.data && res.data.length > 0) {
          res.data.map((item) => {
            item.createdAt = this.conversionTime(item.createdAt);
          });
          this.tableData = res.data;
          this.nothingShow = false;
        } else {
          this.tableData = [];
          this.nothingShow = true;
          if (res.code !== 0) {
            this.$message.error(res.msg);
          }
        }
      });
    },
  },
};
</script>
<style lang="scss">
.correspondence {
  // padding: 0 25%;
  // box-sizing: border-box;
  width: 1180px;
  margin: 0 auto;
  .screening {
    margin: 20px 0;
    .positioning {
      position: relative;
      i {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 5px;
      }
    }
  }
  .line {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .query,
  .reset {
    margin-left: 20px;
    width: 110px;
    height: 40px;
  }
  .query span,
  .reset span {
    width: 110px;
    height: 40px;
    border-radius: 40px;
    background: #59bafc;
    display: inline-block;
    text-align: center;
    line-height: 40px;
    color: #fff;
    font-size: 16px;
  }
  .reset span {
    background: #8e9da8;
  }
  .bottom {
    display: flex;
    justify-content: space-between;
  }
  .right {
    float: right;
  }
}
</style>
