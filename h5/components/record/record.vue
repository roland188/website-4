<template>
  <s-pull-scroll
    ref="pullScroll"
    :pullDown="pullDown"
    :pullUp="loadData"
    :tops="tops"
    :head="head"
    :DoNotLoad="DoNotLoad"
  >
    <view style="overflow: scroll" v-if="topupTrue">
      <view
        class="contents"
        :class="{ contenetsHeight: item.payment }"
        v-for="(item, index) in topup"
        @click="detailsJump(item)"
        :key="index"
      >
        <view class="contentLeft">
          <view
            class="contentImg"
            v-if="id == 1 && item.picUrl !== ''"
            :style="
              'background-image:url(' + $config.getImgUrl(item.picUrl) + ')'
            "
            style="background-size: cover"
          ></view>
          <view
            class="contentImg"
            v-if="id == 1 && item.picUrl == ''"
            :class="{ contentImg1: item.picUrl == '' }"
            style="background-size: cover"
          ></view>
          <view
            v-if="id == 5"
            :class="{
              returnWaterImg: item.type == 16,
              returnWaterImg1: item.type == 17,
            }"
            style="background-size: cover"
          ></view>
          <view class="textHeight">
            <text
              class="color1 recordTextOne"
              :class="{
                color2:
                  item.status === 0 ||
                  (item.status === 1 && id == 3) ||
                  (item.status === 1 && id == 3.1) ||
                  (item.status === 3 && id == 3) ||
                  item.status === 4 ||
                  item.name === $t('出款失败'),
              }"
            >
              {{ item.name }}
            </text>
            <text class="type" v-if="item.payment">{{ item.payment }}</text>
            <text class="time">{{ item.createdAt }}</text>
          </view>
        </view>
        <view class="contentRight">
          <view class="contentRight-one" v-if="id != 2">
            <view class="recordTextOne">{{ $config.currency }}</view
            ><text class="recordTextOne">{{ item.rebateAmount }}</text>
            <i v-if="id != 5"></i>
          </view>
          <i v-show="id == 2 || (item.type == 16 && id == 5)"></i>
        </view>
      </view>
    </view>
    <view class="recordBgc" :class="{ recordBgc1: id == 3 }" v-else>
      <view>
        <image src="../../static/image/xf/null.png"></image>
        <text class="recordTextOne">{{ $t("一条记录都没呢...") }}</text>
      </view>
    </view>
  </s-pull-scroll>
</template>

<script>
import sPullScroll from "@/components/s-pull-scroll/index.vue";
import cache from "../../utils/cache.js";
export default {
  components: {
    sPullScroll,
  },
  props: ["record", "parameters", "tops"],
  data() {
    return {
      aa: 0.199,
      DoNotLoad: {
        one: true,
        two: true,
      },
      flag: true,
      totalRecords: "",
      topupTrue: true,
      topupId: "",
      topupLength: "",
      topup: [],
      MoreHeight: "",
      contentHeight: "",
      id: "",
      hasOrNot: "",
      timeTrue: false,
      btId: "",
      head: "",
      isTrue: "",
      pageNum: 1,
    };
  },
  methods: {
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
        return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
      } else {
        return "";
      }
    },
    refresh() {
      this.$nextTick(() => {
        this.$refs.pullScroll.refresh();
      });
    },
    //刷新
    pullDown(pullScroll) {
      // 下拉刷新获取下拉的pageNum,确保每次下拉刷新的都是第一页数据
      this.pageNum = pullScroll.page;
      this.topupLength = "";
      //请求数据，id是3判断为线上记录接口，true判断是充值还是转账，在初次进入时已赋值
      this.change(this.id, this.isTrue);
      //延迟两秒刷新动画
      setTimeout(() => {
        pullScroll.success();
      }, 200);
    },
    //加载
    loadData(pullScroll) {
      //如果有数据，并且接口返回的总数据小于每页的条数，表示返回的所有数据还未展示完第一页，则后续没有更多数据，下拉不加载。
      if (this.topup.length !== 0 && this.totalRecords <= this.topup.length) {
        pullScroll.finish();
      } else {
        // length为0表示一进来就没有数据,下拉不加载
        if (this.topup.length == 0) {
          pullScroll.success();
        } else {
          //首页有数据，则下拉加载时，获取下拉的pageNum
          this.pageNum = pullScroll.page;
          setTimeout(() => {
            this.change(this.id, this.isTrue);
            pullScroll.success();
          }, 500);
          this.page = false;
        }
      }
    },
    change(val, isTrue, id, data) {
      if (val) {
        this.id = val;
        this.head = val;
      }
      if (id === 1) {
        this.$refs.pullScroll.page = id;
        this.pageNum = id;
      }
      this.isTrue = isTrue;
      if (data) {
        this.parameters = data;
      }
      this.parameters.highestAmount
        ? (this.parameters.highestAmount = this.parameters.highestAmount - 0)
        : (this.parameters.highestAmount = "");
      this.parameters.minimumAmount
        ? (this.parameters.minimumAmount = this.parameters.minimumAmount - 0)
        : (this.parameters.minimumAmount = "");
      // 在这里判断我从哪个入口进来的
      switch (this.id) {
        case "1":
          // 游戏记录列表
          var data = {
            memberId: this.$server.getUser().user_id,
            betAmountMax: this.parameters.highestAmount,
            betAmountMin: this.parameters.minimumAmount,
            startTimeBet: this.parameters.dateStart || "",
            endTimeBet: this.parameters.dateEnd || "",
            pageNum: this.pageNum,
            pageSize: 15,
            gameType: this.parameters.gameval || "", //游戏类型this.val
            vendorCodeList: [], //游戏平台this.value;
          };
          this.parameters.gamevalue
            ? data.vendorCodeList.push(this.parameters.gamevalue)
            : data.vendorCodeList.push();
          // this.parameters.gamevalue? data.vendorCodeList = this.parameters.gamevalue : data.vendorCodeList.push();
          this.$api.queryBetRecords(
            data,
            (err, res) => {
              if (res) {
                this.totalRecords = res.total;
                this.$emit("tops", true, res);
                if (res.list.length > 0) {
                  this.topupTrue = true;
                  res.list.map((item) => {
                    item.createdAt = this.conversionTime(item.betTime);
                    if (item.status == 0) {
                      item.rebateAmount = this.$t('待结算');
                    } else {
                      item.rebateAmount = this.$common.setNumFixed(
                        item.winLoss,
                        2
                      );
                    }
                    item.gameName === ""
                      ? (item.name = item.vendorName)
                      : (item.name = item.gameName);
                  });
                  if (this.pageNum == 1) {
                    this.topup = res.list;
                  } else {
                    res.list.map((item) => {
                      this.topup.push(item);
                    });
                  }
                  if (this.totalRecords <= this.topup.length) {
                    this.DoNotLoad.one = false;
                    this.DoNotLoad.two = true;
                  } else {
                    this.DoNotLoad.one = true;
                    this.DoNotLoad.two = true;
                  }
                } else {
                  if (this.pageNum == 1) {
                    this.DoNotLoad.one = false;
                    this.DoNotLoad.two = false;
                    this.topupTrue = false;
                  } else {
                    this.topupTrue = true;
                  }
                  this.$emit("tops", false);
                }
              } else {
                this.DoNotLoad.one = false;
                this.DoNotLoad.two = false;
                this.topupTrue = false;
                this.$emit("tops", false);
              }
            },
            true
          );
          break;
        case "2":
          // 活动记录列表
          var data = {
            memberId: this.$server.getUser().user_id,
            currentPage: this.pageNum,
            pageSize: 15,
            dateBegin: this.parameters.dateStart || "",
            dateEnd: this.parameters.dateEnd || "",
            actName: this.parameters.val,
          };
          this.$api.getPartake(
            data,
            (err, res) => {
              if (res) {
                this.totalRecords = res.totalRecords;
                if (res.content.length > 0) {
                  this.topupTrue = true;
                  res.content.map((item) => {
                    item.createdAt = this.conversionTime(item.joinTime);
                    item.name = item.actName;
                  });

                  if (this.pageNum == 1) {
                    this.topup = res.content;
                  } else {
                    res.content.map((item) => {
                      this.topup.push(item);
                    });
                  }
                  if (this.totalRecords <= this.topup.length) {
                    this.DoNotLoad.one = false;
                    this.DoNotLoad.two = true;
                  } else {
                    this.DoNotLoad.one = true;
                    this.DoNotLoad.two = true;
                  }
                } else {
                  //判断是否是下拉加载的数据是否为空
                  if (this.pageNum == 1) {
                    this.DoNotLoad.one = false;
                    this.DoNotLoad.two = false;
                    this.topupTrue = false;
                  } else {
                    this.topupTrue = true;
                  }
                }
              } else {
                this.DoNotLoad.one = false;
                this.DoNotLoad.two = false;
                this.topupTrue = false;
              }
            },
            true
          );
          break;
        case "3":
        case "3.1":
        case "3.2":
          this.$refs.pullScroll.more();
          if (id === 1) {
            this.$refs.pullScroll.scrollTo(0);
            this.parameters = {
              highestAmount: "",
              minimumAmount: "",
              dateStart: "",
              dateEnd: "",
              val: "",
              conversion: "",
            };
          }
          // 线上记录
          // record区分是充值记录还是转账记录 true是充值记录 false是转账记录
          if (isTrue == 0) {
            // 这是充值记录
            this.parameters.conversion === 0
              ? (this.parameters.conversion = "0")
              : this.parameters.conversion;
            var data = {
              amountBegin: this.parameters.minimumAmount,
              amountEnd: this.parameters.highestAmount,
              createdAtBegin: this.parameters.dateStart || "",
              createdAtEnd: this.parameters.dateEnd || "",
              currentPage: this.pageNum,
              memberId: this.$server.getUser().user_id,
              orderNo: this.parameters.val || "",
              pageSize: 15,
              status: this.parameters.conversion || "",
            };
            this.$api.appOnlinePayRecordsList(
              data,
              (err, res) => {
                if (res && res.content) {
                  this.totalRecords = res.totalRecords;
                  if (res.totalRecords > 0) {
                    this.topupTrue = true;
                    res.content.map((item) => {
                      item.createdAt = this.conversionTime(item.createdAt);
                      item.rebateAmount = this.$common.setNumFixed(
                        item.amount,
                        2
                      );
                      if (item.type === 41) {
                        switch (item.status) {
                          case 0:
                            item.name = this.$t('未处理');
                            break;
                          case 1:
                          case 5:
                          case 6:
                          case 7:
                            item.name = this.$t('处理中');
                            break;
                          case 2:
                            item.name = this.$t('出款成功');
                            break;
                          case 3:
                            item.name = this.$t('出款失败');
                            break;
                          case 4:
                            item.name = this.$t('关闭');
                            break;
                        }
                      } else {
                        if (item.status === 2) {
                          item.name = this.$t('已支付');
                        } else {
                          item.name = this.$t('未支付');
                        }
                      }

                      switch (item.type) {
                        case 4:
                          item.payment = this.$t('线下二维码支付');
                          break;
                        case 5:
                          item.payment = this.$t('线上支付');
                          break;
                        case 11:
                          item.payment = this.$t('手动上分');
                          break;
                        case 41:
                          item.payment = this.$t('数值货币支付');
                          break;
                      }
                    });

                    if (this.pageNum == 1) {
                      this.topup = res.content;
                    } else {
                      res.content.map((item) => {
                        this.topup.push(item);
                      });
                    }
                    if (this.totalRecords <= this.topup.length) {
                      this.DoNotLoad.one = false;
                      this.DoNotLoad.two = true;
                    } else {
                      this.DoNotLoad.one = true;
                      this.DoNotLoad.two = true;
                    }
                  } else {
                    if (this.pageNum == 1) {
                      this.DoNotLoad.one = false;
                      this.DoNotLoad.two = false;
                      this.topupTrue = false;
                    } else {
                      this.topupTrue = true;
                    }
                  }
                } else {
                  this.DoNotLoad.one = false;
                  this.DoNotLoad.two = false;
                  this.topupTrue = false;
                }
              },
              true
            );
          } else if (isTrue == 1) {
            var data = {
              amountBegin: this.parameters.minimumAmount,
              amountEnd: this.parameters.highestAmount,
              createdAtBegin: this.parameters.dateStart || "",
              createdAtEnd: this.parameters.dateEnd || "",
              currentPage: this.pageNum,
              memberId: this.$server.getUser().user_id,
              orderNo: this.parameters.val || "",
              pageSize: 15,
              status: this.parameters.conversion || "",
            };
            this.$api.appOfflineRecordsList(
              data,
              (err, res) => {
                if (res) {
                  this.totalRecords = res.totalRecords;
                  if (res.totalRecords > 0) {
                    this.topupTrue = true;
                    res.content.map((item) => {
                      item.createdAt = this.conversionTime(item.createdAt);
                      item.rebateAmount = this.$common.setNumFixed(
                        item.amount,
                        2
                      );
                      if (item.status === 2) {
                        item.name = this.$t('审核通过');
                      } else if (item.status === 0) {
                        item.name = this.$t('未处理');
                      } else {
                        item.name = this.$t('审核未通过');
                      }
                    });
                    if (this.pageNum == 1) {
                      this.topup = res.content;
                    } else {
                      res.content.map((item) => {
                        this.topup.push(item);
                      });
                    }
                    if (this.totalRecords <= this.topup.length) {
                      this.DoNotLoad.one = false;
                      this.DoNotLoad.two = true;
                    } else {
                      this.DoNotLoad.one = true;
                      this.DoNotLoad.two = true;
                    }
                  } else {
                    if (this.pageNum == 1) {
                      this.DoNotLoad.one = false;
                      this.DoNotLoad.two = false;
                      this.topupTrue = false;
                    } else {
                      this.topupTrue = true;
                    }
                  }
                } else {
                  this.DoNotLoad.one = false;
                  this.DoNotLoad.two = false;
                  this.topupTrue = false;
                }
              },
              true
            );
          } else {
            var data = {
              memberId: this.$server.getUser().user_id,
              currentPage: this.pageNum,
              pageSize: 15,
              amountBegin: this.parameters.minimumAmount,
              amountEnd: this.parameters.highestAmount,
              createdAtBegin: this.parameters.dateStart || "",
              createdAtEnd: this.parameters.dateEnd || "",
            };
            this.$api.appDigitPayRecordsList(
              data,
              (err, res) => {
                if (res) {
                  this.totalRecords = res.totalRecords;
                  if (res.totalRecords > 0) {
                    this.topupTrue = true;
                    res.content.map((item) => {
                      item.rebateAmount = this.$common.setNumFixed(
                        item.amount,
                        2
                      );
                      item.createdAt = this.conversionTime(item.createdAt);
                      switch (item.status) {
                        case 3:
                        case 4:
                          item.name = this.$t('出款失败');
                          break;
                        case 0:
                        case 1:
                          item.name = this.$t('处理中');
                          break;
                        case 2:
                          item.name = this.$t('成功');
                          break;
                      }
                    });
                    if (this.pageNum == 1) {
                      this.topup = res.content;
                    } else {
                      res.content.map((item) => {
                        this.topup.push(item);
                      });
                    }
                    if (this.totalRecords <= this.topup.length) {
                      this.DoNotLoad.one = false;
                      this.DoNotLoad.two = true;
                    } else {
                      this.DoNotLoad.one = true;
                      this.DoNotLoad.two = true;
                    }
                  } else {
                    if (this.pageNum == 1) {
                      this.DoNotLoad.one = false;
                      this.DoNotLoad.two = false;
                      this.topupTrue = false;
                    } else {
                      this.topupTrue = true;
                    }
                  }
                } else {
                  this.DoNotLoad.one = false;
                  this.DoNotLoad.two = false;
                  this.topupTrue = false;
                }
              },
              true
            );
          }
          break;
        case "4":
          // 提现列表进入
          var data = {
            memberId: this.$server.getUser().user_id,
            currentPage: this.pageNum,
            pageSize: 15,
            createdAtBegin: this.parameters.dateStart || "",
            createdAtEnd: this.parameters.dateEnd || "",
            amountBegin: this.parameters.minimumAmount,
            amountEnd: this.parameters.highestAmount,
            orderNo: this.parameters.val || "",
            status: this.parameters.conversion || "",
          };
          this.$api.appWithdrawRecordsList(
            data,
            (err, res) => {
              if (res) {
                this.totalRecords = res.totalRecords;
                if (res.totalRecords > 0) {
                  this.topupTrue = true;
                  res.content.map((item) => {
                    item.rebateAmount = this.$common.setNumFixed(
                      item.amount,
                      2
                    );
                    item.createdAt = this.conversionTime(item.createdAt);
                    if (item.type === 43) {
                      switch (item.status) {
                        case 0:
                          item.name = this.$t('未处理');
                          break;
                        case 1:
                        case 5:
                        case 6:
                        case 7:
                          item.name = this.$t('处理中');
                          break;
                        case 2:
                          item.name = this.$t('出款成功');
                          break;
                        case 3:
                          item.name = this.$t('出款失败');
                          break;
                        case 4:
                          item.name = this.$t('关闭');
                          break;
                      }
                    } else {
                      switch (item.status) {
                        case 0:
                        case 1:
                          item.name = this.$t('未处理');
                          break;
                        case 2:
                          item.name = this.$t('出款成功');
                          break;
                        case 3:
                        case 4:
                          item.name = this.$t('出款失败');
                          break;
                      }
                    }
                    switch (item.type) {
                      case 8:
                        item.payment = this.$t('提款申请');
                        break;
                      case 10:
                        item.payment = this.$t('手动下分');
                        break;
                      case 43:
                        item.payment = this.$t('数值货币提款申请');
                        break;
                    }
                  });
                  if (this.pageNum == 1) {
                    this.topup = res.content;
                  } else {
                    res.content.map((item) => {
                      this.topup.push(item);
                    });
                  }
                  if (this.totalRecords <= this.topup.length) {
                    this.DoNotLoad.one = false;
                    this.DoNotLoad.two = true;
                  } else {
                    this.DoNotLoad.one = true;
                    this.DoNotLoad.two = true;
                  }
                } else {
                  if (this.pageNum == 1) {
                    this.DoNotLoad.one = false;
                    this.DoNotLoad.two = false;
                    this.topupTrue = false;
                  } else {
                    this.topupTrue = true;
                  }
                }
              } else {
                this.DoNotLoad.one = false;
                this.DoNotLoad.two = false;
                this.topupTrue = false;
              }
            },
            true
          );
          break;
        case "5":
          // 返水记录列表
          var data = {
            memberId: this.$server.getUser().user_id,
            currentPage: this.pageNum,
            pageSize: 15,
            type: this.parameters.conversion || "",
            startTime: this.parameters.dateStart || "",
            endTime: this.parameters.dateEnd || "",
            moneyMax: this.parameters.highestAmount,
            moneyMin: this.parameters.minimumAmount,
          };
          this.$api.queryRebatesList(
            data,
            (err, res) => {
              if (res) {
                this.totalRecords = res.total;
                if (res.list.length > 0) {
                  this.topupTrue = true;
                  res.list.map((item) => {
                    item.createdAt = this.conversionTime(item.createdAt);
                    item.name = item.typeName;
                    item.rebateAmount = this.$common.setNumFixed(
                      item.rebateAmount,
                      2
                    );
                  });
                  if (this.pageNum == 1) {
                    this.topup = res.list;
                  } else {
                    res.list.map((item) => {
                      this.topup.push(item);
                    });
                  }
                  if (this.totalRecords <= this.topup.length) {
                    this.DoNotLoad.one = false;
                    this.DoNotLoad.two = true;
                  } else {
                    this.DoNotLoad.one = true;
                    this.DoNotLoad.two = true;
                  }
                } else {
                  if (this.pageNum == 1) {
                    this.DoNotLoad.one = false;
                    this.DoNotLoad.two = false;
                    this.topupTrue = false;
                  } else {
                    this.topupTrue = true;
                  }
                }
              } else {
                this.DoNotLoad.one = false;
                this.DoNotLoad.two = false;
                this.topupTrue = false;
              }
            },
            true
          );
          break;
        case "10":
          // 其它记录列表
          var data = {
            currentPage: this.pageNum,
            pageSize: 15,
            createdAtStart: this.parameters.dateStart || "",
            createdAtEnd: this.parameters.dateEnd || "",
            amountMax: this.parameters.highestAmount,
            amountMin: this.parameters.minimumAmount,
          };
          this.$api.getList(
            data,
            (err, res) => {
              if (res) {
                this.totalRecords = res.totalRecords;
                if (res.totalRecords > 0) {
                  this.topupTrue = true;
                  res.content.map((item) => {
                    item.createdAt = this.conversionTime(item.createdAt);
                    item.rebateAmount = this.$common.setNumFixed(
                      item.amount,
                      2
                    );
                    if (item.type === 42) {
                      switch (item.status) {
                        case 0:
                          item.name = this.$t('未处理');
                          break;
                        case 1:
                        case 5:
                        case 6:
                        case 7:
                          item.name = this.$t('处理中');
                          break;
                        case 2:
                          item.name = this.$t('出款成功');
                          break;
                        case 3:
                          item.name = this.$t('出款失败');
                          break;
                        case 4:
                          item.name = this.$t('关闭');
                          break;
                      }
                    } else {
                      switch (item.status) {
                        case 0:
                          item.name = this.$t('待领取');
                          break;
                        case 1:
                          item.name = this.$t('已过期');
                          break;
                        case 2:
                          item.name = this.$t('成功');
                          break;
                        case 3:
                          item.name = this.$t('失败');
                          break;
                      }
                    }
                    switch (item.type) {
                      case 6:
                        item.payment = this.$t('线下入款优惠');
                        break;
                      case 7:
                        item.payment = this.$t('线上入款优惠');
                        break;
                      case 11:
                        item.payment = this.$t('手动上分');
                        break;
                      case 12:
                        item.payment = this.$t('手动存款优惠上分');
                        break;
                      case 13:
                        item.payment = this.$t("手动返水优惠上分");
                        break;
                      case 14:
                        item.payment = this.$t("手动活动优惠上分");
                        break;
                      case 15:
                        item.payment = this.$t('自动活动优惠上分');
                        break;
                      case 20:
                        item.payment = this.$t('手动下分-存款');
                        break;
                      case 21:
                        item.payment = this.$t('手动下分-优惠活动');
                        break;
                      case 22:
                        item.payment = this.$t('手动下分-人工存款反水');
                        break;
                      case 23:
                        item.payment = this.$t('手动下分-存款优惠');
                        break;
                      case 25:
                        item.payment = this.$t('手动上分-优惠活动');
                        break;
                      case 26:
                        item.payment = this.$t('手动上分-人工存款返水');
                        break;
                      case 27:
                        item.payment = this.$t('手动上分-存款优惠');
                        break;
                      case 28:
                        item.payment = this.$t('手动上分-其他');
                        break;
                      case 31:
                        item.payment = this.$t('手动上分彩金');
                        break;
                      case 32:
                        item.payment = this.$t('活动上分彩金');
                        break;
                      case 33:
                        item.payment = this.$t('手动上分彩金-人工存款返水');
                        break;
                      case 34:
                        item.payment = this.$t('手动上分彩金-存款优惠');
                        break;
                      case 35:
                        item.payment = this.$t('手动上分彩金-优惠活动');
                        break;
                      case 36:
                        item.payment = this.$t('手动上分-其他彩金');
                        break;
                      case 42:
                        item.payment = this.$t('数值货币优惠上分');
                        break;
                      case 44:
                        item.payment = this.$t('救济金上分');
                        break;
                      case 45:
                        item.payment = this.$t('救济金彩金');
                        break;
                      case 46:
                        item.payment = this.$t('每日签到上分');
                        break;
                      case 50:
                        item.payment = this.$t('全民返利');
                        break;
                      case 51:
                        item.payment = this.$t('利息宝存入');
                        break;
                      case 52:
                        item.payment = this.$t('利息宝本金提取');
                        break;
                      case 53:
                        item.payment = this.$t('利息宝利息提取');
                        break;
                      case 99:
                        item.payment = this.$t('其他');
                        break;
                    }
                  });
                  if (this.pageNum == 1) {
                    this.topup = res.content;
                  } else {
                    res.content.map((item) => {
                      this.topup.push(item);
                    });
                  }
                  if (this.totalRecords <= this.topup.length) {
                    this.DoNotLoad.one = false;
                    this.DoNotLoad.two = true;
                  } else {
                    this.DoNotLoad.one = true;
                    this.DoNotLoad.two = true;
                  }
                } else {
                  if (this.pageNum == 1) {
                    this.DoNotLoad.one = false;
                    this.DoNotLoad.two = false;
                    this.topupTrue = false;
                  } else {
                    this.topupTrue = true;
                  }
                }
              } else {
                this.DoNotLoad.one = false;
                this.DoNotLoad.two = false;
                this.topupTrue = false;
              }
            },
            true
          );
          break;
      }
    },
    navigate(url) {
      uni.navigateTo({
        // 已支付已处理或未支付未处理传不同的id展示不同组件内容
        url: url,
      });
    },
    detailsJump(item) {
      switch (this.id) {
        case "1": {
          this.navigate(
            "../../pages/Details/GameDetails/GameDetails?id=" + item.betNo
          );
          break;
        }
        case "2": {
          this.navigate("../../pages/actDetail/actDetail?actId=" + item.id);
          break;
        }
        case "3":
        case "3.1": {
          var topupOrTransfer = {
            detailsIds: item.id,
            record: this.record,
          };
          uni.navigateTo({
            url: `../../pages/detailRecords/detailRecords?topupOrTransfer=${JSON.stringify(
              topupOrTransfer
            )}`,
          });
          break;
        }
        case "3.2": {
          this.navigate(
            "../../pages/Details/monetaryDetails/monetaryDetails?currency=" +
              item.id
          );
          break;
        }
        case "4": {
          this.navigate(
            "../../pages/Details/showDetails/showDetails?id=" + item.id
          );
          break;
        }
        case "5": {
          this.navigate(
            "../../pages/BackwaterRecord/BackwaterRecord?betNo=" + item.betNo
          );
          break;
        }
        case "10": {
          this.navigate(
            "../../pages/Details/otherDetails/otherDetails?data=" +
              JSON.stringify(item)
          );
          break;
        }
      }
    },
  },
  onLoad() {
    this.refresh();
  },
};
</script>

<style>
@import url("./record.css");

.page {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
