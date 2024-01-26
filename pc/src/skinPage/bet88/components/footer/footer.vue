<template>
  <div class="footer">
    <div class="list">
      <div
        class="items"
        v-for="(item,index) in list"
        :key="index"
        :style="'background:url(' + item.img + ') center top no-repeat;'+(index == 0?'background-size:auto 40%;background-position:center 20%;':'')"
      >
        <p class="title">{{item.name_ch}}</p>
        <p class="title_en">{{item.name_en}}</p>
      </div>
    </div>
    <!-- 合作商 -->
    <div class="cooperation">
      <div class="item item1"></div>
      <div class="item item2"></div>
      <div class="item item3"></div>
      <div class="item item4"></div>
      <div class="item item5"></div>
      <div class="item item6"></div>
      <div class="item item7"></div>
      <div class="item item8"></div>
      <div class="item item9"></div>
      <div class="item item10"></div>
    </div>
    <!-- 展示列表 -->
    <div class="article_list">
      <span v-for="(item,index) in article" :key="index" @click="openPage(index)">{{item}}</span>
    </div>
    <!-- 防伪标志 -->
    <div class="anit_mark" v-if=" projectImgUrl === 'funw'">Copyright © 2023 Fun Win Group. All Rights Reserved.</div>
    <div class="anit_mark" v-else>Copyright © 
      {{ new Date().getFullYear() }} 
      {{ projectName }} 
      Reserved @v{{numVer}}</div>
  </div>
</template>
<script>
export default {
    'name': 'footers',
    data() {
        return {
            projectImgUrl: window.projectImgUrl,
            projectName: window.projectName,
            'numVer': window.numVer,
            'isShowRegister': false,
            list: [
                {
                    img: this.$common.getTitleImgUrl('Logo'),
                    name_ch: window.projectName + ' ' + this.$t('小赌怡情 一生必赢'),
                    name_en: 'MUST WIN INTERNATIONAL'
                },
                {
                    img: require('@/assets/image/gameImg/index/footer_img03.png'),
                    name_ch: this.$t('歐洲王國政府授權'),
                    name_en: 'GRAND LISBOAAUTHORIZATION'
                },
                {
                    img: require('@/assets/image/gameImg/index/footer_img04.png'),
                    name_ch: this.$t('英国曼岛政府授权'),
                    name_en: 'ISLE OF MAN AUTHORIZATICN'
                },
                {
                    img: require('@/assets/image/gameImg/index/footer_img05.png'),
                    name_ch: this.$t('澳门特别行政区政府授权'),
                    name_en: 'MACAU AUTHORIZATION'
                },
                {
                    img: require('@/assets/image/gameImg/index/footer_img06.png'),
                    name_ch: this.$t('亚洲菲律宾共和国政府授权'),
                    name_en: 'FCLRC AUTHORIZATION'
                }
            ],
            'article': [
                this.$t('联络我们')
                // "代理加盟",
                // "关于我们",
                // "存款帮助",
                // "取款帮助",
                // "常见问题"
            ]
        };
    },
    mounted() {},
    'methods': {
    // 在线客服
        onlineTalk(){
               //新旧客服判断
           if(window.customerServiceStatus == 1){  //新客服
                var obj = {};
                obj.host = this.$common.getHost();
                obj.clientCode = window.clientCode;
                obj.clientItem = window.childCode;
                obj.username = this.$common.getUser() && this.$common.getUser().username;
                obj.language = window.locale;
                obj.theme = window.theme;
                obj.projectImgUrl = window.projectImgUrl;
                obj.orgin = window.location.origin + "/activity";
                var str = JSON.stringify(obj);
                str = window.btoa(str);
                let url = location.origin + "/func" + "/customerService/pc?s=" +str;
                window.open(url, "_blank");
            }else{ //旧客服
                  const url = this.$common.getCustomerService();
                  window.open(url, "_blank");
            }
        },
        openPage(index) {
            if (index == 1) {
                this.$router.push('/agent');
            }else if(index == 0){
                this.onlineTalk();
            }
        }
    }
};
</script>
<style lang="less" scoped>
.footer {
  width: 1200px;
  // height: 374px;
  overflow: hidden;
  margin: 0 auto;
  padding-top: 93px;
  background: url(../../../../assets/image/gameImg/index/footer_img01.png) 50% 28px
    no-repeat;
  .list {
    overflow: hidden;
    .items {
      width: 240px;
      height: 40px;
      float: left;
      padding-top: 80px;
      &:nth-child(1){
        background-size:143px 48px;
      }
      .title {
        text-align: center;
        margin-bottom: 10px;
        color: #fff;
        font-size: 14px;
        line-height: 14px;
      }
      .title_en {
        text-align: center;
        margin-bottom: 10px;
        color: #646464;
        font-size: 12px;
        line-height: 14px;
      }
    }
  }
  .cooperation {
    width: 1200px;
    margin-top: 20px;
    padding-bottom: 27px;
    border-bottom: 1px solid #1a1a1a;
    overflow: hidden;
    display: flex;
    justify-content: center;
    .item {
      height: 31px;
      overflow: hidden;
      float: left;
      margin-right: 10px;
      cursor:pointer;
      &:hover {
        background-position: 50% 100%;
      }
    }
    .item1 {
      width: 82px;
      background: url(../../../../assets/image/gameImg/index/footer_co1.png) 50% 0
        no-repeat;
    }
    .item2 {
      width: 122px;
      background: url(../../../../assets/image/gameImg/index/footer_co2.png) 50% 0
        no-repeat;
    }
    .item3 {
      width: 118px;
      background: url(../../../../assets/image/gameImg/index/footer_co3.png) 50% 0
        no-repeat;
    }
    .item4 {
      width: 139px;
      background: url(../../../../assets/image/gameImg/index/footer_co4.png) 50% 0
        no-repeat;
    }
    .item5 {
      width: 90px;
      background: url(../../../../assets/image/gameImg/footer_co5.png) 50% 0
        no-repeat;
    }
    .item6 {
      width: 103px;
      background: url(../../../../assets/image/gameImg/footer_co6.png) 50% 0
        no-repeat;
    }
    .item7 {
      width: 70px;
      background: url(../../../../assets/image/gameImg/footer_co7.png) 50% 0
        no-repeat;
    }
    .item8 {
      width: 120px;
      background: url(../../../../assets/image/gameImg/footer_co8.png) 50% 0
        no-repeat;
    }
    .item9 {
      width: 90px;
      background: url(../../../../assets/image/gameImg/footer_co9.png) 50% 0
        no-repeat;
    }
    .item10 {
      width: 135px;
      background: url(../../../../assets/image/gameImg/footer_co10.png) 50% 0
        no-repeat;
    }
  }
  .article_list {
    width: 1200px;
    margin-top: 20px;
    text-align: center;
    color: #b4b4b4;
    span {
      display: inline-block;
      width: 100px;
      cursor: pointer;
      font: 14px/14px normal;
      &:nth-child(n + 2) {
        border-left: 1px solid #505050;
      }
      &:nth-child(2) {
        animation: changecolor 1s infinite;
      }
      &:hover {
        color: orange;
      }
    }
  }
  .anit_mark {
    width: 1200px;
    color: #b4b4b4;
    font-size: 14px;
    text-align: center;
    line-height: 14px;
    margin: 21px 0 25px;
  }
}
@keyframes changecolor {
  0% {
    color: white;
  }
  100% {
    color: rgb(226, 194, 125);
  }
}
</style>