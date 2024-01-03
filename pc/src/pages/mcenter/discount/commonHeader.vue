<template>
    <!-- 公共头部 -->
    <div class="commonHeader">
        <div class="header">
            <div class="discount-title" @click="onBack">{{ $t('自助优惠') }}</div>
            <img class="icon" src="../../../assets/image/discount/title-arrow.png" alt="">
            <div class="title">{{ title }}</div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: "",
        },
    },
    data() {
        return {};
    },
    methods: {
        onBack() {
            this.$router.push({
                path: '/mcenter/discount'
            })
        },
    },
};
</script>
<style lang="scss" scoped>
.commonHeader{
    .header {
        margin: 20px 0;
        display: flex;
        align-items: center;
        font-size: 0.3rem;
        margin-bottom: 0.3rem;
        padding: 0 0.1rem 0.3rem;
        border-bottom: 1px solid rgba(233, 157, 66, 1);
        .discount-title {
            font-weight: bold;
            color: #3e444d;
            cursor: pointer;
        }
        .title{
            color: #101010;
        }
        .icon {
            margin: 0 0.2rem;
            width: 0.3rem;
            height: 0.3rem;
        }
    }
}
</style>