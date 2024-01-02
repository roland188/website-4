<template>
	<view class="problem-wrap">
		<view class="problem-list" v-for="item in problemList" :key="item.id">
			<view class="left-title">
				{{item.questionTypeName}}
			</view>
			<view class="right-item-wrap">
				<view class="item" v-for="f_item in item.faqList" :key="f_item.id" @tap="goToDetail(f_item)">
					{{f_item.questionTitle}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import config from './lib/config'
	import api from './lib/api'
	import {
		_get,
		_post
	} from './lib/server'
	export default {
		data() {
			return {
				problemList: []
			}
		},
		mounted() {
			this.getProblemData()
		},
		methods: {
			getProblemData() {
				_post(api.problemList).then(res => {
					console.log(res)
					if (res.code == 0) {
						this.problemList = res.data
					}
				})
			},
			goToDetail(data) {
				// console.log(data)
				uni.setStorageSync('faqList', data)
				this.$emit('jump', 'ProblemDetail')
			}
		}
	}
</script>

<style lang="scss">
	.problem-wrap {
		width: 100%;
		height: 100%;
		overflow-y: auto;
		padding-bottom: 30upx;

		.problem-list {
			background-color: #fff;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 20upx;
			overflow: hidden;
			width: 100%;

			.left-title {
				width: 25%;
				font-weight: 600;
				font-size: 30upx;
				padding: 0 10upx;
				text-align: center;
			}

			.right-item-wrap {
				width: 74%;

				.item {
					border-top: 1px solid #f7f7f7;
					border-left: 1px solid #f7f7f7;
					text-align: left;
					height: 84upx;
					line-height: 84upx;
					font-size: 26upx;
					color: #1d1717;
					opacity: 1;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					box-sizing: border-box;
					padding: 0 24upx;
				}
			}
		}
	}
</style>
