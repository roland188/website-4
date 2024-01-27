<template>
  <div class="footer">
    <div class="title_items">
      <div class="list">
        <div class="items"
          v-for="(item,index) in list"
          :key="index">
          <span class="title">{{item.name}}</span>
          <label v-if="item.number">{{ item.number }}</label>
          <span class="line">|</span>
        </div>
      </div>
      <div class="rightIcon" :class="{'top':isShowMenu}" @click="isShowMenu = !isShowMenu">{{ $t('网站地图') }} |</div>
    </div>
    <div class="menu_box" :class="isShowMenu ? 'menu_show' : 'menu_hideen'">
      <div class="guildM">
        <div class="guilListT">
          <div class="gameMenuList" v-for="(item,i) in gameMenuList" :key="i">
            <div class="game_title">
              <img loading="lazy" class="img" :src="item.menuIconActivePc?($config.imgHost+item.menuIconActivePc) : item.imgUrl?($config.imgHost+item.menuIconActiveApp):''">
              <span>{{ item.name }}</span>
            </div>
            <div class="gameli" v-if="i <= 10" v-for="(li,i) in item.children" :key="i" @click="jump(li)">
              <span>{{ li.nameEn }}</span>
            </div>
          </div>
        </div>
        <div class="rightMobile">
          <div id="qrcode0" ref="qrcode0"></div>
          <div class="mobile"><i class="icon_mobile"></i>{{ $t('手机版') }}</div>
          <div class="text">{{ $t('每次都享受及时的投注') }}</div>
        </div>
      </div>
    </div>
    <div class="fotter-bg">
      <div class="brandImg"></div>
    </div>
  </div>
</template>
<script>
import QRCode from '@keeex/qrcodejs-kx'
import api from "@/utils/api"; //接口名字
export default {
    'name': 'footers',
    data() {
        return {
            projectImgUrl: window.projectImgUrl,
            numVer: window.numVer,
            isShowMenu: true,
            isShowRegister: false,
            list: [
                {
                    name: this.$t('Giới thiệu'),
                },
                {
                    name: this.$t('Trợ giúp'),
                },
                {
                    name: this.$t('Điều khoản'),
                },
                {
                    name: this.$t('Hỗ trợ'),
                },
                {
                    name: this.$t('Link dự bị'),
                },
                // {
                //     name: this.$t('Gọi điện hỗ trợ：'),
                //     number: ' +63279082890'
                // },
            ],
            gameMenuList:[],
            username:'',
            tenantId:'',
            uid:'',
            isShow: true,
        };
    },
    mounted() {
      // 赋值 总列表
      this.gameMenuList = JSON.parse(localStorage.getItem("ALLMENUE_EXCEPT_FISH"));
      this.codeList()
    },
    methods: {
    // 在线客服
        onlineTalk(){
               //新旧客服判断
           if(window.customerServiceStatus == 1){  //新客服
                var obj = {};
                obj.host = this.$common.getHost();
                obj.clientCode = window.clientCode;
                obj.clientItem = window.childCode;
                obj.username = this.$common.getUser() && this.$common.getUser().username;
                obj.language = 'vi';
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
        },
        
        qrcode(qrcodeId, qrcode) {
          const icon = require("@/assets/image/pubilc/" + window.projectImgUrl + 'Logo.png');
          console.log(icon,'icon')
            new QRCode(qrcodeId, {
                width: 168, // 设置宽度，单位像素
                height: 168, // 设置高度，单位像素
                text: qrcode, // 设置二维码内容或跳转地址
                background: "#ffffff", //二维码的后景色
                src: icon //二维码中间的图片
            })
        },
        //转换二维码
        codeList() {
            let that = this
            this.sessData = JSON.parse(sessionStorage.getItem('inviteCode'))
            let url = window.location.origin + '/downloadUrl?'
            if(window.projectImgUrl === 'jramjs' || window.projectImgUrl === 'jrwnsr') {
                url += 'code=' + window.projectImgUrl
            } else {
                url += 'code=' + window.childCode
            }
            if(this.$config.iosDownloadUrl) {
              url += '&ios=' + encodeURIComponent(this.$config.iosDownloadUrl)
            }
            if(this.$config.androidDownloadUrl) {
              url += '&android=' + encodeURIComponent(this.$config.androidDownloadUrl)
            }
            if (this.sessData) {
              url += '&agentCode=' + this.sessData
            }
            if (this.$refs.qrcode0) {
                that.qrcode("qrcode0", url);
            }
        },
        jump(val) {
          if (val.type == 2) {
            this.getToken(val, 2);
          } else {
            if (val.nameEn == "fishing") {
              val.ids = "100010001";
            }
            let { parentId: pid, ids: id, type, imgUrlOne } = val;
            if (pid == 1) {
              this.$router.push({ path: "/slots", query: { pid, id, type } });
            }else if (pid == 7) {
              this.$router.push({path: "/slot", query: { pid, id: val.ids, type},});
            // this.getToken(val,2)
            } else if (pid === 3) {
              this.$router.push({
                path: "/chess",
                query: { pid, id, type, imgUrlOne },
              });
            }
          }
        },
        // 进入游戏
      getToken: async function (req, index) {
        // return
        let self = this;
        var issafariBrowser =
          /Safari/.test(navigator.userAgent) &&
          !/Chrome/.test(navigator.userAgent);

        if (!self.$common.getUser()) {
          // self.showLogin = true;
          // self.$message.warning(this.$t("请登录"));
          self.$common.openLogin()
          return;
        }
        self.tenantId = self.$common.getUser().tenant_id;
        self.username = self.$common.getUser().username;
        self.uid = self.$common.getUser().user_id;
        let datas = {
          tenantId: self.tenantId,
          username: self.username,
          gameId: index == 2 ? req.ids : req.id,
          clientIp: self.$config.clientIp,
          memberId: self.uid,
          terminalType: 1,
        };
        self.$common.setGameRequestData(datas);

        const res = await self.$http.post(api.getToken, datas, true);
        if (res.code == 0) {
          self.gameUrl = res.data;
          if (req.openMode === 1) {
            // if(issafariBrowser) {
            //  self.winOpen.location.href = self.gameUrl;
            // }else{
            window.open(self.gameUrl);
            // }
          } else {
            window.open(self.gameUrl);
          }
        } else {
          if (req.openMode === 1) {
            window.open("/error.html?type=1");
            // self.winOpen.location.href = '/error.html?type=1';
          }

          if (req.status === 0) {
            self.$message.error(this.$t("维护中"));
          } else {
            self.$message.error(this.$t("进入游戏失败，请稍后重试"));
          }
        }
      },
    }
};
</script>
<style lang="less" scoped>
.footer {
  width: 100%;
  // width: 1200px;
  // height: 374px;
  overflow: hidden;
  margin: 0 auto;
  background: #1d1d1d;;
  .list {
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    .items {
      width: auto;
      padding: 0 5px;
      &:nth-child(4),&:nth-child(5),&:nth-child(4):hover,&:nth-child(5):hover{
        .title{
          color: #ffde00;
        }
      }
      label{
        color: #fff;
      }
      &:last-child{
        .title{
          cursor: inherit;
        }
        .line{
          display: none;
        }
        &:hover{
          .title {
            color: #aaa;
          }
        }
      }
      .line{
        font-size: 11px;
        margin-left: 5px;
      }
      &:hover{
      .title {
        color: #fff;
      }

      }
      .title {
        text-align: center;
        color: #aaa;
        cursor: pointer;
        font-size: 13px;
      }
    }
  }
  .rightIcon{
    padding-right: 15px;
    cursor: pointer;
    position: relative;
    &::after{
      content: '';
      position: absolute;
      right: -5px;
      top: 50%;
      color: #aaa;
      width: 0;
      height: 0;
      border: 7px solid;
      border-color:#1675a3  transparent transparent ;
      float: left;
    }
  }
  .top{
    &::after{
      top: 0% !important;
      border-color: transparent transparent #1675a3;
    }
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
.title_items{
  width: 1000px;
  color: #aaa;
  margin: 40px auto;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .list{
  }
}
.fotter-bg{
  padding: 22px 0px;
  .brandImg{
    box-sizing: content-box;
    // background: url('~@/assets/image/qqImg/icon_indexImg.png') no-repeat left -858px;
    width: 1000px;
    margin: 0 auto;
    height: 45px;
  }
}
.menu_box{
  width: 100%;
  background-color: #777;
  min-width: 1000px;
  text-align: center;
  overflow: hidden;
  .guildM{
    max-width: 1200px;
    min-width: 1000px;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
  }
  .guilListT{
    flex: 1;
    display: flex;
    justify-content: space-around;
    .gameMenuList{
      .game_title{
        color: #fff;
        line-height: 30px;
        text-align: center;
        border-bottom: 1px solid #ccc;
        position: relative;
        padding-left: 25px;
      }
    }
  .gameli{
      padding-left:25px;
      line-height: 15px;
      margin: 5px 0;
      cursor: pointer;
      font-size: 12px;
      color: #ccc;
    }
  }
  .rightMobile{
    width: 110px;
    text-align: center;
    color: #ccc;
    margin: 20px 10px 20px 0;
    .mobile{
      display: flex;
      align-items: center;
      margin: 5px auto;
      padding: 5px 0;
      font-size: 12px;
      border-bottom: 1px solid #ccc;
      justify-content: flex-start;
    }
    .icon_mobile{
      width: 23px;
      margin-right: 7px;
      height: 21px;
      display: inline-block;
      // background: url('~@/assets/image/qqImg/icon_indexImg.png') no-repeat center left;
      background-position: -195px -793px;
    }
  }
}
.menu_show{
  display: block;
  animation: topShow 1s both;
}
.menu_hideen{
  animation: topHidden 1s both;
}
@keyframes topShow {
  0%{
    height:0;
  }
  100%{
    height:296px;
  }
}
@keyframes topHidden {
  0%{
    height:296px;
  }
  100%{
    height:0;
  }
}
</style>