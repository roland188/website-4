<template>
	<div id="notice">
		<el-dialog
            title=""
            :visible.sync="showDialog"
            :append-to-body="true"
            :show-close="false"
            width="800px"
            top='20vh'
            :before-close="closeLogin">

            <div class="head">
                <div>{{$t('公告通知')}}</div>
                <!-- eslint-disable-next-line vue/no-parsing-error -->
                <span class="infoIcon closeImg" @click="closeLogin" >&#xe607</span>
            </div>

            <div style="overflow:auto; height:400px; width:800px; margin: 0 auto">
                <ul >
                    <li v-for="(item,index) in list" :key = "index" >
                        <div class="item">
                            <div class="content1">
                                <span style="color: #ff0000;">* </span>
                                {{item.subject}}
                                <span class="msgContent" v-html="item.content"></span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
		</el-dialog>
	</div>
</template>

<script>
export default {
    data() {
        return {
            'isClickLogin': true, //只有第一次登录生效，除非登录失败
            'code':'',
            'showDialog':true,
            'list':[]
        };
    },

    mounted() {
        this.getNotices();
    },

    'methods':{
        closeLogin(){
            this.$emit('close','');
        },
        async getNotices() {
            var _this = this;
            var data = {
                'createdAt': '',
                'currentPage': '',
                'pageSize': '',
                'publishedAt': '',
                'subject': '',
                'type': ''
            };
            var res = await _this.$http.post(_this.$api.noticeList, data);
            if (res.code == 0) {
                _this.list= res.data.content;
            } else {
                this.$message.error(res.msg);
            }
        }
    }
};
</script>

<style scoped>
	.el-dialog {
        background: rgba(255,255,255,0);
	}
	>>> .el-dialog__body {
            padding: 0px;
            border-radius: 10px;
	}
	>>> .el-dialog__header {
            padding: 0px;
            height: 0px;
	}
	.closeImg {
		margin-right: 10px;
		width: 24px;
		height: 24px;
        cursor: pointer;
	}
	.head{
		background-color: #333;
		height: 55px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding-left: 10px;
		color: #FFFFFF;
		font-weight: 500;
	}
	.item {
		border-bottom: 1px dashed #ccc;
		margin-left: 30px;
		margin-right: 30px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		font-size: 16px;
		padding-top: 10px;
		padding-bottom: 10px;
	}
	.infoIcon {
		width: 20px;height: 20px;
		font-family: "iconfont" !important;
        font-size: 16px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
	}
</style>
