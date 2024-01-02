<template>
  <div class="phoneList">
    <!-- 设备管理-->
    <div class="device-wrap">
        <div class="sub-tips">{{$t('最近登录设备：你可以删除列表中的设备，删除后在该设备登录游戏时需要进行身份验证。')}}</div>
        <div class="list-wrap-column">
        <div class="card-col" v-for="item in phoneList" :key="item.id">
            <div class="left-info">
            <div class="name">{{ item.lastLoginEquipment }}{{$t('浏览器')}}</div>
            <div class="info-time-wrap">
                <div>
                    {{$t('ip:')}} {{ item.sourceClientIp }}
                </div>
                <div style="margin-left:50px;">
                   {{$t('最近登录：')}} {{ $common.conversionTime(item.updatedAt)}}
                </div>
            </div>
            </div>
            <div class="right-delete" @click="deletePhone(item.id)">{{$t('删除')}}</div>
        </div>
        </div>
    </div>
    <div class="bottom-tips" v-if="this.phoneList.length > 0">{{$t('最多可以绑定10个常用设备')}}</div>
  </div>
</template>
<script>
export default {
    name: 'Equipment',
    data() {
        return {
            phoneList:[],
        };
    },
    props: {
    // show: Boolean,
    // userData: Object //用户信息
    },
    created() {
      if (this.$common.getUser()) {
        this.userId = this.$common.getUser().user_id;
      }
    },
    methods: {
        deletePhone(id) {
          if(id) {
            this.$http.get(this.$api.deletePhoneid,id).then(res => {
              if(res.code == 0) {
                this.$message.success(this.$t("删除成功"));
                this._getPhonelist()
              }
            })
          }
        },
        _getPhonelist() {
          let fingerprint = sessionStorage.getItem('fingerprint');
				  fingerprint? '' :  fingerprint = "123"
          this.$http.get(this.$api.getPhonelist,fingerprint).then(res => {
            if(res.code == 0) {
              this.phoneList = res.data
            }
          })
        },
    },
    mounted(){
        this._getPhonelist()
    },
    'watch': {
    }
};
</script>
<style scoped lang="scss">
.phoneList{
    margin: 20px 60px;
    .list-wrap-column{
    padding-top: 15px;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    .card-col{
        height: 50px;
        border-radius: 7px;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        .left-info{
        height: 100%;
        background: #eeeeee;
        display: flex;
        justify-content:flex-start;
        padding: 0 10px;
        margin-bottom: 10px;
        align-items: center;
        width: calc(100% - 80px);
        .name{
            font-size: 14px;
            font-weight: 700;
        }
        .info-time-wrap{
            flex: 1;
            font-size: 12px;
            color: #9a9a9a;
            text-align: left;
            line-height: 20px;
            margin:0 50px;
            display: flex;
            justify-content:space-around;
            .am{
                margin-left: 0 5px;
            }
        }
        }
        .right-delete{
        cursor: pointer;
        width: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #FFFFFF;
        font-size: 12px;
        background: #f51c1c;
        }
    }

    }
    .bottom-tips{
    padding-top: 0.32rem;
    }
}
</style>