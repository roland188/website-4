<!-- ip限制页面 -->
<template>
    <div class="iplimit">
        <img class="iplimit-img" src="../../assets/image/iplimit01.png" alt="">
        <div class="iplimit-box1">
            <img class="iplimit-img2" src="../../assets/image/iplimit02.png" alt="">
            <span class="iplimit-text">{{ $t('访问受限制') }}</span>
        </div>
        <div class="iplimit-box2">
            <span>{{ $t('尊敬的用户，由于相关法规限制，您所在的地区无法访问，如有任何疑问，请联系客服，我们将第一时间给您回复，对您造成的不便，我们深表歉意，感谢您的理解和支持！') }}</span>
        </div>
        <div class="iplimit-box3">
            {{ $t('您的IP地址: {x}', { 'x': ip }) }}
        </div>
        <div class="">
            <img @click="customerChange" class="iplimit-btn-img" src="../../assets/image/iplimit03.png" alt="" />
            <div @click="trunBlack" class="trunBlack-btn">{{ $t('返回首页') }}</div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            ip: '0.0.0.0',
            urlStr: '',
        }
    },
    created() {
        if (this.$route.query.ip) {
            this.ip = this.$route.query.ip
        }
        if (this.$route.query.customer) {
            this.urlStr = this.$route.query.customer
        }
    },
    methods: {
        customerChange() {
            if (this.urlStr) {
                window.open(this.urlStr, "_blank");
            }
        },
        trunBlack() {
            this.$router.push({ path: "/home" })
        },
    }
}
</script>


<style scoped>
.iplimit {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-color: #ffffff;
}

.iplimit-img {
    width: 560px;
}

.iplimit-btn-img {
    margin-left: 20px;
    width: 260px;
}

.iplimit-box1 {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    top: -100px;
}

.iplimit-img2 {
    width: 60px;
    margin-right: 8px;
}

.iplimit-text {
    color: #ED8980;
    font-size: 44px;
    font-weight: 600;
}

.iplimit-box2 {
    max-width: 600px;
    padding: 20px 40px;
    box-shadow: 2px 2px 10px #eee;
    position: relative;
    top: -70px;
    color: #333;
}

.iplimit-box3 {
    font-size: 24px;
    color: #ED8980;
    position: relative;
    top: -20px;
    /* font-family:Cambria, Cochin, Georgia, Times, 'Times New Roman', serif */
}

.trunBlack-btn {
    border: 1px solid #ED8980;
    width: 240px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #ED8980;
    border-radius: 50px;
    margin: 0 auto;
}</style>