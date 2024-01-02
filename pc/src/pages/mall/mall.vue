<!-- 腾币商城 -->
<template>
    <div>
        <Home/>
    </div>
</template>

<script>
import Home from './Home.vue'
export default {
    components: {
        Home
    },
    created () {
        if (this.$common.getUser()) {
            const userInfo = this.$common.getUser()
            this.$config.username = userInfo.username || ""
            this.$config.token = userInfo && userInfo.token_type + " " + userInfo.access_token
        }
        this.$config.clientCode = window.clientCode
        this.$config.clientItem = window.childCode
        this.$config.language = this.$config.language
        this.$config.theme = window.theme
        this.$config.baseURL = this.$common.getHost()
        this.$config.projectName = window.projectImgUrl
        this.$i18n.locale = this.$config.language || "vi"
        // this.pageList();
    },
    methods: {
        getQuery(name) {
            var r = window.location.search
                .substr(1)
                .match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)"));
            if (r != null) return unescape(r[2]);
            return null;
        },
        pageList() {
             let token = this.$store.state.token   
             if(token){
                 this.$http.get(this.$api.pageList).then((res) => {
                    if (res.code == 0) {
                        let url = "";
                        res.data.forEach((element) => {
                            if (element.type == 2) {
                                url = element.domain
                            }
                        });
                        this.$config.imgHost = url
                    }
                });
             } else {
                this.$ApiIntegration.register(async (i)=>{
                const res = await i.getDataByStorage('domains')
                    let url = "";
                    const data= res.find((item)=>{
                        return item.type == 2
                    })
                    url = data.domain
                    this.$config.imgHost = url
                });
             }
           
        },
    }
}
</script>

<style scoped>

</style>