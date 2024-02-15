<template>
	<view style="height: 100%;overflow: hidden;">
		<view class="bgc">
			<view class="content">
				<view class="chooseTimeTitle">
					<text class="recordTextOne">{{ headerTitle }}</text>
				</view>
				<view class="Time picker GameTime">
					<view @tap="toggleTab" class="phlocation1" :class="{phlocation : !parameters.dateStart}">
						{{ parameters.dateStart ? parameters.dateStart  : $t('开始时间')}}
					</view>
					<!-- <input type="text" v-model="parameters.dateStart" :placeholder="$t('开始时间')" placeholder-class="phlocation" @tap="toggleTab()" /> -->
					<text class="recordTextOne">{{$t('至')}}</text>
					<view @tap="toggleTabs" class="phlocation1" :class="{phlocation : !parameters.dateEnd}">
						{{ parameters.dateEnd ? parameters.dateEnd  : $t('截止时间')}}
					</view>
					<!-- <input type="text" v-model="parameters.dateEnd" :placeholder="$t('截止时间')" placeholder-class="phlocation" @tap="toggleTabs()" /> -->
				</view>
			</view>

			<view class="chooseTime activityTop" v-if="screeingId != 5 && screeingId != 10 && screeingId != 3.2">
				<view class="chooseTimeTitle">
					<text class="recordTextOne">{{ titleTextTwo }}</text>
				</view>
				<view v-if="screeingId == 2 || screeingId == 3 || screeingId == 3.1 || screeingId == 4">
					<input type="text" :placeholder="placeholderTextOne" v-model="parameters.val" placeholder-class="placeholderInput" />
				</view>
				<view v-else class="rightIcon">
					<input type="text" disabled="true" :placeholder="placeholderTextOne" v-model="parameters.val" placeholder-class="placeholderInput" @tap="popup(7)" />
					<i :style="{backgroundImage:'url('+$config.themeImgUrl('pullIcon')+')'}"></i>
				</view>
			</view>

			<view class="chooseTime activityTop" v-if="screeingId != 2  && screeingId != 10 && screeingId != 3.2">
				<view class="chooseTimeTitle">
					<text class="recordTextOne">{{ titleTextThree }}</text>
				</view>
				<view  class="rightIcon">
					<input type="text" disabled="true" :placeholder="placeholderTextTwo" v-model="parameters.value" placeholder-class="placeholderInput" @tap="popup(1)" />
					<i :style="{backgroundImage:'url('+$config.themeImgUrl('pullIcon')+')'}"></i>
				</view>
			</view>

			<view class="chooseTime" v-if="screeingId != 2">
				<view class="chooseTimeTitle">
					<text class="recordTextOne">{{ footerTitle }}</text>
				</view>
				<view class="Time picker">
					<view class="footerTime">
						<i class="amountSymbols">{{ $config.currency }}</i>
						<input type="text" v-model="parameters.minimumAmount" :placeholder="$t('最低金额')" placeholder-class="phlocation" />
					</view>
					<view class="text_zhi">{{  $t('至') }}</view>
					<view class="footerTime">
						<i class="amountSymbols">{{ $config.currency }}</i>
						<input type="text" v-model="parameters.highestAmount" :placeholder="$t('最高金额')" placeholder-class="phlocation"  />
					</view>
				</view>
			</view>
			<view class="buttons">
				<view type="primary" class="buttonLeft btnTextColor btnColor resetBtn" hover-class="none" @click="reset">{{ $t('重置') }}</view>
				<view type="primary" class="buttonRight gameListActive uniqueButton" @click="submit">{{ $t('确定') }}</view>
			</view>
		</view>
		<yu-datetime-picker @confirm="onConfirm" startYear="2010" ref="dateTime" :isAll="true" :current="true"></yu-datetime-picker>
		<pop-Up ref="popup" @sonPassed="sonPassed" :popUpId="screeingId"></pop-Up>
	</view>
</template>

<script>
import popUp from '@/components/popup/popup.vue';
import yuDatetimePicker from '@/components/yu-datetime-picker/yu-datetime-picker.vue';
export default {
	components: {
		yuDatetimePicker,
		popUp
	},
	data() {
		return {
			startOrEnd: '',
			headerTitle: '',
			footerTitle: '',
			placeholderTextOne: '',
			placeholderTextTwo: '',
			titleTextOne: '',
			titleTextTwo: '',
			titleTextThree: '',
			parameters:{
				minimumAmount: '',
				highestAmount: '',
				conversion: '',
				dateStart: '',
				dateEnd: '',
				value:'',
				val:'',
				gamevalue:'',
				gameval:'',
				id:''
			}
		};
	},
	methods: {
		// 重置
		reset() {
			this.parameters.dateStart = '';
			this.parameters.dateEnd = '';
			this.parameters.minimumAmount = '';
			this.parameters.highestAmount = '';
			this.parameters.val = '';
			this.parameters.value = '';
			this.parameters.gameval = '';
			this.parameters.gamevalue = '';
		},
		//子组件传过来的值
		sonPassed(name, id,vendorCode) {
			if (id == 1) {
				this.parameters.value = name
				this.parameters.gamevalue = vendorCode;
				switch(name){
					case this.$t('出款失败'):{
						this.parameters.conversion = -1;
						break;
					};
					case this.$t('未处理'):
					case this.$t('未支付'):{
						this.parameters.conversion = 0;
						break;
					};
					case this.$t('批量返水'):{
						this.parameters.conversion = 17;
						break;
					};
					
					case this.$t('自动通过'):
					case this.$t('处理中'):{
						this.parameters.conversion = 1;
						break;
					};
					case this.$t('实时返水'):{
						this.parameters.conversion = 16;
						break;
					};
					case this.$t('审核通过'):
					case this.$t('出款成功'):
					case this.$t('支付成功'):{
						this.parameters.conversion = 2;
						break;
					};
					case this.$t('关闭'):{
						this.parameters.conversion = 3;
						break;
					};
					case this.$t('审核不通过'):{
						this.parameters.conversion = vendorCode - 0;
						break;
					};
					case this.$t('已留言'):{
						this.parameters.conversion = 4;
						break;
					};
				}
			} else {
				this.parameters.val = name
				this.parameters.gameval = vendorCode;
			}
		},
		//公共弹窗
		popup(id) {
			this.$refs.popup.show(id);
		},
		//开始日期弹窗
		toggleTab(item, index) {
			this.$refs.dateTime.show();
			this.startOrEnd = '1';
		},
		//结束日期弹窗
		toggleTabs(item, index) {
			this.$refs.dateTime.show();
			this.startOrEnd = '2';
		},
		//选择日期
		onConfirm(val) {
			this.startOrEnd==='1'?this.parameters.dateStart = val.selectRes:this.parameters.dateEnd = val.selectRes;
		},
		dateStarts(e) {
			this.parameters.dateStart = e.detail.value;
		},
		dateEnds(e) {
			this.parameters.dateEnd = e.detail.value;
		},
		empty() {
			(this.parameters.dateStart = ''), (this.parameters.dateEnd = '');
		},
		// 提交
		submit() {
			if(this.parameters.dateStart){
				this.parameters.dateStart = `${this.parameters.dateStart} 00:00:00`
			}
			if(this.parameters.dateEnd){
				this.parameters.dateEnd = `${this.parameters.dateEnd} 23:59:59`
			}
			if(this.screeingId == 1){
				// 游戏筛选
				this.parameters.id = '1'
			}else if(this.screeingId == 2){
				// 活动筛选
				this.parameters.id = '2'
			}else if(this.screeingId == 3){
				// 线上充值筛选
				this.parameters.id = '3'
			}else if(this.screeingId == 3.1){
				this.parameters.id = '3.1'
			}else if(this.screeingId == 4){
				// 提现
				this.parameters.id = '4'
			}else if(this.screeingId == 5){
				// 返水
				this.parameters.id = '5'
			}else if(this.screeingId == 10){
				// 返水
				this.parameters.id = '10'
			}
			this.$emit('show',false,'parameter',this.parameters)
			this.reset()
		},
		trigger(){
			switch (this.screeingId) {
				case '1': {
					// 这是游戏筛选
					this.headerTitle = this.$t('投注时间');
					this.titleTextTwo = this.$t('游戏类型');
					this.placeholderTextOne = this.$t('请选择游戏类型');
					this.titleTextThree = this.$t('游戏平台');
					this.placeholderTextTwo = this.$t('请选择游戏平台');
					this.footerTitle = this.$t('投注金额');
					break;
				}
				case '2': {
					// 这是活动记录筛选 
					this.headerTitle = this.$t('活动时间');
					this.titleTextTwo = this.$t('活动名称');
					this.placeholderTextOne = this.$t('请输入活动名称');
					this.titleTextThree = this.$t('活动状态');
					this.placeholderTextTwo =this.$t('请选择活动状态');
					this.footerTitle = this.$t('活动金额');
					break;
				}
				case '3':
				case '3.1':
				case '4': {
					// 这是线上充值记录筛选
					if (this.screeingId == 3) {
						this.headerTitle = this.$t('充值时间');
						this.footerTitle = this.$t('充值金额');
					} else if (this.screeingId == 3.1) {
						this.headerTitle = this.$t('转账时间');
						this.footerTitle = this.$t('转账金额');
					} else {
						this.headerTitle = this.$t('提现时间');
						this.footerTitle = this.$t('提现金额');
					}
					this.titleTextTwo = this.$t('订单号');
					this.placeholderTextOne = this.$t('请输入订单号');
					this.titleTextThree = this.$t('订单状态');
					this.placeholderTextTwo = this.$t('请选择订单状态');
					break;
				}
				case '5': {
					this.headerTitle = this.$t('返水时间');
					this.titleTextThree = this.$t('返水类型');
					this.placeholderTextTwo = this.$t('请选择返水类型');
					this.footerTitle = this.$t('返水金额');
					break;
				}
				case '10': {
					this.headerTitle = this.$t('时间');
					this.footerTitle = this.$t('金额');
					break;
				}
				case '3.2': {
					this.headerTitle = this.$t('充值时间');
					this.footerTitle = this.$t('充值金额');
					break;
				}
			}
		}
	},
	mounted() {
		this.trigger()
	},
	props: ['screeingId']
};
</script>

<style scoped>
@import url('./screening.css');
</style>
