<template>
	<view class="marquee" v-if="showText">
		<view class="bbox" id="box_el">
			<view class="content" :class="{ move }" id="con_el">
				{{ text }}
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		props: ['text'],
		data() {
			return {
				move: false
			}
		},
		mounted() {
			this.init()
		},
		computed: {
			showText() {
				return !!this.text
			}
		},
		methods: {
			init() {
				if (!this.text) return
				this.$nextTick(() => {
					const query = uni.createSelectorQuery()
					const boxEl = query.select('.marquee .bbox')
					const conEl = query.select('.marquee .bbox .content')
					let boxW = 0
					let conW = 0
					boxEl.fields({
						size: true
					}, res => {
						boxW = res.width
					}).exec()
					conEl.fields({
						size: true
					}, r => {
						conW = r.width
					}).exec()

					setTimeout(() => {
						if (boxW < conW) {
							const speed = 50
							this.animationDuration = conW / speed + 's'
							this.move = true
						}
					}, 100)
				})
			}
		},
		watch: {
			text() {
				this.init()
			}
		}
	}
</script>
<style lang="scss" scoped>
	$h: 30px;

	.marquee {
		position: relative;
		min-height: $h;
		margin-bottom: 10px;
	}

	.bbox {
		width: 100%;
		line-height: $h;
		padding: 0 10px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		// background: #fff4d7;
		color: #e91919;
		overflow: hidden;
	}

	.content {
		white-space: nowrap;
		width: max-content;
		font-size: 13px;
	}

	.move {

		animation: roll 15s infinite linear;

		&:hover {
			animation-play-state: paused;
		}
	}

	@keyframes roll {
		0% {
			transform: translateX(0);
		}

		100% {
			transform: translateX(-100%);
		}
	}
</style>
