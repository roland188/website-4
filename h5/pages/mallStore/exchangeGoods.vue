<template>
  <view class="exchangeGoodsBXO">
    <uni-nav-bar left-icon="back" :title="$t('积分商城')" @clickLeft="goBack" right-icon="headphones" @clickRight="handleGoServe('/pages/customerService/customerService')"></uni-nav-bar>
    <view class="exchangeGoods">
      <view class="content" v-if="isProInfo">
        <view class="leftClass">
          <image :src="$config.getImgUrl(changeItem.imgUrlApp)" alt="" class="img" />
        </view>
        <view class="rigthClass">
          <view class="title">{{changeItem.name}}</view>
          <view class="tip">{{$t('注：图片颜色仅供参考，具体请以发货颜色为准。')}}</view>
          <view class="price">
            <text>{{$t('单价：')}}</text>
            <text class="money">{{changeItem.amount}}</text>
          </view>
          <view class="num">{{$t('数量：')}}</view>
          <view class="count">
            <!-- <uni-number-box v-model="count" :min="1" :max="changeItem.reserveCount"/> -->
            <view class="count-row">
              <text class="sub" @tap="handleTapSub">-</text>
              <input type="number" v-model="count" class="count-input">
              <text class="sub" @tap="handleTapAdd">+</text>
            </view>
            <text class="maxCla" @tap="setCount">{{$t('最大')}}</text>
          </view>
          <view class="allParce price">
            {{priceTitle}}{{$t('总计：')}}<text class="money">{{totalPrice}}</text>
          </view>
        </view>
      </view>
      <!-- 实用商品显示收货地址信息 -->
      <view v-if="type == 2">
        <view class="hdq-address-row" v-if="list.length > 0">
          <view class="hdq-address-item" @click="handDefaultValue(shop)" v-for="(shop,i) in list" :key="i">
            <view class="hdq-address-col" @click="clickItem(shop,i)">
              <view class="hdq-address-label">
                <uni-icons :type="chosenAddressId===shop.id ? 'checkbox-filled' : 'circle'" size="24" :color="chosenAddressId===shop.id ? '#EA5F13' : '#c8c9cc'"></uni-icons>
              </view>
              <view class="hdq-address-dl">
                <view class="hdq-address-dd"><text style="marginRight: 5px;">{{shop.name}}</text>{{shop.phone}}
                  <text class="hdq-address-default" v-show="shop.status===1">{{$t('默认')}}</text>
                </view>
                <view class="hdq-address-dt">{{shop.province}}{{shop.city}}{{shop.area}}{{shop.address}}</view>
              </view>
            </view>
            <!--						 <view class="hdq-address-edit" @click="(e) => onEdit(e, shop,i)">-->
            <!--							  <uni-icons  type="compose" size="24"></uni-icons>-->
            <!--						 </view>-->
          </view>
        </view>
        <view class="address" @click="onAdd" v-if="!isProInfo && list.length < 6">{{$t('请添加收货地址')}}</view>
        <view class="address" @click="onAdd" v-if="isProInfo && list.length < 2">{{$t('请添加收货地址')}}&nbsp;&nbsp;{{list.length}}/2</view>
      </view>
    </view>
    <view class="hdq-footerBtn">
      <view class="hdq-vant-button cancel" @click="goBack">{{$t('取消')}}</view>
      <view class="hdq-vant-button confirm" @click="submit">{{$t('立即兑换')}}</view>
    </view>
    <view class="prompt" v-show="!isProInfo && promptShow">
      <!-- <img src="../../static/images/xf/gou.png" alt=""> -->
      <view class="prompt-p">{{$t('恭喜您，抽得')}}{{changeItem && changeItem.name}}{{$t('，请及时联系在线客服提供收件人相关信息')}}</view>
    </view>

    <tips :msg="modalData" @childFn="onchildFn"></tips>
  </view>
</template>
<script>
import Toast from './tost';
import mailStore from './store'
import tips from "@/components/tips/tips.vue";

import {
  mapGetters,
  mapState,
  mapMutations
} from 'vuex'
import cache from "../../utils/cache";
export default {
  components: {
    tips
  },
  data() {
    return {
      headerTitle: this.$t("积分商城"),
      window: window,
      count: 1,
      type: 1, //1：虚拟商品  2：实用商品
      isProInfo: false, //true：显示商品信息
      chosenAddressId: '',
      list: [],
      isLabel: false,
      changeItem: {},
      // totalPrice: 0,
      selectItem: {}, //选择地址对象
      promptShow: false,
      successfully: false,
      priceTitle: '',
      name: '',
      max:1,
      currentInfo: {},
      modalData: {
        isShow: false,
        types: 1, //类型是带标题的弹窗、
        content: this.$t('是否设置该地址为默认地址'),
        showCancel: true, //显示取消按钮
        cancelText: this.$t('取消'),
        confirmText: this.$t('确认'),
        success: 200, //100为取消  200为确定
      },
    }
  },
  onLoad(option) {
    this.type = option.type;
    // 数据没有或刷新
    // if (Object.keys(this.getMallChangeItem()).length == 0) { //判断store里的值为空则走以下逻辑
    if (Object.keys(mailStore.state.changeItem).length == 0) { //判断store里的值为空则走以下逻辑
      this.shoppingMallList(option.index)
      this.getMemberPoint()
    } else {
      // this.changeItem = this.getMallChangeItem(); //获取点击项的数据
      this.changeItem = mailStore.state.changeItem; //获取点击项的数据
    }

    if (option.limitCount == 0) { //根据后台数据控制加减数量
      this.count = 1;
    } else {
      // 最小数量
      this.count = option.limitCount;
      // 最大数量
      this.changeItem.reserveCount = option.limitCount * 1;
    }

    this.name = option.name;
    if (option.isProInfo) {
      this.isProInfo = JSON.parse(option.isProInfo);
    }
    if (!this.isProInfo && this.changeItem != {} && this.name === 'index') {
      this.promptShow = true;
      let newQuery = JSON.parse(JSON.stringify(option));
      delete newQuery.name;
      // this.$router.replace({ query: newQuery })
      let query = ''
      for (let k in newQuery) {
        query = k + '=' + newQuery[k] + '&'
      }
      // uni.redirectTo({
      //     url: './exchangeGoods?' + query
      // });
      setTimeout(() => {
        this.promptShow = false;
      }, 3000)
    }

    this.priceTitle = window.currency;
  },
  onShow() {
    this.addressList()
  },
  computed: {
    totalPrice(){
      return this.count * 1 * this.changeItem.amount
    },
    // ...mapState({userRmb:state=>state.mall.userRmb})
    ...mapState({userRmb:state=>mailStore.userRmb})
  },
  onBackPress(){
    // 用户没有填写完不能，不给退出
    if(this.list.length===0 && !this.isProInfo){
      uni.showModal({
        title: this.$t('温馨提示'),
        content: this.$t('请添加收货地址，再离开！'),
        showCancel: false,
        cancelText: this.$t('取消'),
        confirmText: this.$t('确认'),
        confirmColor: "#ee0a24",
        success: function (res) {
          if (res.confirm) {
            console.log("确定")
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        },
      });
      return true
    } else {
      return false
    }
  },
  methods: {
    handleGoServe(url){
      uni.navigateTo({
        url: "/pages/subCustomerService/subCustomerService",
      });
    },
    handleTapSub(){
      if(this.count<=1) return
      this.count--
    },
    handleTapAdd(){
      // this.changeItem.reserveCount // 最大值
      // 设置最大金额
      if(this.changeItem.reserveCount * 1 <= 0){
        Toast(this.$t('商品库存不足，无法兑换'))
        return false;
      }
      if (this.totalPrice > this.userRmb) { //判断用户腾博是否大于兑换商品所需积分
        Toast(this.$t('积分不足！'));
        return false;
      }
      this.count++
    },
    // 返回
    goBack() {
      // this.$pageBack.pageBack()
      uni.navigateBacks();
    },
    // 联系客服
    // goServer() {
    // 	uni.navigateTo({
    // 		url: '../customerService/customerService'
    // 	})
    // },
    //获取商品列表
    shoppingMallList(index) {
      this.$api.shoppingMallList((err, res) => {
        if (err) return
        if (this.type == 1) { //虚拟商品
          this.changeItem = res.virtualMallVOList[index];
        } else { //实用商品数据
          this.changeItem = res.shoppingMallVOList[index];
        }
      })
    },
    //商品确定兑换
    submit() {
      let that = this;
      // 抽奖领取
      if (!that.isProInfo) {
        if (!this.chosenAddressId) {
          Toast(this.$t('请选择或添加收货地址'));
          return;
        }
        that.changeItem.recipientAddress = that.selectItem.address;
        that.changeItem.recipientName = that.selectItem.recipient;
        that.changeItem.recipientPhone = that.selectItem.phoneNumber;
        that.$api.updateLotteryGoodsAddress(that.changeItem, (err, res) => {
          if (err) return
          Toast(this.$t('提交成功！'));
          setTimeout(() => {
            uni.navigateBacks();
            // this.$pageBack.pageBack()
            // uni.navigateBack({
            // 	delta: 1
            // });
          }, 1500)
        })
      } else {
        // 领取实物和虚拟
        if (this.totalPrice > this.userRmb) { //判断用户腾博是否大于兑换商品所需积分
          Toast(this.$t('积分不足！'));
          return false;
        }
        if (this.changeItem.reserveCount * 1 <= 0) { //判断商品库存量
          Toast(this.$t('商品库存不足，无法兑换'))
          return false;
        }
        let params = {};
        if (this.type == 1) { //虚拟商品兑换
          params = {
            "count": this.count,
            "id": this.changeItem.id,
          }
        } else { //实用商品兑换
          if (!this.chosenAddressId) {
            Toast(this.$t('请选择或添加收货地址'));
            return;
          }
          params = {
            "count": this.count,
            "id": this.changeItem.id,
            "address": this.selectItem.address,
            "phoneNumber": this.selectItem.phoneNumber,
            "recipient": this.selectItem.recipient,
            "remark": this.selectItem.remark
          }
        }
        this.$api.exchangeMall(params, (err, res) => {
          if (err) return
          // if(res){
          Toast(this.$t('商品兑换成功'));
          this.getMemberPoint()
          setTimeout(()=>{
            uni.navigateBacks();
            // this.$pageBack.pageBack()
          },3000)

          // uni.navigateBack({
          // 	delta: 1
          // });
          // }
        })
      }

    },
    //剩余币
    getMemberPoint(){
      this.$api.getMallMemberPoint((err, res) => {
        if (err) return
        this.updateMallUserRmb(res.balance)
      })
    },
    //新增地址
    onAdd(item) {
      mailStore.commit('setEditItem', {})
      uni.navigateTo({
        url: './PersonInfo'
      })
    },
    //编辑地址
    onEdit(e, item, index) {
      e.stopPropagation()
      mailStore.commit('setEditItem', item)
      uni.navigateTo({
        url: './PersonInfo?index=' + index
      })
    },
    //点击某项地址时
    clickItem(val) {
      this.selectItem = val;
      this.chosenAddressId = val.id
      console.log(val)
    },
    // 点击设置默认值
    handDefaultValue(item) {
      if (item.status === 1) return
      this.modalData.isShow = true;
      this.currentInfo = item
    },
    onchildFn(e) {
      if (e === 200) {
        this.currentInfo.status = 1
        this.$api.updateAddressStatus({id: this.currentInfo.id}, (err, res) => {
          if (err) return
          this.modalData.isShow = false;
          this.addressList()
        })
      } else {
        this.modalData.isShow = false;
      }},
    //点击最大数量
    setCount() {
      // 设置最大金额
      if(this.changeItem.reserveCount * 1 <= 0){
        Toast(this.$t('商品库存不足，无法兑换'))
        return;
      }
      if (this.totalPrice > this.userRmb) { //判断用户腾博是否大于兑换商品所需积分
        Toast(this.$t('积分不足！'));
        return false;
      }
      console.log(this.changeItem,"this.changeItem")
      this.count = this.changeItem.reserveCount;
    },
    //获取收货地址列表
    addressList() {
      this.list = [];
      this.$api.getUserInfo(cache.get("set_user").user_id, (err, res) => {
        if (err) return
        this.list = res.addressList
        if(this.list.length > 0){
          let flag = this.list.some(item=>item.status===1)
          if(flag){
            let arr = this.list.filter(items=>items.status ===1)
            this.selectItem = arr[0]
            this.chosenAddressId = arr.length > 0 ? arr[0].id : ''
          }
        }
      })
    },
    ...mapGetters(['getMallChangeItem']),
    ...mapMutations(['updateMallUserRmb'])
  },

}
</script>
<style lang="scss">
	.exchangeGoodsBXO {
		.van-stepper__input {
			width: 5px;
			background-color: #fff;
			border: 1px solid #eae8e8;
		}

		.van-stepper {
			display: inline-block;
		}

		.van-address-list__bottom {
			display: none;
		}

		.van-cell {
			margin-top: 0;
			border: none;
		}

		.van-address-list {
			height: auto;
			padding: 0;
			margin-top: 1px;
		}

		.van-tag--danger,
		.van-button--danger {
			background-color: #ff2a2a;
		}

		.van-radio__icon--checked .van-icon {
			background-color: #ff2a2a;
			border-color: #ff2a2a;
		}

		.van-button {
			width: 80px;
			height: 30px;
			font-size: 12px;
			border-radius: 5px;
			margin-left: 10px;
		}
	}
</style>
<style lang="scss" scoped>
	.exchangeGoodsBXO {
		position: relative;
		overflow-x: hidden;
		width: 100%;
		background: #f7f7f7;
		height: 100%;
		.exchangeGoods {
			padding: 10upx 5px;
			// margin-top: 10upx;

			.content {
				background-color: #fff;
				padding: 5px;
				box-sizing: border-box;
				width: 100%;
				border-radius: 5px;
				display: flex;

				.leftClass {
					width: 120px;

					.img {
						width: 100px;
						height: 100px;
					}
				}

				.rigthClass {
					flex: 1;

					p {
						margin: 0;
					}

					.title {
						line-height: 35px;
						font-size: 13px;
						color: #333;
					}

					.tip {
						color: #ff2a2a;
						font-size: 12px;
					}

					.price {
						color: #999;
						font-size: 12px;
						line-height: 35px;

						.money {
							color: #CCA456;
            ;
						}
					}

					.allParce {
						font-size: 12.5px;
					}

					.num {
						color: #999;
						margin-bottom: 5px;
						font-size: 13px;
					}

					.count {
						display: flex;
						align-items: center;
					}

					.maxCla {
						margin-left: 15px;
						font-size: 12px;
					}
				}

			}

			.address {
				height: 52px;
				font-size: 14px;
				background: #fff;
				border-radius: 5px;
				margin-top: 10px;
				text-align: center;
				line-height: 52px;
				border: 1px dashed #CCA456;
			}
		}

		.footerBtn {
			padding: 20px 0;
			box-sizing: border-box;
			text-align: center;
			position: fixed;
			bottom: 0;

			background-color: #fff;
			width: 100%;
			z-index: 2;
		}

		.prompt {
			width: 400upx;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			background: rgba(0, 0, 0, 0.7);
			border-radius: 10px;
			z-index: 3;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 10px 0;
			box-sizing: border-box;

			img {
				width: 30px;
				height: 30px;
				padding: 10px;
			}

			.prompt-p {
				font-size: 14px;
				color: #ffffff;
				text-align: center;
				padding: 10px 15px;
				box-sizing: border-box;
				margin: 0;
				line-height: 1.5;
			}
		}
	}
	.count-input{
		width:90upx;
		text-align: center;
	}
	.sub{
		width: 60upx;
		height: 100%;
		text-align: center;
		background-color: #f8f8f8;
		border-top-left-radius: 3px;
		border-bottom-left-radius: 3px;
	}
	.count-row{
		display: flex;
		align-items: center;
		height: 60upx;
		border: 1upx solid #ddd;
	}
	.hdq-address-row{
		margin-top: 10upx;
		background-color: #fff;
	}
	.hdq-address-item{
		display: flex;
		padding: 12px;
		margin-bottom: 12px;
		align-items: center;
	}

	.hdq-footerBtn {
		padding: 20px 0;
		box-sizing: border-box;
		text-align: center;
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: center;
		background-color: #fff;
		width: 100%;
		z-index: 2;
	}
	.hdq-address-label{
		margin-right: 12px;
	}
	.hdq-address-round{
		box-sizing: border-box;
		border-radius: 100%;
		width: 1.25em;
		height: 1.25em;
		color: transparent;
		font-size: .8em;
		line-height: 1.25;
		text-align: center;
		border: 1px solid #c8c9cc;
		transition-duration: .2s;
		transition-property: color,border-color,background-color;
	}
	.hdq-address-check{
		width: 1.25em;
		height: 1.25em;
	}
	.hdq-address-col{
		display: flex;
		align-items: center;
		flex: 1;
	}
	.hdq-address-dl{
		flex: 1;
		color: #323233;
		/* line-height: 20px */
	}
	.hdq-address-default{
		padding: 3px 10upx;
		//background-color: #EA5F13;
		//border-radius: 20px;
		font-size: 12px;
		//color: #fff;
		//margin-left: 10px;
		vertical-align: text-top;
    color:  #CCA456;
    border-radius: 4px;
    padding: 2px 6px;
    width: 24px;
    height: 17px;
    border: 1px solid #CCA456;
		/* margin-top: 10px; */
	}
	.hdq-address-dd{
		font-size: 18px;
		margin-bottom: 14upx;
		/* line-height: 30upx; */
	}
	.hdq-address-dt{
		font-size: 14px;
		color: #5b5b5d;
		/* line-height: 20upx; */
	}
	.hdq-address-edit{
		width: 120upx;
		text-align: right;
		margin-right: 10px;
	}
	.hdq-vant-button {
		width: 80px;
		height: 30px;
		line-height: 30px;
		font-size: 12px;
		border-radius: 5px;
		margin: 0 20upx;
	}

	.cancel {
		color: #323233;
		background-color: #fff;
		border: 1px solid #ebedf0;
	}

	.confirm {
		margin-left: 10upx;
		color: #fff;
    border-radius: 4px;
    background: linear-gradient(180deg, #FCD78D 0%, #CCA456 100%);
	}
</style>
