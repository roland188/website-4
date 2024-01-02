<template>
    <div class="barrages-drop">
        <vue-baberrage
            :isShow="barrageIsShow"
            :barrageList="barrageList"
            :throttleGap="throttleGap"
            :loop="barrageLoop"
            :lanesCount="lanesCount"
            style="padding-top: 10px"
        ></vue-baberrage>
    </div>
</template>

<script>
import { MESSAGE_TYPE } from "vue-baberrage";
export default {
    data() {
        return {
            msg: "Hello vue-baberrage",
            barrageIsShow: true,
            currentId: 0,
            barrageLoop: false,
            barrageList: [],
            throttleGap: 2000,
            lanesCount: 1,
            list: []
        };
    },
    props: {
        barragesList: {
            type: Array,
            default: () => []  
        }
    },
    methods: {
        addToList() {
            this.contactList();
            var time = Math.ceil(this.list.length / 4) * 3 * 1000;
            setInterval(() => {
                this.barrageList = [];
                this.contactList();
            }, time);
        },
        contactList() {
            this.list.forEach((v, index) => {
                //定位随机
                var fixedStyle = "";
                switch ((index % 4) + 1) {
                    case 1:
                        fixedStyle = "style4";
                        break;
                    case 2:
                        fixedStyle = "style3";
                        break;
                    case 3:
                        fixedStyle = "style2";
                        break;
                    case 4:
                        fixedStyle = "style1";
                        break;
                }
                //颜色随机（2个）
                var randomNum = Math.floor(Math.random() * 2 + 1);
                var bgStyle = randomNum === 1 ? "red" : "green";
                var barrageStyle = fixedStyle + " " + bgStyle;
                //时间随机
                var time = 0;
                var randomTime = Math.floor(Math.random() * 4 + 1);
                switch (randomTime) {
                    case 1:
                        time = 9;
                        break;
                    case 2:
                        time = 9;
                        break;
                    case 3:
                        time = 7;
                        break;
                    case 4:
                        time = 7;
                        break;
                }

                this.barrageList.push({
                    avatar: this.$config.getImgUrl(v.imgUrl),
                    msg: v.promptMsg,
                    time: time,
                    barrageStyle: barrageStyle,
                    type: MESSAGE_TYPE.NORMAL
                });
            }, 0);
        }
    },
    watch: {
        barragesList: {
            handler(n) {
                if (n) {
                    this.list = n;
                    this.addToList();
                }
            },
            deep: true
        }
    }
};
</script>

<style lang='scss'>
.normal {
    padding: 0 !important;
    font-size: 12px !important;
    line-height: 28px !important;
    position: relative;
    .baberrage-avatar {
        position: absolute;
        top: -10px;
        left: 5px;
        width: 48px !important;
        height: 48px !important;
        border-radius: 0 !important;

        img {
            width: 90% !important;
            height: 90% !important;
            // border-radius: 50%;
        }
    }
    .baberrage-msg {
        line-height: 28px !important;
        padding: 0 2em 0 60px !important;
    }
}
//
.style1 {
    top: 0px;
}
.style2 {
    top: 30px;
}
.style3 {
    top: 60px;
}
.style4 {
    top: 90px;
}
.red {
    .normal {
        background-color: #c54064 !important;
    }
}
.green {
    .normal {
        background-color: #50858b !important;
    }
}
.barrages-drop {
    position: absolute;
    width: 100%;
    top: 0px;
    height: 200px;
    z-index: 99;
}
</style>