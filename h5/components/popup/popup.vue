<template>
	<view class="yu-datetime-picker">
		<view class="yu-datetime-mask" :class="{ show: showPicker }" @tap="maskClick" @touchmove.stop.prevent catchtouchmove="true"></view>
		<view class="yu-datetime-content" :class="{ show: showPicker }">
			<view class="yu-datetime-hd titleCenter" @touchmove.stop.prevent catchtouchmove="true" style="height: 88rpx;">
				<view class="yu-datetime-btn recordTextOne" @tap="pickerConfirm">{{ $t('确定') }}</view>
				<view class="popupTitle recordTextOne">{{ popupTitle }}</view>
				<view class="shut" @tap="pickerCancel"></view>
			</view>
			<view class="yu-datetime-view topupHeight">
<!-- 				<view class="popup" v-if="isShow && popUpId == 1">
					<text v-for="(item, index) in list" :key="index" @click="choose(item.vendorName, item.vendorCode, 1)" :class="{ itemBgc:selectList.indexOf( item.vendorCode )!=-1 }">{{ item.vendorName }}</text>
					<text style="height: 0;"></text>
				</view> -->
				<view class="popup" v-if="isShow">
					<text class="" v-for="(item, index) in list" :key="index" @click="choose(item.vendorName, item.vendorCode, 1)" :class="{ itemBgc: chooseId == item.vendorCode }">{{ item.vendorName }}</text>
					<text style="height: 0;"></text>
				</view>
				<view class="list" v-else>
					<text class="recordTextOne" v-for="(item, index) in dataList" :key="index" @click="chooseList(item.vendorName, item.vendorCode, 2)" :class="{ itemBgc1: chooseListId == item.vendorCode }">
						{{ item.vendorName }}
					</text>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	name: 'popup',
	props: ['popUpId'],
	data() {
		return {
			id: '',
			value: '',
			isShow: '',
			chooseListId: '',
			chooseId:'',
			popupTitle: '',
			showPicker: false,
			list: [],
			selectList:[],
			selectNameList:[],
			// 活动筛选列表
			activityList: [{ vendorName: this.$t('未处理'), vendorCode: '0' }, { vendorName: this.$t('自动通过'), vendorCode: '1' }, { vendorName: this.$t('审核通过'), vendorCode: '2' }, { vendorName: this.$t('审核不通过'), vendorCode: '3' }, { vendorName: this.$t('已留言'), vendorCode: '5' }],
			// 线上充值筛选列表
			onlineList: [{ vendorName: this.$t('未支付'), vendorCode: '0' }, { vendorName: this.$t('支付中'), vendorCode: '1' },{ vendorName: this.$t('支付成功'), vendorCode: '2' }, { vendorName: this.$t('支付失败'), vendorCode: '3' }],
			// 线上转账筛选列表
			transferList: [{ vendorName: this.$t('未处理'), vendorCode: '1' }, { vendorName: this.$t('审核通过'), vendorCode: '2' }, { vendorName: this.$t('审核不通过'), vendorCode: '-1' }],
			// 提现筛选列表
			withdrawalList: [{ vendorName: this.$t('未处理'), vendorCode: '1' }, { vendorName: this.$t('处理中'), vendorCode: '2' }, { vendorName: this.$t('出款成功'), vendorCode: '3' }, { vendorName: this.$t('出款失败'), vendorCode: '4' }, { vendorName: this.$t('关闭'), vendorCode: '5' }],
			// 返水筛选列表
			
			returnList: [{ vendorName:this.$t('全部'), vendorCode: '1' }, { vendorName: this.$t('批量返水'), vendorCode: '2' }, { vendorName: this.$t('实时返水'), vendorCode: '3' }],
			dataList: [
				{ vendorName: this.$t('电子游艺'), vendorCode: 'ELECTRON' },
				{ vendorName: this.$t('真人视讯'), vendorCode: 'LIVECASINO' },
				{ vendorName: this.$t('体育赛事'), vendorCode: 'SPORTS' }, 
				{ vendorName: this.$t('彩票游戏'), vendorCode: 'LOTTERY' }, 
				{ vendorName: this.$t('棋牌游戏'), vendorCode: 'CHESS' },
				{ vendorName: this.$t('电子竞技'), vendorCode: 'ESPORTS' },
			]
		};
	},
	mounted() {
		switch (this.popUpId) {
			case '1': {
				// 这是游戏筛选
				this.$api.getAllVendorAndKindInfoByapp(
					(err,res) => {
						if (res) {
							this.list = res;
							this.list.unshift({
							  vendorCode: this.$t('捕鱼'),
							  vendorId: 9999,
							  vendorName: this.$t('捕鱼')
							})
						}
					}, 
					true
				);
				break;
			}
			case '2': {
				// 这是活动记录筛选
				this.list = this.activityList;
				break;
			}
			case '3': {
				// 这是线上充值记录筛选
				this.list = this.onlineList;
				break;
			}
			case '3.1': {
				// 这是线上转账记录筛选
				this.list = this.transferList;
				break;
			}
			case '4': {
				//这是提现记录筛选
				this.list = this.withdrawalList;
				break;
			}
			case '5': {
				// 这是返水筛选
				this.list = this.returnList;
				break;
			}
		}
	},
	methods: {
		// 确定
		pickerConfirm() {
			if (this.id === 1) {
				this.$emit('sonPassed', this.value, this.id,this.chooseId);
			} else {
				this.$emit('sonPassed', this.value, this.id,this.chooseListId);
			}
			this.showPicker = false;
		},
		//游戏平台
		choose(name, selectId, id) {
			this.value = name;
			this.chooseId = selectId;
			this.id = id;
		},
		//游戏类型
		chooseList(name, selectId, id) {
			this.value = name;
			this.chooseListId = selectId;
			this.id = id;
		},
		maskClick() {
			//遮罩
			this.showPicker = false;
		},
		show(id) {
			//显示
			if (id == 1) {
				this.isShow = true;
			} else {
				this.isShow = false;
			}
			if (this.popUpId == 1 && id == 1) {
				this.popupTitle = this.$t('选择平台');
			} else if (this.popUpId == 5 || id == 6) {
				this.popupTitle = this.$t('选择类型');
			} else {
				this.popupTitle = this.$t('选择状态');
			}
			this.showPicker = true;
		},
		hide() {
			//隐藏
			this.showPicker = false;
		},
		pickerCancel() {
			//取消
			this.showPicker = false;
		}
	}
};
</script>
<style>
@import url('../yu-datetime-picker/yu-datetime-picker.css');
</style>
