<template>
  <div class="mosaic-gold">
    <!-- 投注记录弹窗 dialogStyle为传递给窗口的样式属性-->
    <dia-Log ref="dialogPopup" :dialogStyle="dialogStyle">
      <!-- title文字描述 -->
      <div slot="title" class="header-box">
        <div class="width-25" @click="handleDhm">{{$t('兑换码')}}</div>
        <h1 class="flex-title-1">{{ $t('彩金') }}</h1>
        <div class="width-25"></div>
      </div>

      <div>
        <ul class="header-button">
          <li class="cursorPoint" v-for="(item,index) in buttonList" :key="index" @click="choose(item.id)" :class="{headerColor:item.id === headerId,}">{{item.name}}</li>
        </ul>
        <div class="nothing" v-show="nothingShow">
          <el-image class="nothing-image" :src="require('../../assets/image/xfImg/nothing-records.png')" fit="cover"></el-image>
          <p>{{ $t('一条记录都没有呢') }}...</p>
        </div>
        <div class="maxHeight" v-show="!nothingShow">

          <ul class="content" v-infinite-scroll="load" infinite-scroll-immediate="false">
            <li v-for="(item,index) in dataList" :key="index" :class="`cardBgc${item.state}`" v-show="headerId == (item.state+1) || headerId === '0'">
              <i class=" leftIcon" v-if="item.state !== 2"></i>
              <i class="rightIcon" v-if="item.state === 2" :style="`background:url(${$config.getLocaleImg('rightIcon')})`"></i>
              <p class="left time">{{item.createdAt}}</p>
              <p class="left name">{{item.name}}</p>
              <p class="right amount">
                <i></i>{{item.amount}}
              </p>
              <p class="left getTime">{{ $t('领取有效期截止') }}：</p>
              <p class="left getTimeText">{{item.overdueTime}}</p>
              <!-- state:0未领取，1已领取，2已过期 -->
              <span class="right receive cursorPoint" v-if="item.state === 0" @click="toReceive(item)">{{ $t('立即领取') }}</span>
              <span class="right receive bottonColor cursorPoint" v-else-if="item.state === 1">{{ $t('已领取') }}</span>
              <span class="right receive bottonColor1 cursorPoint" v-else-if="item.state === 2">{{ $t('已过期') }}</span>
            </li>
          </ul>
          <p v-show="loading" style="margin-top:10px;">{{ $t('加载中') }}...</p>
          <p v-show="noMore" style="margin:10px 0;text-align:center;">{{ $t('没有更多了') }}...</p>
        </div>
      </div>
    </dia-Log>
    <el-dialog :visible.sync="popupReceive" width="420px">
		<div class="dialog-header">
			<!-- 头部icon下面的title文字 -->
			<h1>{{ $t('彩金领取') }}</h1>
			<img loading="lazy" class="dialogClose-header-img cursorPoint" v-lazy="require('../../assets/image/xfImg/login-close.png')" @click="dialogClose" />
		</div>

        <!-- <img loading="lazy" class="dialogClose-header-img cursorPoint" src="../../assets/images/login-close2.png" @click="dialogClose" /> -->
        <div class="secondaryPopup">
            <p v-show="receiveText === $t('立即领取')">{{ $t('{x}元', { x: amount }) }}</p>
            <span v-show="receiveText === $t('立即领取')">{{ $t('流水要求{x}倍', { x: multiple }) }}</span>
            <span class="contentText" v-show="receiveText === $t('知道了')">{{ $t('领取成功，请前往') }}<br/>{{ $t('余额查看') }}</span>
            <div @click="confirmReceive" class="cursorPoint">{{receiveText}}</div>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import diaLog from '../DiaLog/DiaLog';
export default {
  components: {
    diaLog
  },
  data() {
    return {
      dialogStyle: {},
      loading: false,
      noMore: false,
      receiveText: this.$t('立即领取'),
      headerId: '1', //切换id
      receiveId: '', //二级弹窗领取当前项的id参数
      amount: '', //领取金额
      multiple: '', //弹窗领取要求倍数
      nothingShow: false,
      popupReceive: false,
      paging: '1',
      buttonList: [
        { name: this.$t('全部'), id: '0' },
        { name: this.$t('可领取'), id: '1' },
        { name: this.$t('已领取'), id: '2' },
        { name: this.$t('已过期'), id: '3' }
      ],
      dataList: []
    }
  },
  methods: {
    // 点击兑换码
    handleDhm(){
      this.$prompt(this.$t('请输入兑换码'), this.$t('温馨提示'), {
          confirmButtonText: this.$t('确定兑换'),
          cancelButtonText: this.$t('取消'),
          // inputValue: '请输入兑换码',
          // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          // inputErrorMessage: '邮箱格式不正确'
        }).then(({ value }) => {
            if(!value){
              this.$message({
                type: 'success',
                message: this.$('兑换码不能为空')
              });
              return
            }
            this.$http.post(this.$api.exchangeRedeemCode, {redeemCode: value}).then(res => {
              this.getListData(this.paging)
               if(res.code === 0){
                  this.$message({
                    type: 'success',
                    message: res.msg
                  });
               }  else {
                  this.$message({
                    type: 'error',
                    message: res.msg
                  });
               }
            })
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '取消输入'
          // });
        });
    },
    load() {
      if (this.dataList.length !== 0) {
        this.getListData(this.paging)
      }
    },
    conversionTime(timeStamp) {
      if (timeStamp > 0) {
        var date = new Date();
        date.setTime(timeStamp);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = date.getDate();
        d = d < 10 ? '0' + d : d;
        var h = date.getHours();
        h = h < 10 ? '0' + h : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? '0' + minute : minute;
        second = second < 10 ? '0' + second : second;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
        return y + '-' + m + '-' + d;
      } else {
        return '';
      }
    },
    According() {
      this.$refs.dialogPopup.popUp(true);
      this.headerId = '0';
      this.paging = 1;
      this.dataList = [];
      // 窗口宽度
      this.dialogStyle.dialogWidth = '7rem';
      this.getListData();
    },
    //彩金弹窗类型切换
    choose(id) {
      this.noMore = false;
      this.headerId = id;
      this.paging = 1;
      this.dataList = [];
      if (id == 0) {
        this.getListData(1, 3);
      } else {
        this.getListData(1, id - 1);
      }
    },
    dialogClose() {
      this.popupReceive = false;
      //取消mypage的点击高亮效果
    },
    // 确认领取
    confirmReceive() {
      let that = this;
      if (that.receiveText === this.$t('知道了')) {
        that.popupReceive = false;
      } else {
        that.$http.get(that.$api.receive, that.receiveId).then(res => {
          if (res.code === 0) {
            that.getListData();
            that.mosaicGoldPush();
            that.receiveText = this.$t('知道了');
          } else {
            this.$message.error(this.$t('领取失败'));
          }
        })
      }
    },
    //确认领取弹出
    toReceive(item) {
      this.receiveText = this.$t('立即领取');
      this.receiveId = item.id;
      this.amount = this.$common.setNumFixed(item.amount,2);
      this.multiple = this.$common.setNumFixed(item.amountAudit / item.amount,2);
      this.popupReceive = true;
    },
    //点击领取之后改变彩金状态
    mosaicGoldPush() {
      this.$http.get(this.$api.getNotReceive).then(res => {
        if (res.code === 0) {
          if (res.data.notReceiveState) {
            this.$store.commit('mosaicGoldStatus', 2);
          } else {
            this.$store.commit('mosaicGoldStatus', 1);
          }
        }
      })
    },
    //请求数据
    getListData(val = 1, all = 3) {
      let that = this;
      let data = {
        pageSize: 10,
        currentPage: '',
        state: all
      }
      data.currentPage = val;
      that.$http.post(that.$api.getAppList, data).then(res => {
        if (res && res.data && res.data.totalRecords > 0) {
          that.nothingShow = false;
          res.data.content.map(item => {
            item.createdAt = that.conversionTime(item.createdAt);
            item.overdueTime = that.conversionTime(item.overdueTime);
          })
          if (val == 1) {
            that.dataList = res.data.content;
          } else {
            that.dataList.push(...res.data.content);
          }
          if (res.data.content.length !== 0) {
            that.paging++;
          } else {
            that.noMore = true;
          }
        } else {
          that.loading = false;
          that.nothingShow = true;
        }
      })
    }
  }
}
</script>

<style lang="less">
.mosaic-gold {
	.dialogClose-header-img {
		width: 17px;
		height: 17px;
		position: absolute;
		top: 0.14rem;
		right: 0.14rem;
		transition: 1s;
	}

	.dialogClose-header-img:hover {
		transform: rotate(180deg);
	}
  .el-dialog {
    .dialog-header {
      padding: 40px 16px 0 16px;
      border-top-left-radius: 0.1rem;
      border-top-right-radius: 0.1rem;
      h1 {
		color: #000;
		text-align: center;
        font-size: 0.24rem;
        font-weight: normal;
      }
    }
    .el-icon-close:before {
      content: '';
    }
    .dialog-header-close {
      background-size: cover;
      width: 0.47rem;
      height: 0.47rem;
      position: absolute;
      top: 0.15rem;
      right: 0.15rem;
    }
    .el-dialog__body {
      height: 100%;
      padding: 0;
      display: flex;
      flex-direction: column;
    }
    .el-dialog__header {
      padding: 0;
    }
    .dialog-content-top {
      max-height: 500px;
    }
  }

  // 头部全部按钮
  .header-button {
    display: flex;
    justify-content: space-between;
    li {
      width: 0.6rem;
      height: 0.49rem;
      text-align: center;
      line-height: 0.49rem;
      font-size: 0.15rem;
    }
    .headerColor {
      color: #ffe371;
      border-bottom: 3px solid #ffe371;
    }
  }
  .maxHeight {
    display: inline-block;
    height: 430px;
    width: 100%;
    overflow: scroll;
    margin-top: 10px;
  }

  //   内容卡片区域
  .content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    li {
      width: 48%;
      height: 1.6rem;
      border-radius: 0.1rem;
      margin-top: 0.2rem;
      color: #fff;
      background: linear-gradient(
        135deg,
        rgba(240, 193, 113, 1) 0%,
        rgba(243, 218, 158, 1) 100%
      );
      font-size: 0.12rem;
      padding: 0.12rem;
      position: relative;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .leftIcon {
        width: 1.47rem;
        height: 0.49rem;
        display: inline-block;
        position: absolute;
        left: 0;
        top: 0;
        background: url('../../assets/image/xfImg/MosaicGold/leftBgc.png')
          no-repeat;
        background-size: 100% 100%;
      }
      .rightIcon {
        width: 0.7rem;
        height: 0.7rem;
        display: inline-block;
        position: absolute;
        right: 0.1rem;
        top: 0.2rem;
        background-size: 100% 100% !important;
        opacity: 0.7;
      }
      .left {
        text-align: left;
      }
      .right {
        text-align: right;
      }
      .time {
        font-size: 0.12rem;
        text-shadow: 0px 2px 0px rgba(0, 0, 0, 0.16);
      }
      .name {
        font-size: 0.16rem;
        text-shadow: 0px 2px 0px rgba(0, 0, 0, 0.16);
      }
      .amount {
        font-size: 0.18rem;
        line-height: 1;
        text-shadow: 0px 2px 0px rgba(0, 0, 0, 0.16);
        i {
          font-size: 0.12rem;
        }
      }
      .getTime {
        font-size: 0.14rem;
      }
      .getTimeText {
        font-size: 0.12rem;
      }
      .receive {
        position: absolute;
        right: 0.12rem;
        bottom: 0.11rem;
        padding: 0.04rem 0.12rem;
        background-color: #d6ae66;
        border-radius: 0.52rem;
        text-align: center;
        line-height: 0.19rem;
        font-size: 0.12rem;
      }
      .bottonColor {
        background-color: #8f92a1;
      }
      .bottonColor1 {
        background-color: #a7a7a7;
      }
    }
    .cardBgc1 {
      background: linear-gradient(
        135deg,
        rgba(188, 189, 205, 1) 0%,
        rgba(206, 210, 221, 1) 100%
      );
    }
    .cardBgc2 {
      background: #e1e1e1;
    }
  }
  .nothing {
    height: 430px;
    box-sizing: border-box;
    width: 35%;
    margin: 1.3rem auto;
    p{
      text-align: center;
    }
  }
  //   二级弹窗
  .secondaryPopup {
    p {
		text-align: center;
		font-size: 0.3rem;
		font-weight: 500;
		margin: 0.2rem 0 0.14rem 0;
		color: #333333;
    }
    span {
		display: block;
		text-align: center;
		font-size: 0.14rem;
		font-family: PingFang SC;
		font-weight: 500;
		line-height: 12px;
		color: rgba(153, 153, 153, 1);
		opacity: 1;
    }
    div {
      width: 3.5rem;
	  height: 0.4rem;
	  text-align: center;
      background:#333;
      opacity: 1;
      border-radius: 20px;
      line-height: 0.4rem;
      color: #fff;
      margin: 0.45rem auto;
    }
    .contentText {
		display: block;
		text-align: center;
		font-size: 0.2rem;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		margin-top: 0.5rem;
		display: inline-block;
		line-height: 32px;
		width: 100%;
    }
  }
}

.header-box{
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  padding: 0 35px;
}
.width-25{
  width: 150px;
  color: #3578c0;
  &:hover{
    color: #ffe371;
  }
}
.flex-title-1{
  flex: 1;
}
</style>
