<template>
	<div class="rebate">
		<dia-Log ref="dialogPopup" :dialogStyle="dialogStyle">
			<h1 slot="title">{{ $t('全民返利') }}</h1>
			<el-scrollbar style="height:600px;" ref="multipleTable">
				<div class="content">
					<div class="content_header">
						<div class="header_left">
							<i class="leftIcon"></i>
							<div class="header_cumulative">
								<div>
									<p>{{ $t('累计返利：{x}元', { x: amount }) }}</p>
									<i @click="refresh" :class="{ refreshShow: refreshShow }"></i>
								</div>
								<p class="getConditions">{{ $t('满{x}元，且有效会员≥{y}人，即可领取', { x: minCount, y: meetConditions }) }}</p>
							</div>
						</div>
						<el-button class="receive codeBorder" @click="getReceive"
							:class="{ receiveFalse: !receiveFalse }">{{ $t('领取') }}</el-button>
					</div>

					<div class="VIP" @click="toVip()">
						<div class="VIPleft">
							<i></i>
							<span>{{ $t(`会员(会员总数：{x},有效会员：{y})`, { x: Vnum, y: effectiveVnum }) }}</span>
						</div>
						<i class="VIPicon"></i>
					</div>

					<div class="threeCode">
						<div>
							<div class="qrCode">
								<span class="codeTitle">{{ $t("我的推广码") }}</span>
								<div class="qrCodeBoder">
									<div id="qrcode"></div>
								</div>
								<i class="qrCodeleftOne"></i>
								<i class="qrCodeleftTwo"></i>
								<i class="qrCodeRightOne"></i>
								<i class="qrCodeRightTwo"></i>
							</div>
							<div class="copyButton codeBorder">
								<span class="copyButtonColor" @click="download">{{ $t(`下载推广码`) }}</span>
							</div>
						</div>

						<div>
							<div class="qrCode">
								<span class="codeTitle">{{ $t(`我的邀请码`) }}</span>
								<div class="qrCodeBoder">
									<span class="centerCode">{{ inviteCode }}</span>
								</div>
								<i class="qrCodeleftOne"></i>
								<i class="qrCodeleftTwo"></i>
								<i class="qrCodeRightOne"></i>
								<i class="qrCodeRightTwo"></i>
							</div>
							<div class="copyButton codeBorder">
								<span class="copyButtonColor" v-clipboard:copy="inviteCode"
									v-clipboard:success="(type) => onCopyResult('success')"
									v-clipboard:error="(type) => onCopyResult('error')">{{ $t(`复制推广码`) }}</span>
							</div>
						</div>

						<div>
							<div class="qrCode">
								<span class="codeTitle">{{ $t(`我的推广地址`) }}</span>
								<div class="qrCodeBoder">
									<span class="rightCode">{{ promoteAddress }}</span>
								</div>
								<i class="qrCodeleftOne"></i>
								<i class="qrCodeleftTwo"></i>
								<i class="qrCodeleftThree"></i>
								<i class="qrCodeRightOne"></i>
								<i class="qrCodeRightTwo"></i>
								<i class="qrCodeRightThree"></i>
							</div>
							<div class="copyButton codeBorder">
								<span class="copyButtonColor" v-clipboard:copy="promoteAddress"
									v-clipboard:success="(type) => onCopyResults('success')"
									v-clipboard:error="(type) => onCopyResults('error')">{{ $t(`复制地址`) }}</span>
							</div>
						</div>
					</div>


					<div v-html="rules" class="rules" style="text-align:left;"></div>
				</div>
			</el-scrollbar>

		</dia-Log>
		<log-Out ref="logOut" @confirmLogout="confirmLogout">
			<p slot="contentText" style="font-size:30px;margin-top:20px;">{{ amount }}</p>
			<p slot="contentText" style="font-size:18px;margin:10px;">{{ $t(`流水要求{x}倍`, { x: ultiple }) }}</p>
		</log-Out>
		<Invite-Vip ref="InviteVip"></Invite-Vip>
	</div>
</template>

<script>
import diaLog from '../DiaLog/DiaLog';
import logOut from '../LogOut/LogOut';
import InviteVip from '../InviteVip/InviteVip';
import QRCode from '@keeex/qrcodejs-kx';
export default {
	'components': {
		diaLog,
		QRCode,
		logOut,
		InviteVip
	},
	data() {
		return {
			'qrCode': '',//二维码
			'inviteCode': '',//邀请码
			'promoteAddress': '',//推广地址
			'minCount': '--/--',
			'amount': '--/--',
			'ultiple': '0',
			'receiveFalse': false,
			'refreshShow': false,
			'rules': '',
			'Vnum': 0,
			'meetConditions': 0,
			'maxReceive': '0',
			'effectiveVnum': 0,
			'tableData': [
				{
					'category': this.$t('电子游艺'),
					'proportion': '10%'
				},
				{
					'category': this.$t('体育赛事'),
					'proportion': '11%'
				},
				{
					'category': this.$t('棋牌游戏'),
					'proportion': '12%'
				},
				{
					'category': this.$t('彩票游戏'),
					'proportion': '13%'
				},
				{
					'category': this.$t('真人视讯'),
					'proportion': '14%'
				},
				{
					'category': this.$t('电子竞技'),
					'proportion': '100%'
				}
			],
			'dialogStyle': {
				'dialogWidth': '',
				'paging': false
			}
		};
	},
	'methods': {
		According() {
			// 窗口宽度
			this.dialogStyle.dialogWidth = '1100px';
			this.$refs.dialogPopup.popUp(true);
			this.referralLink();
			if (this.$common.getUser()) {
				this.validMemberCount();
			}
			this.$nextTick(() => {
				this.allowanceExplain();
			});
		},
		//跳转vip查询
		toVip() {
			this.$refs.InviteVip.According(0);
		},
		//会员
		validMemberCount() {
			this.$http.get(this.$api.validMemberCount).then((res) => {
				if (res) {
					this.effectiveVnum = res.data.validMemberCount;
					this.Vnum = res.data.allMemberCount;
					this.availableAmount(this.effectiveVnum);
				}
			});
		},
		download() {
			let dataUrl = document.querySelector('#qrcode').querySelector('img').src;
			this.downloadURI(dataUrl, 'qrcode.png');
		},
		downloadURI(uri, name) {
			var link = document.createElement('a');
			link.download = name;
			link.href = uri;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		},
		allowanceExplain() {
			this.$http.get(this.$api.allowanceExplain).then((res) => {
				this.rules = res.data.explains;
			});
		},
		//推广码
		referralLink() {
			let that = this;
			that.$http.get(that.$api.referralLink).then((res) => {
				document.getElementById('qrcode').innerHTML = '';
				that.inviteCode = res.data.code;
				that.promoteAddress = `${window.location.origin}?code=${that.inviteCode}`;
				new QRCode('qrcode', {
					'width': 180, // 设置宽度，单位像素
					'height': 180, // 设置高度，单位像素
					'text': that.promoteAddress // 设置二维码内容或跳转地址
				});
			});
		},
		//可领取金额
		availableAmount(effectiveVnum) {
			let that = this;
			that.$http.post(that.$api.availableAmount).then((res) => {
				if (res.code === 0) {
					that.meetConditions = res.data.minValidCount;//符合领取要求会员人数
					that.minCount = that.$common.setNumFixed(res.data.minCount, 2);//最低领取金额
					that.maxReceive = that.$common.setNumFixed(res.data.maxReceive, 2);//领取上限金额
					that.amount = that.$common.setNumFixed(res.data.allowance, 2);
					that.ultiple = res.data.auditFactor;
					that.refreshShow = false; //刷新动画停止
					if (that.amount - 0 >= that.minCount - 0 && +effectiveVnum >= that.meetConditions && that.amount - 0 <= that.maxReceive - 0) {
						that.receiveFalse = true;
					} else {
						that.receiveFalse = false;
					}
				}
			});
		},
		//点击领取按钮
		getReceive() {
			if (this.receiveFalse) {
				this.$refs.logOut.isShow(this.$t('领取'));
			} else {
				this.$message.error(this.$t(`未满足领取要求，最低领取金额{x}元,有效会员人数≥{y}人,领取上限{z}元`,
					{ x: this.minCount, y: this.meetConditions,z:this.maxReceive }));
			}

		},
		//刷新累计返利
		refresh() {
			this.refreshShow = true; //刷新动画开始
			this.availableAmount(this.effectiveVnum);
		},
		//领取
		confirmLogout() {
			let that = this;
			that.$http.post(that.$api.getReceive).then((res) => {
				if (res.code == 0) {
					that.$message({
						'message': this.$t('领取成功'),
						'type': 'success'
					});
					that.availableAmount(that.effectiveVnum);
				} else {
					that.$message.error(res.msg);
				}
			});
		},
		//复制推广码
		onCopyResult(type) {
			if (type === 'success') {
				this.$message({
					'message': this.$t('复制成功'),
					'type': 'success'
				});
			} else {
				this.$message.error(this.$t('复制失败'));
			}
		},
		//复制地址
		onCopyResults(type) {
			if (type === 'success') {
				this.$message({
					'message': this.$t('复制成功'),
					'type': 'success'
				});
			} else {
				this.$message.error(this.$t('复制失败'));
			}
		}
	}
};
</script>

<style lang="less">
.rebate {
	h1 {
		text-align: center;
	}

	.rules {
		table {
			width: 100% !important;
			margin-top: 5px;

			tr {
				height: 30px !important;
			}
		}

		p {
			margin-top: 5px;
		}

		span {
			display: inline-block;
			width: 100% !important;

			// display: flex;
			img {
				margin: 0 auto;
			}
		}
	}

	.el-dialog {
		max-height: 80%;
		overflow: hidden;
	}

	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 0 20px;
		box-sizing: border-box;

		.VIP {
			display: flex;
			width: 100%;
			height: 52px;
			box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
			opacity: 1;
			border-radius: 8px;
			margin-top: 8px;
			align-items: center;
			justify-content: space-between;

			.VIPleft {
				display: flex;

				i {
					display: inline-block;
					width: 20px;
					height: 20px;
					background: url('../../assets/image/xfImg/VIPleft.png') no-repeat;
					background-size: 100% 100%;
					margin: 0 8px;
				}
			}

			.VIPicon {
				width: 9px;
				height: 16px;
				display: inline-block;
				background: url('../../assets/image/xfImg/iconRight.png') no-repeat;
				background-size: 100% 100%;
				margin-right: 16px;
			}
		}

		// 头部
		.content_header {
			margin-top: 5px;
			border-radius: 10px;
			width: 100%;
			align-items: center;
			padding: 16px;
			box-sizing: border-box;
			box-shadow: 0px 1px 9px rgba(0, 0, 0, 0.06);
			display: flex;
			flex-wrap: nowrap;
			justify-content: space-between;

			.header_left {
				flex: 1;
				display: flex;
				align-items: center;

				.leftIcon {
					width: 32px;
					height: 32px;
					border-radius: 50%;
					background: url('../../assets/image/xfImg/rebate.png') no-repeat;
					background-size: 100% 100%;
				}

				.header_cumulative {
					margin-left: 15px;
					text-align: left;

					div {
						display: flex;
						flex-wrap: nowrap;
						align-items: center;

						p {
							font-size: 14px;
							color: #2D2B4D;
						}

						i {
							width: 11px;
							height: 13px;
							background-size: 100% 100%;
							margin-left: 8px;
							background: url('../../assets/image/xfImg/refresh.png') no-repeat;
							background-size: cover;
						}

						.refreshShow {
							animation: refreshShow 1s linear;
						}

						@keyframes refreshShow {
							0% {
								transform: rotate(0deg);
							}

							100% {
								transform: rotate(360deg);
							}
						}
					}

					.getConditions {
						font-size: 12px;
						color: #9695A6;
						margin-top: 2px;
					}
				}
			}

			.receive {
				border: 0;
				padding: 0;
				width: 60px;
				height: 25px;
				background-color: #896835;
				border-radius: 74px;
				line-height: 25px;
				text-align: center;
				font-size: 12px;
				color: #ffffff;
			}

			.receiveFalse {
				opacity: 0.5;
				color: #000;
			}
		}

		// 邀请码
		.threeCode {
			width: 100%;
			display: flex;
			justify-content: space-between;

			.qrCode {
				position: relative;
				width: 286px;
				height: 275px;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				border: 1px solid #896835;
				border-radius: 16px;
				margin-top: 20px;
				box-sizing: border-box;

				.codeTitle {
					position: absolute;
					top: 8px;
					left: 0;
					width: 100%;
					text-align: center;
					font-size: 13px;
					color: #1D1717;
				}

				.qrCodeBoder {
					width: 215px;
					height: 215px;
					background-size: 100% 100%;
					margin: 0 auto;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #1D1717;
					background: url('../../assets/image/xfImg/qrCode.png') no-repeat;
					background-size: 100% 100%;

					img {
						width: 180px;
						height: 180px;
					}

					.centerCode {
						width: 85%;
						font-size: 30px;
						text-align: center;
					}

					.rightCode {
						width: 85%;
						font-size: 18px;
						text-align: center;
					}
				}

				.qrCodeleftOne {
					width: 45px;
					height: 45px;
					position: absolute;
					top: 30px;
					left: -3px;
					background: url('../../assets/image/xfImg/qrCodeleftOne.png') no-repeat;
					background-size: cover;
				}

				.qrCodeleftTwo {
					width: 22px;
					height: 22px;
					position: absolute;
					top: 140px;
					left: 8px;
					background: url('../../assets/image/xfImg/qrCodeleftTwo.png') no-repeat;
					background-size: cover;
				}

				.qrCodeleftThree {
					width: 75px;
					height: 75px;
					position: absolute;
					bottom: -6px;
					left: 4px;
					background: url('../../assets/image/xfImg/qrCodeleftThree.png') no-repeat;
					background-size: cover;
				}

				.qrCodeRightOne {
					width: 15px;
					height: 15px;
					position: absolute;
					top: 15px;
					right: 10px;
					background: url('../../assets/image/xfImg/qrCodeRightOne.png') no-repeat;
					background-size: cover;
				}

				.qrCodeRightTwo {
					width: 25px;
					height: 25px;
					position: absolute;
					top: 100px;
					right: 10px;
					background: url('../../assets/image/xfImg/qrCodeRightTwo.png') no-repeat;
					background-size: cover;
				}

				.qrCodeRightThree {
					width: 95px;
					height: 110px;
					position: absolute;
					bottom: 0px;
					right: -3px;
					background: url('../../assets/image/xfImg/qrCodeRightThree.png') no-repeat;
					background-size: 100% 100%;
				}
			}

			//复制按钮
			.copyButton {
				width: 80%;
				display: flex;
				justify-content: center;
				margin: 20px auto;
				border-radius: 8px;

				span {
					width: 80%;
					height: 45px;
					line-height: 45px;
					border-radius: 8px;
					text-align: center;
					font-size: 15px;
				}

				.copyButtonColor {
					background: #896835;
					color: #ffffff;
				}
			}
		}


		//规则说明
		.rules {
			width: 100%;

			.rulesHeader {
				display: flex;
				justify-content: center;
				flex-wrap: nowrap;
				align-items: center;
				margin-top: 35px;

				i {
					width: 15%;
					border-top: 1px solid #000;
				}

				span {
					font-size: 13px;
					color: #2D2B4D;
					margin: 0 20px;
				}
			}

			.rulesText {
				color: #9695A6;
				text-align: left;
				font-size: 12px;
				margin-top: 10px;

				p {
					margin-top: 5px;
				}

				.indentation {
					text-indent: 9px;
				}
			}
		}

		.table {
			margin-top: 20px;
			width: 100%;
		}
	}
}</style>
