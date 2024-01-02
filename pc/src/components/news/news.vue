<template>
    <div class="noticeInfo">
        <!-- 主体部分 -->
        <div class="noticeBody">
            <!-- 导航 -->
            <div class="noticeNav">
                <div
                    class="noticeNavBtn perInfoBtn u-flex-all cursorPoint"
                    :class="{ perNavActive: isNavActive == 1 }"
                    @click="switchMessage()"
                >
                    {{$t('通知')}}({{msgUnReadTotal }})
                    <div class="noticeNavBorder"></div>
                </div>
                <div
                    class="noticeNavBtn perPhoneBtn u-flex-all cursorPoint"
                    :class="{ perNavActive: isNavActive == 2 }"
                    @click="switchNotice()"
                >
                    {{$t('公告')}}({{noticeUnReadTotal }})
                    <div class="noticeNavBorder"></div>
                </div>
            </div>
            <!-- 内容 -->
            <Messages ref="message" v-if="isNavActive == 1" :curPage="curPage"></Messages>
            <Notices ref="notice" v-if="isNavActive == 2" :key="timeId"></Notices>
        </div>
    </div>
</template>
<script>
import Messages from "./messages/messages";
import Notices from "./notices/notices";
export default {
    name: "noticeInfo",
    data() {
        return {
            // show: false,
            dialogVisible: true,
            isShowClose: false,
            isNavActive: 1,
            curPage: 1, //每次打开后，请求第一页数据
            msgUnReadTotal: 0, //站内信未读总数
            noticeUnReadTotal: 0,
            timeId: ""
        };
    },
    created() {
        if (this.$route.query.isNavActive) {
            this.isNavActive = this.$route.query.isNavActive;
        }
        this.getNotices();
    },
    methods: {
        async getMessages() {
            var _this = this;
            var data = {
                currentPage: "",
                pageSize: "",
                receiverType: 0
            };
            var res = await _this.$http.post(_this.$api.message, data);
            if (res.code == 0) {
                _this.msgUnReadTotal = res.data.unreadCount;
                _this.$store.commit("msgUnReadTotalVuex", _this.msgUnReadTotal);
            } else {
                this.$message.error(res.msg);
            }
        },
        async getNotices() {
            var _this = this;
            var data = {
                createdAt: "",
                currentPage: "",
                pageSize: "",
                publishedAt: "",
                subject: "",
                type: ""
            };
            var res = await _this.$http.post(_this.$api.noticeList, data);

            if (res.code == 0) {
                _this.noticeUnReadTotal = res.data.unreadCount;
                _this.$store.commit(
                    "noticeUnReadTotalVuex",
                    _this.noticeUnReadTotal
                );
            } else {
                this.$message.error(res.msg);
            }
        },
        switchMessage() {
            this.isNavActive = 1;
            if (this.$refs.message) {
                this.$refs.message.currentPage = 1;
                this.$refs.message.getMessages("switchMessage");
            }
        },
        switchNotice() {
            this.isNavActive = 2;
            if (this.$refs.notice) {
                this.$refs.notice.currentPage = 1;
                this.$refs.notice.getNotices("switchNotice");
            }
        }
    },
    components: {
        Messages,
        Notices
    },
    watch: {
        "$store.state.unReadFlag"(n) {
            //实时更新公告信息的unread标志
            if (n == "message") {
                this.$parent.getMessages && this.$parent.getMessages();
                //重新获取站内信的未读总数量
                this.getMessages();
                this.$store.commit("updateUnRead", "");
            } else if (n == "notice") {
                this.$parent.getNotices && this.$parent.getNotices();
                //重新获取公告的未读总数量
                this.getNotices();
                this.$store.commit("updateUnRead", "");
            }
        },
        "$store.state.msgTotalFlag"(n) {
            //监听msgTotalFlag,实时更新通知的总数量
            if (n) {
                this.$parent.getMessages && this.$parent.getMessages();
                //重新获取站内信的未读总数量
                this.getMessages();
                this.$store.commit("updateMsgTotal", false);
            }
        }
    }
};
</script>

<style scoped>
.perNavActive {
    color: #54b9ff;
}
.noticeInfo {
    position: relative;
}
.noticeDialog {
    box-sizing: border-box;
    position: relative;
}

.noticeHeader {
    /* height: 0.55rem; */
    padding: 0.32rem 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
}
.noticeHeader .img {
    width: 0.4rem;
    height: 0.47rem;
}
.noticeHeader .noticeTitle {
    font-size: 24px;
}
.noticeBody {
    width: 100%;
    padding-top: 60px;
    height: 7.5rem;
    /* padding: 0rem 0.5rem 0.4rem 0.7rem; */
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-direction: column;
}
.noticeNav {
    position: absolute;
    left: 0;
    top: 0;
    box-sizing: border-box;
    width: 100%;
    background-color: #292829;
    padding: 0 480px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
    color: #fff;
}
.noticeNavBtn {
    padding: 0.16rem 0 0.08rem 0;
    font-size: 18px;
    border-bottom: 0.03rem solid transparent;
    position: relative;
}
.noticeNavBorder {
    position: absolute;
    bottom: -0.03rem;
    left: 0;
    width: 0;
    height: 0.03rem;
    background-color: #54b9ff;
    transition: all 0.5s;
}
.noticeNavBtn:hover .noticeNavBorder {
    width: 100%;
}
</style>
<style>
.noticeDialog .el-dialog__header {
    padding: 0 !important;
}

.noticeDialog .el-dialog__body {
    padding: 0 !important;
}
.noticeInfo .el-dialog__wrapper {
    overflow: hidden;
}
</style>
