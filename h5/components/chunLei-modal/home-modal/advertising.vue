<template>
	<view class="content-wrap">
		<view>
			<view class="wrap" v-for="(item,index) in data" @tap="handelSwitch(item,index)">
				<view class="title title-one" :class="tabIndex == index ? 'title-one' : 'title-tow'">
					{{item.title}}
				</view>
				<view class="main" :class="tabIndex == index ? 'h-styele' : ''">
					<view class="text" v-html="item.contentH5">
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		components: {},
		data() {
			return {
				data: [],
				tabIndex: 0
			}
		},
		mounted() {
			this.getPopUpAdsSetting();
		},
		methods: {
			handelSwitch(item, index) {
				console.log(item)
				this.tabIndex = index;
			},
			getPopUpAdsSetting() {
				this.$api.getPopUpAdsSetting((err, res) => {
					if (res) {
						console.log(res)
						this.data = res
					}
				});
			},
		}

	}
</script>
<style lang="scss">
	page {
		background-color: #000000;
	}

	.content-wrap {
		width: 100%;
		padding: 10%;

		.title {
			height: 66upx;
			line-height: 70upx;
			padding: 0;
			text-align: center;
		}

		.title-one {
			background: url(@/static/image/mb/h5_list01.png) no-repeat;
			background-size: 100% 96upx;
		}

		.title-tow {
			background: url(@/static/image/mb/h5_list02.png) no-repeat;
			background-size: 100% 96upx;
		}

		.main {
			background: url(@/static/image/mb/h5_bg.png) no-repeat;
			height: 0;
			background-size: 100% 100%;
			transition: .3s;
			color: #fff;
			margin-bottom: 6upx;

			.text {
				height: 100%;
				overflow-y: auto;

				::v-deep image,
				::v-deep img {
					max-width: 100% !important;
					height: 100% !important;
				}
			}
		}

		.h-styele {
			height: 400upx !important;
			padding: 26upx;
			overflow-y: scroll;
		}
	}
</style>
