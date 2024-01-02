<template>
	<uni-nav-bar left-icon="closeempty" @clickLeft="handleClose" :title="popupHeaderText"></uni-nav-bar>
</template>

<script>
	export default {
		props:{
			popupHeaderText: {
				type:String,
				default:''
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			handleClose(){
				this.$emit('handleClose')
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
