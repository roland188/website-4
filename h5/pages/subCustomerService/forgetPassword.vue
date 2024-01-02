<template>
	<view class="pages">
	<!-- 	忘记登录密码 -->
	<multiple-pages @jump="jump" />
	</view>
</template>

<script>
	import multiplePages from './components/multiplePages.vue'
	export default {
		components:{
			multiplePages
		},
		data() {
			return {}
		},
		mounted() {
	
			
		},
		methods: {
		jump(page){
			this.$emit('jump', page)
		}

		}
	}
</script>

<style>
</style>
