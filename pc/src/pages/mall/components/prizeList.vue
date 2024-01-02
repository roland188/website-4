<template>
    <!-- 奖品列表 -->
    <div class="prize-layout">
        <el-dialog
            :visible.sync="show"
            width="800px"
            :modal="isShowModal"
            :show-close="isShowClose"
            :close-on-click-modal="false"
        >
            <div class="prize-list-container">
                <div class="p-header">
                    <div class="p-title">{{$t('查看奖品')}}</div>
                    <img loading="lazy"
                        class="close-btn cursorPoint"
                        v-lazy="require('../../../assets/shop/close.png')"
                        @click="closeDialog"
                    />
                </div>
                <div class="p-content">
                    <ul>
                        <li class="p-item-box" v-for="(item,i) in prizeList" :key="i">
                            <div class="img">
                                <img loading="lazy" v-lazy="$config.getImgUrl(item.imgUrl)" alt />
                            </div>

                            <div class="title">{{item.name}}</div>
                        </li>
                    </ul>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            show: false,
            isShowClose: false,
            isShowModal: false, //是否显示遮罩
            prizeList: []
        };
    },
    methods: {
        openDialog() {
            this.show = true;
        },
        closeDialog() {
            this.show = false;
        },
        getPrizeList() {
            this.$http.get(this.$api.shoppingMallList).then(res => {
                if (res.code == 0) {
                    this.prizeList = res.data.lotteryMallVOList; //奖品列表
                }
            });
        }
    },
    watch: {
        show(n) {
            if (n) {
                this.getPrizeList();
            }
        }
    }
};
</script>

<style lang='scss'>
.prize-layout {
    .el-dialog__wrapper {
        display: flex;
        align-items: center;

        .el-dialog {
            margin: 0 auto !important;
            border-radius: 12px 12px 0 0;
            .el-dialog__header {
                padding: 0 !important;
            }
            .el-dialog__body {
                padding: 0 !important;
            }
        }
    }
    .prize-list-container {
        .p-header {
            border-bottom: 1px solid #e8e8e8;
            color: rgba(0, 0, 0, 0.85);
            font-weight: 500;
            line-height: 55px;
            padding: 0 24px;
            position: relative;
            .p-title {
                font-size: 16px;
            }
            .close-btn {
                position: absolute;
                top: 12px;
                right: 18px;
                width: 30px;
                height: 30px;
                transition: 1s;
            }
            .close-btn:hover {
                transform: rotate(180deg);
            }
        }

        .p-content {
            padding: 24px;
            background: #e2c896;
            min-height: 360px;
            ul {
                margin: auto;
                width: 758px;
                max-height: 472px;
                overflow-y: auto;
                padding: 0;
                .p-item-box {
                    display: inline-block;
                    margin: 14px 32px;
                    max-width: 123px;
                    vertical-align: top;
                    text-align: center;
                    .img {
                        width: 120px;
                        height: 120px;
                        line-height: 120px;
                        background: url("../../../assets/shop/dow2.png") no-repeat
                            50%;
                        background-size: contain;
                        margin-bottom: 10px;
                        img {
                            width: 78px;
                            height: 78px;
                            vertical-align: middle;
                        }
                    }
                }
            }
        }
    }
}
</style>