<template>
	<!-- 入款-未到账记录 -->
	<view class="content">
		<table class="tables">
			<tr>
				<th v-for="(item,index) in titleList" :key="index">{{item.name}}</th>
			</tr>
			<tr v-for="(citem,cindex) in list" :key="cindex">
				<td>{{timeSwitch(citem.createdAt)}}</td>
				<td>{{citem.memeberName}}</td>
				<td>{{citem.amount}}</td>
				<td :class="{'orange':citem.status == 1,'green':citem.status == 2,'red':citem.status == 3}">{{citem.status | changeStatus}}</td>
				<td style="max-width:240upx;">{{citem.memo}}</td>
			</tr>

		</table>

	</view>
</template>

<script>
	import config from './lib/config.js'
	import api from './lib/api.js'
	import i18n from './lib/i18n'
	import {
		_get,
		_post
	} from './lib/server.js'
	export default {
		filters: {
			changeStatus(val) {
				switch (val) {
					case 1:
						return i18n.$t('处理中');
						break;
					case 2:
						return i18n.$t('成功');
						break;
					case 3:
						return i18n.$t('失败');
						break;
				}
			},

		},
		data() {
			return {
				list: [],
				titleList: [{
						name: i18n.$t('申请时间')
					},
					{
						name: i18n.$t('真实姓名')
					},
					{
						name: i18n.$t('金额（元）')
					},
					{
						name: i18n.$t('状态')
					},
					{
						name: i18n.$t('备注')
					}
				]
			}
		},
		mounted() {
			this.getList();
		},
		methods: {
			getList() {
				const query = {
					memeberName: config.username
				}
				_post(api.saveApplyList, query).then(res => {
					if (res) {
						this.list = res.data;
					}
				})
			},
			timeSwitch(val) {
				if (val) {
					var date = new Date(val); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
					var Y = date.getFullYear() + "-";
					var M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
					var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
					var time = Y + M + D;
					return time;
				}
			},
		},
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		height: 100%;
		padding: 20upx;
	}

	.tables {
		border: 1px solid #D6D0CA;
		margin: 0 auto;
		border-collapse: collapse;
		color: #000;

		tr {
			height: 80upx;
			line-height: 80upx;
			text-align: center;

			th {
				width: 20%;
				border: 1px solid #D6D0CA;
				font-size: 26upx;
				font-weight: bold;
				text-align: center;
			}

			td {
				width: 20%;
				max-width: 20%;
				border: 1px solid #D6D0CA;
				text-align: center;
				font-size: 26upx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}

	.blue {
		color: blue;
	}

	.green {
		color: green;
	}

	.red {
		color: red;
	}

	.orange {
		color: orange;
	}
</style>
