<template>
  <div class="InviteVip">
    <!-- 邀请会员弹窗 -->
    <Dia-Log ref="dialogPopup" :dialogStyle="dialogStyle" @getListData="getListData">
      <!-- title文字描述 -->
      <h1 slot="title">{{ $t('邀请会员') }}</h1>
      <div class="cumulative">
          <span>{{ $t('总额度:{x}元', { x: totalBetValid }) }}</span>
          <span class="marginLeft">{{ $t('累计获得总返利:{x}元', { x: totalAllowance }) }}</span>
      </div>
      <el-form ref="form" :model="form" size="mini">
        <el-form-item :label="$t('注册时间')" class="buttons">
          <el-button class="themeGameHeaderActive" v-for="(item, index) in tradingTime" :key="index" @click="selectTime(item.id)" :class="{ tradingButtons: item.id == isTimeChange }">{{ item.name }}</el-button>
        </el-form-item>
        <el-form-item :label="$t('时间筛选')" class="time-left">
          <el-col :span="7" class="time-icon">
            <el-date-picker type="date" :clearable="false" :placeholder="$t('年月日')" v-model="form.startTime" :picker-options="startDateTime" :disabled="disabled" style="width: 100%;"></el-date-picker>
            <i class="time-icon-right"></i>
          </el-col>
          <el-col class="line" :span="1">{{ $t('至') }}</el-col>
          <el-col :span="7" class="time-icon">
            <el-date-picker :clearable="false" type="date" :placeholder="$t('年月日')" v-model="form.endTime" :picker-options="endDateTime" :disabled="disabled" style="width: 100%;"></el-date-picker>
            <i class="time-icon-right"></i>
          </el-col>
          <el-col :span="4" class="query querybgc">
            <el-button @click="getListData()" class="themeBtn buggonsUnique">{{ $t('查询') }}</el-button>
          </el-col>
          <el-col :span="4" class="reset">
            <el-button @click="reset()" class="themeBtnBorder tradingDefaultButtons">{{ $t('重置') }}</el-button>
          </el-col>
        </el-form-item>
      </el-form>
      <div class="nothing" v-show="nothingShow">
        <el-image class="nothing-image" :src="require('../../assets/image/xfImg/nothing-records.png')" fit="cover"></el-image>
        <p>{{ $t('一条记录都没有呢') }}...</p>
      </div>

      <div class="table-conent" v-show="!nothingShow">
        <el-table :data="tableData" border max-height="300" size="medium" ref="multipleTable" :key="tableData.length">
          <el-table-column prop="memberName" :label="$t('会员账号')" align="center" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="registerDate" :label="$t('注册时间')" align="center" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="validAmount" :label="$t('总有效投注(元)')" align="center" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="allowance" :label="$t('返利金(元)')" align="center" :show-overflow-tooltip="true"></el-table-column>
        </el-table>
      </div>
    </Dia-Log>
  </div>
</template>

<script>
import DiaLog from '../DiaLog/DiaLog';
export default {
    'components': {
        DiaLog
    },
    data() {
        return {
            'startDateTime': this.beginDate(),
            'endDateTime': this.endDate(),
            'disabled': false,
            'nothingShow':true,
            'isTimeChange': -1,
            'selectTypeId': '',
            'dialogStyle': {
                'dialogWidth': '',
                'iconWidth': '',
                'iconHieght': '',
                'iconImg': '',
                'currentPage': '',
                'total': 1,
                'paging': true
            },
            'totalAllowance':'0.00',
            'totalBetValid':'0.00',
            'form': {
                'memberId':'',
                'pageSize':10,
                'startTime': '',
                'endTime': '',
                'currentPage':1,
                'fixedStartTime': '',
                'fixedEndTime': ''
            },
            'tradingTime': [
                { 'name': this.$t('今日'), 'id': '1' },
                { 'name': this.$t('昨日'), 'id': '2' },
                { 'name': this.$t('近7日'), 'id': '3' },
                { 'name': this.$t('近30日'), 'id': '4' }
            ],
            'tableData': []
        };
    },
    'methods': {
        format(time, format) {
            var t = new Date(time);
            var tf = function(i) {
                return (i < 10 ? '0' : '') + i;
            };
            return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
                switch (a) {
                case 'yyyy':
                    return tf(t.getFullYear());
                    break;
                case 'MM':
                    return tf(t.getMonth() + 1);
                    break;
                case 'mm':
                    return tf(t.getMinutes());
                    break;
                case 'dd':
                    return tf(t.getDate());
                    break;
                case 'HH':
                    return tf(t.getHours());
                    break;
                case 'ss':
                    return tf(t.getSeconds());
                    break;
                }
            });
        },
        beginDate() {
            let that = this;
            return {
                disabledDate(time) {
                    if (that.form.endTime) {
                        return time.getTime() > that.form.endTime || time.getTime() > Date.now();
                    } else {
                        return time.getTime() > Date.now();
                    }
                }
            };
        },
        endDate() {
            let that = this;
            return {
                disabledDate(time) {
                    if (that.form.startTime) {
                        return time.getTime() < that.form.startTime || time.getTime() > Date.now();
                    } else {
                        return time.getTime() > Date.now();
                    }
                }
            };
        },
        reset() {
            this.form.startTime = '';
            this.form.endTime = '';
            this.isTimeChange = -1;
        },

        According() {
            this.$refs.dialogPopup.popUp(true);
            this.form.startTime = '';
            this.form.endTime = '';
            this.tableData = [];
            this.isTimeChange = -1;
            this.getListData();
            this.dialogStyle.total = 0;
            // 窗口宽度
            this.dialogStyle.dialogWidth = '11rem';
        },
        selectTime(selectId) {
            if (selectId != this.isTimeChange) {
                this.isTimeChange = selectId;
                this.form.startTime = '';
                this.form.endTime = '';
                this.form.fixedStartTime = '';
                this.form.fixedEndTime = '';
            } else {
                this.isTimeChange = -1;
                this.form.startTime = '';
                this.form.endTime = '';
                this.form.fixedStartTime = '';
                this.form.fixedEndTime = '';
            }
        },
        getTimeNum(val){
            if(val<10){
                return '0'+val;
            }
            return val;
        },
        dateTime(dateOf) {
            let forSevenDays, resultsTime, Yesterdays, dateTime;
            dateTime = new Date();
            forSevenDays = new Date(dateTime);
            forSevenDays.setDate(forSevenDays.getDate() - dateOf);
            //n天前
            resultsTime = forSevenDays.getFullYear() + '-' + this.getTimeNum(forSevenDays.getMonth() + 1) + '-' + this.getTimeNum(forSevenDays.getDate());
            // 今天
            if (dateOf == 1) {
                Yesterdays = forSevenDays.getFullYear() +'-' + this.getTimeNum(forSevenDays.getMonth() + 1) + '-' + this.getTimeNum(forSevenDays.getDate());
            } else {
                Yesterdays = dateTime.getFullYear() + '-' + this.getTimeNum(dateTime.getMonth() + 1) + '-' + this.getTimeNum(dateTime.getDate());
            }
            return [resultsTime, Yesterdays];
        },
        mask(str,begin){
            var fstStr = str.substring(0,begin);
            var scdStr =str.substring(str.length - 1,str.length);
            return `${fstStr}****${scdStr}`;
        },
        getListData(val = 1) {
            let that = this;
            that.dialogStyle.currentPage = val;
            let form = JSON.parse(JSON.stringify(this.form));
            switch (that.isTimeChange) {
            // 今日
            case '1':
                form.fixedStartTime = that.dateTime(0)[0];
                form.fixedEndTime = that.dateTime(0)[1];
                break;
                // 昨日
            case '2':
                form.fixedStartTime = that.dateTime(1)[0];
                form.fixedEndTime = that.dateTime(1)[1];
                break;
                // 近7日
            case '3':
                form.fixedStartTime = that.dateTime(6)[0];
                form.fixedEndTime = that.dateTime(6)[1];
                break;
                // 近30日
            case '4':
                form.fixedStartTime = that.dateTime(29)[0];
                form.fixedEndTime = that.dateTime(29)[1];
                break;
            }
            let startTime, endTime;
            if ( form.fixedStartTime == '' && form.fixedEndTime == '' && form.startTime == '' && form.endTime == '') {
                startTime = '';
                endTime = '';
            } else {
                form.startTime? startTime = that.format(form.startTime, 'yyyy-MM-dd HH:mm:ss'): startTime = `${form.fixedStartTime} 00:00:00`;
                form.endTime? endTime = that.format(form.endTime, 'yyyy-MM-dd 23:59:59'): endTime = `${form.fixedEndTime} 23:59:59`;
            }
            let data = {
                'currentPage': val,
                'endTime': endTime,
                'memberId': that.$common.getUser().user_id || '',
                'pageSize': 10,
                'startTime': startTime
            };
            that.$http.post(that.$api.memberAllowanceRecord,data).then((res) => {
                if(res){
                    that.dialogStyle.total = res.data.totalRecords;
                    that.tableData = res.data.content;
                    that.totalBetValid = that.$common.setNumFixed(res.data.totalBetValid,2);
                    that.totalAllowance = that.$common.setNumFixed(res.data.totalAllowance,2);
                    if(res.data.totalRecords > 0){
                        res.data.content.map((item) => {
                            item.memberName = that.mask(item.memberName,2);
                            item.registerDate = that.$common.conversionTime(item.registerDate);
                        });
                        that.nothingShow = false;
                    }else{
                        that.nothingShow = true;
                    }
                }else{
                    that.nothingShow = false;
                }
            });
        }
    }
};
</script>
<style>
.el-date-table td.today span,.el-year-table td.today .cell,.el-month-table td.today .cell{
  color: #9B7C4C !important;
}
.el-date-table td.current:not(.disabled) span {
    color: #FFF !important;
    background-color: #9B7C4C !important;
}
.el-tooltip__popper {
  font-size: 0.14rem !important;
}

.el-year-table td .cell:hover,.el-month-table td .cell:hover,.el-date-picker__header-label:hover,.el-picker-panel__icon-btn:hover,.el-date-table td div:hover{
  color: #9B7C4C !important;
}

</style>

<style lang="less">

.InviteVip {
  .tradingButtons {
      background-color:#896835 !important;
      color: #ffffff !important;
  }
  .el-dialog {
      height: 76%;
      .cumulative{
          width: 100%;
          display: flex;
          margin-bottom: 30px;
          color: #2D2B4D;
          font-size: 16px;
          .marginLeft{
              margin-left: 135px;
          }
      }
      .themeGameHeaderActive{
          color: #896835;
          border: 1px solid #E1E1E1 !important;
          font-size: 12px;
      }
    .el-table__header-wrapper {
      font-size: 0.16rem;
    }
    .el-input__inner {
        height: 0.4rem;
        line-height: 0.4rem;
        cursor: pointer;
        padding: 0 0.08rem;
        border-radius: 0.08rem;
    }
    .el-table {
      // height: 3rem !important;
      font-size: 0.14rem;
      th.gutter {
        display: table-cell !important;
      }
      .copybutton {
        border: none;
        color:#896835;
        background: none;
        padding: 0 5px;
        font-size: 0.14rem !important;
        padding-top: 0.02rem;
      }
      p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 1.3rem;
        font-size: 0.14rem !important;
      }
      .statusColor {
        color: red;
        width: 100%;
      }
    }
    .el-input__inner:focus {
      border-color: #a71e1e;
    }
    .el-date-picker {
      width: 3.22rem;
      table {
        width: 3.22rem;
      }
    }
    .el-date-picker__header {
      margin: 0 0.12rem;
    }
    .el-form-item__label {
      padding: 0 0.12rem 0 0;
    }
    .time-left {
      .el-form-item__label {
        line-height: 0.4rem;
        padding: 0 0.24rem 0 0;
      }
    }
    .el-col-7 {
      width: 1.6rem;
    }
    .el-form-item__content::after {
      display: none;
      content: '';
    }
    .query,
    .reset {
      margin-left: 15px;
      width: 1.32rem;
      .el-button {
        height: 0.4rem;
        width: 100%;
        font-size: 0.16rem;
        border-radius: 1.18rem;
        border: 1px solid #896835;
        color: #ffffff;
        height: 0.4rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .querybgc .el-button {
      background-color: #896835;
    }
    .querybgc:hover .el-button {
      border: 1px solid #9B7C4C;
      background-color: #9B7C4C;
    }
    .reset {
      .el-button {
        color: #896835;
        border-color: #896835;
      }
    }
    .reset:hover .el-button {
      background-color: #ffffff;
      border-color:#9B7C4C;
    }
    .table-conent {
      height: 4.2rem;
    }
  }
  .time-left .el-form-item__content {
    padding-left: 0.08rem;
  }
  .el-icon-date {
    display: none;
  }
    .el-button--mini {
    font-size: 0.16rem;
    padding: 0.07rem 0.15rem;
  }
  .nothing {
    height: 4.2rem;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    .nothing-image {
      width: 3.48rem;
      margin-top: 1.3rem;
    }
    p {
      color: #999999;
      font-size: 0.12rem;
      font-family: PingFang-SC-Medium;
    }
  }
  .buttons {
    .color {
      background-color:#896835 !important;
      color: #ffffff !important;
    }
    .el-form-item__content {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
    }
    .el-button {
      background-color: #ffffff;
      color: #896835;
      height: 0.32rem;
      width: 0.78rem;
      border: none;
      border-radius: 0.05rem;
      text-align: center;
      padding: 0;
      margin-left: 0.14rem;
    }
    .el-button:hover {
      background-color: #9B7C4C !important;
      color:#fff !important;
    }
  }
  .line {
    height: 0.4rem;
    line-height: 0.4rem;
    box-sizing: content-box;
    font-size: 0.16rem;
    text-align: center;
  }
  .time-icon {
    position: relative;
    .time-icon-right {
      pointer-events: none;
      position: absolute;
      right: 0.08rem;
      top: 50%;
      transform: translate(0, -50%);
      display: inline-block;
      background: url('../../assets/image/xfImg/icon-choose.png')
        no-repeat;
      background-size: 100%;
      width: 0.14rem;
      height: 0.14rem;
    }
  }
  .el-form-item {
    margin-bottom: 0.17rem;
  }
  .el-form-item__label {
    text-align: left;
    font-size: 0.15rem;
  }
  .el-icon-arrow-up:before {
    content: '';
  }
  .el-input__inner {
    font-size: 0.14rem;
    height: 0.28rem;
    line-height: 0.28rem;
  }
  .el-form-item__content {
    font-size: 0.14rem;
  }
  .el-table__body-wrapper {
    max-height: 2.55rem !important;
    overflow-x: hidden !important;
  }
  .el-table__body-wrapper::-webkit-scrollbar {
    display: block;
    width: 8px;
    height: 8px;
    background-color: rgba(245, 245, 245, 0.47);
  }
  /*定义滚动条的轨道，内阴影及圆角*/
  .el-table__body-wrapper::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px #f4f4f4;
    border-radius: 10px;
    background-color: #f4f4f4;
  }

  /*定义滑块，内阴影及圆角*/
  .el-table__body-wrapper::-webkit-scrollbar-thumb {
    /*width: 10px;*/
    height: 20px;
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #896835;
  }
}
</style>
