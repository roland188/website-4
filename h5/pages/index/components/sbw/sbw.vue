<template>
	<view class="line-chart">
		<!-- <view v-if="isShowBar">
			<drag @btnClick="handleShowOpen" existTabBar >
				<view slot="center" class="mar-bot20">
					<canvas class="chart" canvas-id="boll" id="boll" ></canvas>
				</view>
			</drag>
		</view> -->
		<view v-if="isShowBar">
			<drag @btnClick="handleShowOpen" existTabBar >
				<view slot="center" class="position-sbw">
					<image src="./img/swb.gif" v-if="percentComplete > 0" mode="widthFix"></image>
					<image src="./img/swb.png" v-else mode="widthFix"></image>
					<view class="sbw-text">
						<text class="sbw-b-b">{{percentComplete}}%</text>
						<view class="sbw-text-y">{{ $t('领取{x}元',{x: rewardAmount})}}</view>
					</view>
				</view>
			</drag>
		</view>
		<uni-popup ref="popup1" type="center" :zIndex="9999">
			<view class="step" v-if="!receivedSuccess">
				<view class="step-header">
					<view class="img-box">
						<image v-show="showDetail" @click="handleBackStep" class="img" src="./img/ff_back.png" alt=""></image>
					</view>
					<view class="text">{{showDetail ?  $t('任务详情') : $t('高登棋牌助力金')}}</view>
					<view class="img-box">
						<image class="img" v-show="!showDetail" @click="handleClose" src="./img/ff_close.png" alt=""></image>
					</view>
				</view>
				<scroll-view scroll-y="true"  class="step-list" v-if="!showDetail">
					<view class="step-item" v-for="(award,index) in totalAward" :key="award.award + index">
						<step :percentage="award.percentage" :stepText="award.percentageText" @handleSetp="()=>handleSetp(award.status,award)">
							<view slot="right" class="btn" :class="{'btn-active' : award.status == 0}" @click="handleSetp(award.status,award)">
								{{award.status === 0 ? $t('领取') : $t('详情')}}
							</view>
						</step>
					</view>
				</scroll-view>
				<!-- 详情 -->
				<scroll-view scroll-y="true" class="img-list" v-if="showDetail">
					<view v-html="intro"></view>
				</scroll-view>
			</view>
			<!-- 成功弹窗修改 -->
			<view class="received" v-if="receivedSuccess">
				<view class="close">
					<image class="img" @click="handleClose" src="./img/ff_close.png" mode=""></image>
				</view>
				<image class="img-success" src="./img/success.png" mode=""></image>
				<view class="text-success">
					{{$t('领取成功')}}
				</view>
				<text class="click-me">{{$t('点击我的-钱包查看')}}</text>
				<view class="btn btn-active btn-auto" @click="handleClose">{{$t('我知道了')}}</view>
			</view>
		</uni-popup>
	<!-- 	<uni-popup ref="popup2" type="center" :zIndex="99999">
			
		</uni-popup> -->
	</view>
</template>

<script>
	import drag from './drag.vue'
	import step from './step.vue'
	export default{
		components:{
			drag,
			step
		},
		data(){
			return{
				bollStep: null,
				bollTimeR: null,
				first: 1,
				receivedSuccess: false, //  显示领取成功页面
				showDetail: false,  //  显示详情
				stepText: this.$t('完成'),
				status: 1,  //未完成 
				list:[],
				index: 0,
				percentComplete: 0,  // 进度条
				rewardAmount: 0,  // 领取总金额
				intro: '' ,  // 富文本
				totalAward: [],
				thematicActivitiesId: '',
				isShowBar: false
			}
		},
		created() {

			uni.$on('update',()=>{
				if(this.$api.isLogin()){
					this.getWaterBallList()
				}
			})
		
		},
		beforeDestroy() {
			// #ifdef H5
			cancelAnimationFrame(this.bollTimeR);
			// #endif
			
			// #ifdef APP-VUE || MP-WEIXIN
			clearInterval(this.bollTimeR);
			// #endif
			uni.$off('update')
		},
		mounted() {
			if(this.$api.isLogin()){
			   this.getWaterBallList()
			}
		},
		methods:{
			getWaterBallList(){
				let childCode = ''
				// #ifdef H5
				childCode = window.childCode
				// #endif
				// #ifdef APP-PLUS
				childCode = this.$config.childCode
				// #endif
		
				this.$api.getWaterBallList(childCode,(err,res)=>{
					if(res && Object.keys(res).length){
						this.list = res
						let sbwList = res.find( item => {
							return item.name == "水球活动" && item.status == 0
						})
						if(sbwList) this.isShowBar = true
						let {percentComplete,rewardAmount,intro,speActBigWheelVO,id } = sbwList || {}
						let {totalSpinCount,totalAward} = speActBigWheelVO || {}
						this.thematicActivitiesId = id
						this.percentComplete = percentComplete
						this.rewardAmount = rewardAmount
						this.intro = intro
						let list = totalAward && totalAward.filter(item=> item.status === -2 || item.status === 0)
						if(Array.isArray(list) && list.length > 0 ){
							list.forEach(item=>{
								// 为完成
								if(item.status==0){
									item.percentage = 100
									item.percentageText = this.$t('已完成')
								} else {
									item.percentage = Math.floor(totalSpinCount / item.rounds)
									item.percentageText = this.$t('已投注 ') + totalSpinCount + '/' + item.rounds
								}
								
							})
							this.totalAward = list
							// setTimeout(()=>{
							// 	const query = uni.createSelectorQuery().in(this);
							// 		query.select('.chart').boundingClientRect(data => {
							// 			this.drawBollWave("boll", data);
							// 	}).exec();
							// },10)
						}
					}
					
				})
			},
			// 关闭弹窗
			handleClose(){
				this.$refs.popup1.close()
			},
			// 返回进度列表
			handleBackStep(){
				this.showDetail = false
			},
			// 点击领取或详情、进度条进入详情明细
			handleSetp(status,item){
				console.log(status,"status")
				// 根据状态显示成功弹窗
				if(status===0){
					let rounds = encodeURIComponent(item.rounds)
					this.$api.putReceive(this.thematicActivitiesId,rounds,(err,res)=>{
						if(err){
							uni.showToast({
								title:err,
								icon:'none'
							})
						} else {
							this.getWaterBallList()
							this.receivedSuccess = true
						}
					})
				} else {
					this.showDetail = true
				}
			},
			handleShowOpen(){
				this.$refs.popup1.open()
			},
			toFixedNumber(n = 2, val) { //去小数点后2位
				if (typeof val == "number") {
					return val.toFixed(n) * 1
				}
			},
			//绘制原型水球
			drawBollWave(ids, elem) {
				let _this  = this
				let ctx = uni.createCanvasContext(ids),
					w = elem.width,
					h = elem.height,
					grd = null, //渐变色grd
					grds = null, 
					angle = 0,
					x = 0,
					y = 0,
					y2 = 0,
					part = 0; //part声波初始位置
				let grid = {
					top: 5 * h / 100, //水球距离顶的 15%
				};
				let bollArg = {
					R: h / 2 - grid.top, //圆半径
					O: {
						x: w / 2,
						y: h / 2
					}, //圆心坐标 x, y
					A: 1, //振幅
					vs: 10, //声波运动速度 越大值 越慢
					lineWidth: 1,
					waveOpacity: 1, //水波的透明度
					waveHeight: _this.percentComplete, // 80百分之80%（占整个水球的百分比高度）
					angleStep: 5, //声波上圆点间隔的距离
					waveLen: 30, //波长
					waveStyle: {
						fillColor: {
							start: "#ff9f43",
							end: "#de5600"
						},
						strokeColor: "#ffffff"
					}, //波浪颜色样式
					oStyle: {
						fillColorStart:"#f5a462",
						fillColorEnd:"#b20800",
						strokeColor: "#fdf4f4"
					}, //圆的颜色样式
					textStyle: {
						fillColor: "#fff",
						fontSize: 26
					},
				}
				let drawBoll = () => {
					ctx.clearRect(0, 0, w, h);
					ctx.save();
					ctx.beginPath();
					ctx.setLineWidth(bollArg.lineWidth);
					// 设置描边颜色
					ctx.setStrokeStyle(bollArg.oStyle.strokeColor);
					// 设置填充色
					let grds = ctx.createLinearGradient(0, 0, bollArg.O.y - bollArg.R, bollArg.O.y + bollArg.R);
					grds.addColorStop(0, bollArg.oStyle.fillColorStart);
					grds.addColorStop(1, bollArg.oStyle.fillColorEnd);
					ctx.setFillStyle(grds);
					ctx.arc(bollArg.O.x , bollArg.O.y , bollArg.R, 0, 2 * Math.PI);
					// 关闭一个路径。会连接起点和终点。如果关闭路径后没有调用 fill 或者 stroke 并开启了新的路径，那之前的路径将不会被渲染
					ctx.closePath();
					ctx.fill();
					ctx.stroke();
					ctx.clip();
					// 水波纹渐变色
					grd = ctx.createLinearGradient(0, 0, bollArg.O.y - bollArg.R, bollArg.O.y + bollArg.R);
					grd.addColorStop(0, bollArg.waveStyle.fillColor.start);
					grd.addColorStop(1, bollArg.waveStyle.fillColor.end);
					ctx.globalAlpha = bollArg.waveOpacity;
					ctx.beginPath();
					ctx.setStrokeStyle(bollArg.waveStyle.strokeColor);
					ctx.setFillStyle(grd);
					ctx.moveTo(bollArg.O.x - bollArg.R, bollArg.O.y + bollArg.R + bollArg.A);
					for (angle = bollArg.O.x - bollArg.R; angle < bollArg.O.x + bollArg.R + bollArg.angleStep; angle +=
						bollArg.angleStep) {
						y = bollArg.A * Math.sin(this.bollStep / bollArg.vs + angle / bollArg.waveLen * Math.PI * 2);
						x = angle;
						ctx.lineTo(x, (y + bollArg.R * 2 + bollArg.A + grid.top) - part * 0.01 * (bollArg.R * 2 *
							bollArg.waveHeight / 100));
						
					}
					ctx.lineTo(bollArg.O.x + bollArg.R, bollArg.O.y + bollArg.R + bollArg.A);
					ctx.fill();
					ctx.restore();
			
					ctx.beginPath();
					ctx.setTextAlign("center");
					ctx.setTextBaseline("middle");
					ctx.setFillStyle(bollArg.textStyle.fillColor);
					ctx.setFontSize(bollArg.textStyle.fontSize);
					ctx.fillText(this.toFixedNumber(2, bollArg.waveHeight * 0.01 * part) + "%", bollArg.O.x, bollArg.O.y);
					ctx.setFontSize(11);
				    ctx.fillText("领取" + _this.rewardAmount + '元', bollArg.O.x, bollArg.O.y + 20);
					ctx.save();	
					ctx.restore();
					
					// ctx.setFontSize(14);
					ctx.save();	
					ctx.restore();
					ctx.fill();
					// 将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中
					ctx.draw();
			
					part++;
					if (part >= 100) {
						part = 100;
					}
			
					// #ifdef H5
					this.bollStep++;
					if (this.bollStep > 2012) {
						this.bollStep = 0;
					}
					this.bollTimeR = requestAnimationFrame(drawBoll);
					// #endif
				}
				// #ifdef H5
				drawBoll();
				// #endif
				// #ifdef APP-VUE || MP-WEIXIN
				this.bollTimeR = setInterval(() => {
					drawBoll();
					this.bollStep++;
					if (this.bollStep > 2021) {
						this.bollStep = 0;
					}
				}, 1000 / 65);
				// #endif
			},
		}
	}
</script>
<style scoped>
	.line-chart {
		position: relative;
		top: 0;
		left: 0;
		padding: 20rpx;
	}
	.mar-bot20 {
		margin-bottom: 20rpx;
	}
	.abs {
		height: 26px;
		width: 100%;
		text-align: right;
	}
	.chart {
		width: 184rpx;
		height: 184rpx;
		/* background: #f8f8f8; */
		border-radius: 100%;
		/* background: linear-gradient(red,red); */
	}
	.inline-block {
		display: inline-block;
		height: 26px;
		line-height: 26px;
		padding: 0 10rpx;
	}
	.step{
		display: flex;
		flex-direction: column;
		width: 700upx;
		height: 980upx;
		background-color: #FFFFFF;
		border-radius: 20upx;
		margin: 0 auto;
	}
	.step-header{
		display: flex;
		align-items: center;
		padding: 0 30upx;
		height: 116upx;
		border-bottom: 1px solid rgba(227, 224, 224, 1);
	}
	.img-box{
		width: 96upx;
		margin-top: 34upx;
		vertical-align: middle;
	}
	.text{
		flex: 1;
		text-align: center;
		font-size: 40upx;
		color:rgba(112, 112, 112, 1) ;
		font-weight: 500;
		font-family: PingFang SC;
	}
	.img{
		width: 96upx;
		height: 96upx;
	}
	.step-list{
		padding:  34upx;
		box-sizing: border-box;
		flex: 1;
		overflow-y: auto;
	}
	.step-item{
		display: flex;
		flex-direction: column;
		width: 600upx;
		margin-bottom: 40upx;
	}
	.btn{
		width: 130upx;
		height: 58upx;
		line-height: 58upx;
		text-align: center;
		font-size: 28upx;
		border-radius: 180upx;
		margin-left: 20upx;
		background: linear-gradient(rgba(255, 255, 255, 1),rgba(234, 234, 234, 1),rgba(255, 255, 255, 1));
		color: rgba(112, 112, 112, 1);
		border: 1upx solid rgba(204, 204, 204, 1);
		box-shadow: 1px 6px 6px rgba(0, 0, 0, 0.16);
	}
	.btn-active{
		background: linear-gradient(#fe8612 0%, #ffbb79 30%, #fe8612 65%);
		color: #FFFFFF;
		border: 1upx solid rgba(255, 255, 255, 1);
		
	}
	.img-list{
		width: 100%;
		height: 822upx;
		margin: 10upx;
		padding: 40upx;
		font-size: 22upx;
	}
	.received{
		width: 700upx;
		height: 682upx;
		background: rgba(255, 255, 255, 1);
		border-radius: 20upx;
		text-align: center;
	}
	.close{
		text-align: right;
		padding: 20upx;
	}
	.img-success{
		width: 160upx;
		height: 160upx;
	}
	.text-success{
		color: rgba(32, 201, 77, 1);
		font-size: 52upx;
		font-weight: 500;
		margin: 28upx 0 60upx;
		font-family: PingFang SC;
	}
	.click-me{
		font-size: 28upx;
		color: rgba(112, 112, 112, 1);
		font-weight: 500;
		font-family: PingFang SC;
	}
	.btn-auto{
		width: 160upx;
		margin: 20upx auto;
	}

	.position-sbw{
		position: relative;
		width: 172rpx;
		height: 172rpx;
	}
	.sbw-text{
		position: absolute;
		top:0;
		left: 0;
		z-index: 10;
		width: 172rpx;
		height: 172rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		
	}
	.sbw-b-b{
		font-size: 52rpx;
		font-weight: 500;
		color: #fff;
		line-height: 60rpx;
	}
	.sbw-text-y{
		font-size: 20rpx;
		color: #fff;
		line-height: 24rpx;
	}
</style>
