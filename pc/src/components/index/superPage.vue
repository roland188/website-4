<template>
    <div class="superPage">
        <div class="first-jp-wrap">
            <div class="casino-jp-wrap" v-for='(item, index) in list' :key='index'>
                <div class="casino-jp-top" :class='"jp-top0" + index'>
                    <div class="ele-jackpot-wrap">
                        <div class="ele-jackpot ele-jackpot-explain">
                            <div class="js-ele-JP1">{{ item.showNumber }}</div>
                        </div>
                    </div>
                </div>
                <div class="jp-list-wrap clearfix">
                    <div class="jp-list" v-for='(item1, index1) in item.data' :key='index1' @click="transgo(item)"><a
                            class="jp-item" href="javascript:void(0);">{{ item1.name }}</a></div>
                </div>
            </div>
            <div class="first-bottom-titile"></div>
            <div class="secondsShow">
                <div class="item" v-for="(item, index) in secondsList" :key="index">{{ item }}</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            list: [
                {
                    showNumber: '',
                    numner: 2010309113,
                    router: {
                        name: '/slots',
                        pid: '1',
                        id: '34',
                        type: '1'
                    },
                    data: [
                    // {
                    //     name: this.$t('野蛮战国')
                    // },
                    // {
                    //     name: this.$t('惑星战记')
                    // },
                    // {
                    //     name: this.$t('外形战记')
                    // },
                    // {
                    //     name: this.$t('外星争霸')
                    // },
                    {
                        name: this.$t('传统')
                    },
                    {
                        name: this.$t('丛林')
                    },
                    // {
                    //     name: this.$t('水果乐园')
                    // },
                    {
                        name: this.$t('功夫龙')
                    },
                    {
                        name: this.$t('幸运财神')
                    },
                    // {
                    //     name: this.$t('鱼虾蟹')
                    // },
                    ]
                }, {
                    showNumber: '',
                    router: {
                        name: '/slots',
                        pid: '1',
                        id: '70',
                        type: '1'
                    },
                    numner: 2624687343,
                    data: [
                        {
                            name: this.$t('森林之王')
                        },
                        {
                            name: this.$t('暑假时光')
                        },
                        // {
                        //     name: this.$t('追寻太阳')
                        // },
                        {
                            name: this.$t('马戏团')
                        },
                        // {
                        //     name: this.$t('太阳征程')
                        // },
                        // {
                        //     name: this.$t('增强马力')
                        // },
                        // {
                        //     name: this.$t('金龙财宝')
                        // },
                        {
                            name: this.$t('必胜')
                        },
                        // {
                        //     name: this.$t('大丰收')
                        // },
                        // {
                        //     name: this.$t('狩猎游戏')
                        // },
                    ]
                }, {
                    showNumber: '',
                    router: {
                        name: '/slots',
                        pid: '1',
                        id: '27',
                        type: '1'
                    },
                    numner: 158463832,
                    data: [
                        {
                            name: this.$t('芝麻开门')
                        },
                        {
                            name: this.$t('三倍金刚')
                        },
                        {
                            name: this.$t('王牌特工')
                        },
                        // {
                        //     name: this.$t('东方神兽')
                        // },
                        // {
                        //     name: this.$t('台湾黑熊')
                        // },
                        // {
                        //     name: this.$t('开运夺宝')
                        // },
                        {
                            name: this.$t('超级牛B')
                        },
                        // {
                        //     name: this.$t('飞鸟派对')
                        // },
                        // {
                        //     name: this.$t('变脸')
                        // },
                        // {
                        //     name: this.$t('金鸡报喜')
                        // },
                    ]
                }, {
                    router: {
                        name: '/slots',
                        pid: '1',
                        id: '6',
                        type: '1'
                    },
                    numner: 181891874,
                    data: [
                        {
                            name: this.$t('跳高高')
                        },
                        {
                            name: this.$t('飞起来')
                        },
                        // {
                        //     name: this.$t('鸿福齐天')
                        // },
                        // {
                        //     name: this.$t('皇金渔场')
                        // },
                        {
                            name: this.$t('宙斯')
                        },
                        {
                            name: this.$t('武圣')
                        },
                        // {
                        //     name: this.$t('跳过来')
                        // },
                        // {
                        //     name: this.$t('偷金妹子')
                        // },
                        // {
                        //     name: this.$t('发财神')
                        // },
                        // {
                        //     name: this.$t('再喵一个')
                        // },
                    ]
                }
            ],
            secondsList: [15, 23, 80, 58]
        }
    },
    mounted() {
        this.secondsList[0] = Math.floor(Math.random(0, 1) * 50 + 10);
        this.secondsList[1] = Math.floor(Math.random(0, 1) * 50 + 10);
        // 随机在原本的基数上加一个数
        this.list.forEach(v => {
            v.numner += Math.floor(Math.random(0, 1) * 100000)
        })
        var timer = setInterval(this.addNum, 50)
    },
    methods: {
        // 跳转对应列表
        transgo(val) {
            if (window.projectImgUrl === 'funw' || window.projectImgUrl === 'bqty') return
            this.$router.push({
                path: '/slots',
                query: {
                    pid: 1,
                    id: val.router.id,
                    type: 1
                }
            })
        },
        // 数字累加
        addNum() {
            this.list.forEach(v => {
                v.showNumber = this.transform(v.numner += 1)
            })
        },
        // 正则加逗号
        transform(num) {
            return num.toString().replace(/\B(?=(\d{3})+$)/g, ",")
        }
    }
}
</script>
<style scoped>
.first-bottom-titile {
    float: left;
    width: 1200px;
    height: 60px;
    background: url('../../assets/image/gameImg/index/container_img05.png') 50% 0 no-repeat;
}

.jp-list-wrap {
    margin: 74px 0 0 42px;
    width: 200px;
}

.jp-list {
    float: left;
    width: 50%;
    line-height: 24px;
    text-align: center;
}

.jp-item {
    color: #fff;
    text-decoration: none;
}

.jp-item:hover {
    color: #e9c885;
}

.superPage {
    background: #000 url('../../assets/image/gameImg/index/container_img04.png') 50% 40px no-repeat;
    border-top: 1px solid #1e1e1e;
    padding-top: 137px;
}

.first-jp-wrap {
    position: relative;
    margin: 0 auto;
    padding-bottom: 121px;
    width: 1200px;
    overflow: hidden;
    background: url('../../assets/image/gameImg/index/container_img07.png') 50% 436px no-repeat;
}

.secondsShow {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 1200px;
    height: 121px;
    /* background-color: red;    */
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.secondsShow .item {
    width: 210px;
    height: 121px;
    /* background-color: green; */
    /* opacity: .5; */
    background-image: -webkit-linear-gradient(-77deg, gold 0%, gold 20%, white 80%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font: 40px/121px bold;
    text-align: right;
    box-sizing: border-box;
    padding-right: 27px;
    font-family: "Microsoft YaHei" ! important;
}

.casino-jp-wrap {
    float: left;
    margin: 0 26px 39px 0;
    width: 280px;
    height: 301px;
    background: url('../../assets/image/gameImg/index/jp_bg.png') 50% 0 no-repeat;
}

.first-jp-wrap .casino-jp-wrap:nth-child(4) {
    margin-right: 0 !important;
}

.casino-jp-top.jp-top00 {
    background: url('../../assets/image/gameImg/index/jp_bb_img.png') 50% 8px no-repeat;
    min-height: 50px;
}

.casino-jp-top.jp-top01 {
    background: url('../../assets/image/gameImg/index/jp_mg_img.png') 50% 8px no-repeat;
    min-height: 50px;
}

.casino-jp-top.jp-top02 {
    background: url('../../assets/image/gameImg/index/jp_jdb_img.png') 50% 8px no-repeat;
    min-height: 50px;
}

.casino-jp-top.jp-top03 {
    background: url('../../assets/image/gameImg/index/jp_cq9_img.png') 50% 8px no-repeat;
    min-height: 50px;
}

.casino-jp-top {
    padding: 42px 14px 0;
    color: #fff;
    font-size: 22px;
    font-weight: 700;
    line-height: 50px;
    text-align: center;
}

.first-jp-wrap .ele-jackpot-wrap {
    text-align: center;
    font-size: 22px;
}

.ele-jackpot-wrap {
    position: relative;
    width: 252px;
    height: 50px;
    line-height: 50px;
    color: #FFF;
    text-align: right;
    font-size: 25px;
    font-weight: bold;
    cursor: pointer;
}

.first-jp-wrap .js-ele-JP1 {
    position: relative;
    letter-spacing: 0;
    text-align: center;
}</style>