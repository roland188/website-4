<template>
  <view class="PersonInfo">
    <uni-nav-bar left-icon="back" :title="$t('收货地址')" @clickLeft="goBack"></uni-nav-bar>
    <view class="hdq-vant-form">
      <view class="hdq-vant-main">
        <view class="hdq-vant-row">
          <view class="hdq-vant-label">{{$t('收货人')}}</view>
          <input type="text" v-model="recipient" class="hdq-vant-input" :placeholder="$t('收货人姓名')" placeholder-class="plac">
        </view>
        <view class="hdq-vant-row">
          <view class="hdq-vant-label">{{$t('手机号码')}}</view>
          <input type="text" v-model="phoneNumber" maxlength="11" class="hdq-vant-input" :placeholder="$t('收货人电话')" placeholder-class="plac">
        </view>
        <view class="hdq-vant-row">
          <view class="hdq-vant-label">{{$t('所在地区')}}</view>
          <view @tap="handleInput" class="hdq-vant-area-base" :class="{'hdq-vant-area': !address}">{{address ? address : $t('请选择所在地区')}}
            <img width="16" height="16" src="../../static/image/pointsMall/arrow.png" alt="">
          </view>
        </view>
        <view class="hdq-vant-row">
          <view class="hdq-vant-label">{{$t('详细地址')}}</view>
          <input type="text" v-model="remark" class="hdq-vant-input" :placeholder="$t('请输入详细地址')" placeholder-class="plac">
        </view>
      </view>
      <view class="hdq-vant-row hdq-vant-default"  @click="handleChange">
        <img v-if="!status" width="14" height="14" src="../../static/image/pointsMall/uncheck.png" alt="">
        <img v-if="status" width="14" height="14" src="../../static/image/pointsMall/check.png" alt="">
        <view class="hdq-vant-label-swich">{{$t('设为默认地址')}}</view>
        <!--				<switch style="transform:scale(0.8)" :checked="status" @change="handleChange"/>-->
      </view>
    </view>
    <view style="margin: 16px;">
      <view class="save" @click="onSave">{{$t('保存')}}</view>
      <view class="delete" @click="onDelete" v-if="addressInfo && addressInfo.id">{{$t('删除')}}</view>
    </view>
    <w-picker
        mode="region"
        :visible.sync="showArea"
        :value="address"
        itemHeight="60px"
        themeColor='#EA5F13'
        @confirm="onConfirm($event,'linkage')"
    >
    </w-picker>
  </view>
</template>
<script>
// import { Toast  } from 'vant';
import Toast from './tost';
var areaList = require('./area.js')
import { mapGetters } from 'vuex'
import mailStore from './store'

export default {
  data(){
    return{
      headerTitle: this.$t('收货地址'),
      address:'',
      recipient:'',
      phoneNumber:'',
      remark:'',
      status:false,  //0:非默认，1:默认
      showArea: false,
      areaList,
      searchResult: [],
      placeholderTetx:[],
      addressInfo:{},
    }
  },
  onLoad(option){
    this.placeholderTetx = [this.$t('请选择'),this.$t('请选择'),this.$t('请选择')]
    // this.addressInfo = this.getMallEditItem();
    this.addressInfo = mailStore.state.editItem;
    // if(Object.keys(this.getMallEditItem()).length == 0 && option.index){
    if(Object.keys(mailStore.state.editItem).length == 0 && option.index){
      this.addressList(option.index)
    } else {
      // this.recipient = this.addressInfo.recipient;
      // this.phoneNumber = this.addressInfo.phoneNumber;
      // this.address = this.addressInfo.address;
      // this.remark = this.addressInfo.remark;
      // this.status = this.addressInfo.status == 1 ? true : false;  //0:非默认，1:默认
      //   this.recipient = this.addressInfo.name;
      //   this.phoneNumber = this.addressInfo.phone;
      //   this.address = `${this.addressInfo.province}/${this.addressInfo.city}/${this.addressInfo.area}`;
      //   this.remark = this.addressInfo.remark;
      //   this.status = this.addressInfo.status == 1 ? true : false;  //0:非默认，1:默认
    }
  },
  methods: {
    ...mapGetters(['getMallEditItem']),
    // 返回
    goBack () {
      uni.navigateBacks();
      // this.$pageBack.pageBack()
      // uni.navigateBack({
      //      delta: 1
      // })
    },
    // 开关控制
    handleChange(e){
      // this.status = e.target.value ? 1 : 0
      this.status = this.status ? 0 : 1
      console.log(this.status)
    },
    onConfirm(res) {
      console.log(res,"ddd")
      if(Object.keys(res.obj).length!==0){
        let {province,city,area} = res.obj
        this.address = `${province.label}/${city.label}/${area.label}`
      }
      // this.address = values.filter((item) => !!item).map((item) => item.name).join('/');
      // console.log(this.address)
      // this.showArea = false;
    },
    //保存地址
    onSave() {
      let reg = /^1[3|4|5|7|8][0-9]\d{8}$/; //验证规则
      let flag = reg.test(this.phoneNumber);
      if(!this.recipient){
        Toast(this.$t('请输入收货人姓名'));
        return;
      }else if(!this.phoneNumber || !flag){
        Toast(this.$t('请正确输入收货人电话'));
        return;
      } else if (!/^1[3456789]\d{9}$/g.test(this.phoneNumber)) {
        Toast(this.$t('手机输入格式有误'));
        return;
      } else if(!this.address){
        Toast(this.$t('请输入收货人地址'));
        return;
      }else{
        const place = this.address.split('/')
        let  params= {
          "codePrefix": '86',
          "phone": this.phoneNumber,
          "name": this.recipient,
          "province": place[0],
          "city": place[1],
          "area": place[2],
          "address":  this.remark,
          "status": this.status ? 1 : 0 ,  //0:非默认，1:默认
        };
        this.$api.addAddress(params, (err, res) => {
          if (err) return
          Toast(this.addressInfo.id ? this.$t('地址更新成功') : this.$t('地址添加成功'));
          setTimeout(()=>{
            uni.navigateBacks();
          },500)
        })
      }

    },
    //删除地址
    onDelete() {
      uni.showModal({
        title: this.$t('提示'),
        content: this.$t('确认删除该收货信息?'),
        success: (res) => {
          if (res.confirm) {
            this.$api.deleteShoppingExchangeAddress(this.addressInfo.id,(err,res)=>{
              if (res === true) {
                uni.showToast({
                  title: this.$t('删除成功'),
                  icon:'none'
                });
                setTimeout(()=>{
                  uni.navigateBack({
                    delta: 1
                  })
                },500)
              }
            })
          } else if (res.cancel) {
            console.log('您取消了操作')
          }
        }
      });
    },
    handleInput(){
      this.showArea = true
    },
    //获取收货地址列表
    addressList(index) {
      this.$api.shoppingExchangeAddress((err, res) => {
        if (err) return
        let data = res
        this.addressInfo =data[index];
        //初始化表单数据
        this.address = this.addressInfo.address;
        this.recipient = this.addressInfo.recipient;
        this.phoneNumber = this.addressInfo.phoneNumber;
        this.remark = this.addressInfo.remark;
        this.status = this.addressInfo.status == 1 ? true : false;  //0:非默认，1:默认
      })
    }
  },
}
</script>
<style lang='scss'>
   .van-field__control.van-field__control--custom{
           justify-content: flex-end!important;
    }
   .PersonInfo{
     background: #F7F7F7!important;
       .van-field__label{
           color: #000;
       }
       .van-form{
           margin-bottom: 5px;
       }
       overflow-x: hidden;
       width: 100%;
        .van-cell{
            border: none!important;
            margin-top: 0;
            width: 100%!important;
            border-radius: 0!important;
        }
        .van-cell::after{
            border: none!important;
        }
        .van-address-edit__default{
             margin-top: 10px;
        }
        .van-address-edit__fields{
            background-color: #fff;
        }
        .van-button{
            border-radius: 20px;
            width: 100%;
            font-size: 13px;
            height: 35px;
            margin-bottom: 10px;
        }
        .van-button--danger{
            background-color: #ff2a2a;
        }
   }
</style>
<style lang='scss' scoped>
    .PersonInfo{
      background: #ffffff;
      height: 100%;
      padding: 0 5px 45px 0;
    }
	.hdq-vant-row{
		display: flex;
		align-items: center;
		height: 24upx;
		padding: 10px 16px;
		font-size: 14px;
	}
    .hdq-vant-main {
      width: 730upx;
      height: 416upx;
      margin: 10upx 0 0 10upx;
      background-color: #FFF;
      border-radius: 4px;
      &  .hdq-vant-row{
        height: 104upx;
        border-bottom: 1px solid #EEE;;
      }
    }
    .hdq-vant-default {
      width: 170px;
      margin-top: 30upx;
      img {
        display: block;
        margin-right: 10upx;
      }
    }
	.hdq-vant-label{
		width: 100px;
		color: #646566;
		text-align: left;
		word-wrap: break-word;
	}
    .hdq-vant-area-base {
      img {
        position: absolute;
        right: 32px;
      }
    }
    .hdq-vant-area {
      color: #cec9c9;
    }
	.hdq-vant-input{
		flex: 1;
		color: #323233;
		font-size: 13px;
	}
	.hdq-vant-label-swich{
		text-align: left;
		color: #646566;
		margin-right: 60upx;
	}
	.plac{
		color: #cec9c9;
	}
	.save{
		width:100%;
		height: 35px;
		line-height: 35px;
		font-size: 14px;
		text-align: center;
		margin: 0 auto;
		color: #fff;
    border-radius: 4px;
    background: linear-gradient(180deg, #FCD78D 0%, #CCA456 100%);
	}
	.delete{
		width:100%;
		height: 35px;
		line-height: 35px;
		font-size: 14px;
		text-align: center;
		margin: 15px auto;
		border-radius: 4px;
		color: #323233;
		border: 1upx solid #ebedf0;
		background-color: #fff;
	}
</style>
