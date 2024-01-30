<template>
    <div class="rules-layout">
        <div class="rules-warpper">
            <div class="rules-container">
                <div class="close" @click="toIndex">{{$t('关闭')}}</div>
                <div class="rules-content" v-html="ruleContent"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            ruleContent: ""
        };
    },
    mounted() {
        //获取规则
        this.getData();
    },
    methods: {
        getData() {
            this.$http.get(this.$api.getClientMall).then(res => {
                if (res.code == 0) {
                    this.ruleContent = res.data.ruleContent;
                }
            });
        },
        toIndex() {
            this.$router.back()
        }
    }
};
</script>

<style lang='scss'>
.rules-layout {
    flex: 1;
    background: #f2f2f2;
    .rules-warpper {
        width: 1200px;
        margin: 0 auto;
        position: relative;
        padding-top: 120px;
        overflow: hidden;
        min-height: 500px;
        .rules-container {
            position: relative;
            margin-top: 10px;
            background: #fff;
            position: relative;
            width: 100%;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);

            .close {
                position: absolute;
                top: 12px;
                left: 12px;
                font-size: 16px;
                cursor: pointer;
            }
            .close:hover {
                color: #00f;
            }
            .rules-content {
                padding: 15px 40px 40px;
            }
        }
    }
}
</style>