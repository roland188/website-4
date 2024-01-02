<template>
	<view class="pages">
		<!--  修改银行卡号  -->
		<multiple-pages @jump="jump" />
	</view>
</template>

<script>
	import multiplePages from './components/multiplePages.vue'
	export default {
		components: {
			multiplePages
		},
		data() {
			return {}
		},
		mounted() {


		},
		methods: {
			jump(page) {
				this.$emit('jump', page)
			}

		}
	}
</script>

<style>
</style>
