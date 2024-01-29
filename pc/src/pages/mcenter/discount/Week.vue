<template>
    <div class="week-award-layout">
        <commonHeader :title="dataList.name" />
        <Marquee :text="dataList.marquee" />
        <!-- 周 -->

        <div v-if="actType==0">
              <!-- 本周 -->
            <div class="week-container this-week-container">
                <div class="title">
                    <span class="flag"></span>
                    <span class="name">{{$t('本周周勤')}}</span>
                </div>
                <div class="content">
                    <!-- <div class="total-data">
                        <div style="margin-right:10px;">
                            {{$t('本周已出勤')}}
                            <span>{{thisWeekSignData.totalSignCount || 0}}</span>
                            {{$t('天')}}！
                        </div>
                        <div>
                            {{$t('累计有效投注额')}}
                            <span>{{filterNumber(thisWeekSignData.totalBetAmountValid)}}</span>
                            {{$t('元')}}
                        </div>
                    </div> -->
                    <div class="per-day-container">
                        <div class="line"></div>
                        <div
                            v-for="(item,i) in thisWeekSignData.signRecordList"
                            :key="i"
                            class="per-day-item"
                        >
                            <div class="per-day-o">
                                <img v-show="!item.status" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6N0I4NEI0M0M2MkRFMTFFNzlGNjI4NDZDQ0Y3MkY2Q0MiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6N0I4NEI0M0Q2MkRFMTFFNzlGNjI4NDZDQ0Y3MkY2Q0MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3Qjg0QjQzQTYyREUxMUU3OUY2Mjg0NkNDRjcyRjZDQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3Qjg0QjQzQjYyREUxMUU3OUY2Mjg0NkNDRjcyRjZDQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pt1b+qEAAARHSURBVHja1FlPSBRRGH8z49/VNcRYvZVgC2p1EfEm0UG0EEUqiCCwS0I387CHTnYRTDtEYSchyKTAPwQpHiK6CXbJlgUVJPCQoskq6rrr+vp+w3syjjO7s7o7uR88dlZn3u8337/3fd8yliWiuLQP/19EFQfXZoL8LMTVUxA0LlUsLcmS9x17fmlpKSMaVRws457c8JlsJZWcFF7GrEUlEAiUdHR0tBQVFTXm5ORcV1X1kqIoJTo7zrcODw9/Hxwc/NzZ2fk+NjY21dfXtyWIHYrl2I8VhyRVI8mJiYkrJE/z8vLuEjGPE40Q8d1oNPppcXFxoL29fdFAlhtI89MQPeGLnZ2dRd3d3c8KCwuf0Pc83OTxePSVn5/PcnNzGWlVf5i0yWKxGNvf32e7u7v6EhLd29t7Mzg4+Hx4eHjHRNjWFRQHmtSDZXx8vKqmpmZE07Rr+IfX62WlpaU6OScC0pubm2x7e1v/Ho/H50Oh0AOh3bjJHXgqRI9IzszM1FVWVo6RmX0FBQWsrKyM4fM0EolE2MbGhv5J7rC2vLzc0dTU9MNE1hFRo7k18kd/bW3tVyJ5kYKGlZeXM7o+U/Imgmx1dZVRkOF6PRgM3iTNLhjInnABLYFfal1dXd7W1tbP5HeXi4uLWUVFxZlJ6iC0B/aDO9DykIUaKTuMzM3NxZymK0WQh+MVzM/Pv6SkzFdWVjgFB0+3YE/sDQxgAVNga2Zrq3ZRjuAR0a37ZDo0aaVZ7A0BFtKexQlme4TqN/j9/h68HaL7tIHjRLA3MIBFubnHTNCOqH5Tb29vCZI5/oAUlGmRGIR5B9hWZC1N39zc3IITB4ncaZ48iwADWMAEdiLTHzvPKQ3dkKeOWyKxBPaJIsfSR6nAuIoLHItuicQS2Al99OgtKG9WSpO4JRJLYjuKehKveMg1ohJLYCeN+nMrqvVRzLdlqeaWSCyBzRMRPSoE6KFlWZq5JRJLYpsLE0uNUoHwCxcoet0SiSWwbTV6rBGj8usbvhiq8oyLxBLY3MTJ0vR8enp6Cj0OHnbD/MAAFmHuAduqLVEs8qjei1Mx+5aS8EMUDD6fL6NE19bW9BaFzP+OivTHooCOG8mqNuMXTt3iC7wsNkDbkCnB3qKPilFdOmDX4FmaHsGHpou6xdf4B3octA/pFuyJvSHoTNva2hbsOlIt0UyJNpptaGi4TSnDBz9C+5Buk8M3qSMNDg0NPZqdnY1kfXOX1e2y5QAC/Ux1dfUHTdNq0zSACIZCoftOBxCa07nU6OjoXzLV+/r6+nwiVxeNRrVwOKyfKDin4Q5yGUc6MC8Irq+vM3pG50yB86q/v78zEAj8sdBiSiOdhEOyyclJf1VVVTf1OPeIWKFDv4wQ0Y9IQYboTsuQzOnY8ZZp7HhBEAubxo5fLMaOPJkms26Qm2qeUWy0rCSZ4XMb7fFUgc/9jw1Z8/NN1sg/AQYAKyvHmmpQqv0AAAAASUVORK5CYII=" alt="">
                                <img v-show="item.status" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkU5OTUyNDc2MkRFMTFFN0EyNzNBNEM0MTc5QTlBRjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkU5OTUyNDg2MkRFMTFFN0EyNzNBNEM0MTc5QTlBRjEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCRTk5NTI0NTYyREUxMUU3QTI3M0E0QzQxNzlBOUFGMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCRTk5NTI0NjYyREUxMUU3QTI3M0E0QzQxNzlBOUFGMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnN2WC0AAARYSURBVHja1JlLaBNRFIbvTB5NjEpTXSmIC61SH0ufKFhFCoqmKrgoom6sG58LwY1gBV1VoYK23YiLCoq4EB9Vq1sRfCCIqKi7uhBto9jaJJOO55Z/xpObzCPJNNZbftJOMud8OXPvPfecaqkvHeJ/GOEq79cgUeLVLPFq1hJUY9LZq+4AOg6Z7LVs6HAFgBZUCAqza7oCOs5kkPLQuAIdCKgKGIYikPV3yAE0D0ipHGT97Rs47BMyxOCiUB0pSdpIWklaTJpDmo57f5G+kN6RnpEek4ZJGVIWyrFICzfYsAekziDroDhpEamd1EKKOdyfhJaQdpLGSP2kHtJ70m9AZ+Arz6LrG5RDRgATh+PjpDZcL2dIGynSFtI1UicirONLCLb4imB1j8cdAWACkblJ2lcBJB/y3r2wtRS247geUrY8T1DrccsoTMMclFFoDHAPl7b6YHsafIUZrCuoxla2NR+bSL2khklIOA2w3QRfdWy70/yARnCTNNRFqp/E7ChtX4SvGHy7gvJoRvEN5cJZWINUvgC+YvBdFFU30Eas7lqNNmx7vkBD7LEfDODQUm46b4fviLqodId9swGbeSBDo5/D9dtFx6w9ok5z3dla4DuipmRd2TutvN3sknHKGjqZPUqQG+LLxbLofHEyudsrKTQzDk0FFcqhY3VQkEfqU2J9fJl97Ws+7XXbauVEVpBC1eNbYzCRTIl18aX2tYHRV+Lyjzt+EkFIPTbqJRKA1Fw3S1EtLE4kd4n9Mzc7Qh6rby2AfESQlwjSx+FzrhpNNaJcCTdLpxraxJLoPPtkduXnI/u9ENk/lmwVa2NNDPIlRfKu3yN9ogRPyVzvOQaNb/bv2xKrxJ4ZG23I49VBeh6cTUUjbmmz+8c9EaNtxlokO6avmZgOs0MzxarYYvtzDwmyu3zIkRI8RRu6VRoMuoGa9NOVvk1wERtsa2JFwWceEGRPZZEcZBxFuZ4XYvKk/cHLWp4+2pm+JV5lPhW992D0RaWQAr7VArBgjvJq8akfi4aZF+eGb4jXmc/2tf4JyHvVzMmnSuFXFFGTVYdPlPLAceRMQ5wdvj4R2fujz0VvdZBj8G1xFM1RXtrKynAIhVjKj/UswXYMXQsimfXDd04t9vSCNfIXNINq0ajh6cnAaT/DQM1SxzyTzdEsStq+GoL2oQeQZXPUF6icL+dJH2sAKX1cgE9PUA6bw01yvhwipScRMg0f3+EzV6q2dwI1MFdkN+Mt6QCggx5DsP2WdU4MP6B8URn4hqPoHbUFPA0+wuYz+MiwPpSvTomp7AC/kX/fyLROulrlbmDAxg7YHIGPLIM0/faeTCXX8ilxmnQdj6yljJJFRuw+tqB3eFpjSiTLbpIJhw6xNSVeow4/Q9qEtswiHHp523EQ25x8vAMebUez0rYj71fmFdAsW2wyJd34141c9azKDy65qdYadwLOAywrptg/G1RgC2LK/vvGCXpSxx8BBgD/E7v9EIvXqwAAAABJRU5ErkJggg==" alt="">
                            </div>

                            <div>{{weekTypeHandler(item.weekType)}}</div>
                            <div class="money">{{filterNumber(item.betAmountValid)}}</div>
                        </div>
                    </div>
                </div>
            </div>
                <!-- 上周 -->
            <div class="week-container last-week-container">
                <div class="title">
                    <span class="flag"></span>
                    <span class="name">{{$t('本周出勤统计')}}</span>
                    <!-- <span
                        class="record cursorPoint"
                        @click="openDialog()"
                    >{{$t('【查看上周记录】')}}</span> -->
                </div>
                <div class="content">
                    <div class="item">
                        <div class="first-row">
                            <span class="num">{{thisWeekSignData.totalSignCount || 0}}</span>
                          {{$t('天')}}
                        </div>
                        <div>{{$t('本期累计出勤天数')}}</div>
                    </div>
                    <div class="item">
                        <div class="first-row">
                            <span class="num">{{filterNumber(thisWeekSignData.totalBetAmountValid)}}</span>
                          {{$t('元')}}
                        </div>
                        <div>{{$t('本期累计的有效投注额')}}</div>
                    </div>
                    <div class="item">
                        <div class="first-row">
                            <span class="num">{{filterNumber(thisWeekSignData.amount)}}</span>
                          {{$t('元')}}
                        </div>
                        <div>
                          {{$t('出勤礼金')}}
                            <el-popover
                                placement="bottom"
                                width="553"
                                trigger="hover"
                                popper-class="week-gift-popover"
                            >
                                <div class="title">{{$t('周勤奖励礼金计算')}}</div>
                                <el-table :data="rewardRatios">
                                    <el-table-column
                                        width="200"
                                        :label="$t('本期出勤天数（单日投注≥')+daylyMinBet+'）'"
                                    >
                                        <template
                                            slot-scope="scope"
                                        >{{$t('最低')}}{{ scope.row.weekMinSignDays}}{{$t('天')}}</template>
                                    </el-table-column>
                                    <el-table-column
                                        width="200"
                                        :label="$t('周有效投注额（元）')"
                                    >
                                        <template slot-scope="scope">
                                            <div>≥ {{ scope.row.weekMinBet}}</div>
                                            <!-- <div
                                                v-if="scope.row.weekMaxBet"
                                            >{{ scope.row.weekMinBet}}{{$t('至')}}{{ scope.row.weekMaxBet}}</div>
                                            <div
                                                v-else
                                            >{{$t('最低')}}{{ scope.row.weekMinBet}}</div> -->
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        width="150"
                                        property="amount"
                                        :label="$t('周勤礼金（元）')"
                                    ></el-table-column>
                                </el-table>
                                <span slot="reference" class="seeGift">{{$t('奖励一览')}}</span>
                            </el-popover>
                        </div>
                    </div>

                    <div class="item" v-if="grantType == 2">
                        <div class="first-row">
                          {{$t('上周期可领取出勤礼金')}} <span style="color: #E64340">{{ filterNumber(lastWeekSignData.amount) }}</span> {{$t('元')}}
                        </div>
                        <div class="btn-recive" :class="{'can': lastWeekSignData.status == 0 && lastWeekSignData.amount > 0}">
                            <span v-if="lastWeekSignData.status == 3 || lastWeekSignData.amount <= 0">{{$t('未达到领取条件')}}</span>
                            <span v-else-if="lastWeekSignData.status == 0" @click="getAward()">{{$t('领取礼金')}}</span>
                            <span v-else-if="lastWeekSignData.status == 1">{{$t('已领取')}}</span>
                            <span v-else-if="lastWeekSignData.status == 2">{{$t('已过期')}}</span>
                        </div>
                    </div>

                    <!-- <div class="keepOnFighting" v-if="lastWeekSignData.amount <= 0">
                        <div>{{$t('上周未达到发放条件')}}</div>
                        <div>{{$t('本周请继续努力')}}</div>
                    </div>

                    <div class="keepOnFighting" v-else>

                        <template v-if="grantType == 1">
                            <div>{{$t('您上周已达到发放条件')}}</div>
                            <div>{{$t('请注意余额变动')}}</div>
                        </template>

                        <template v-if="grantType == 2">

                            <div
                                class="getBtn unget u-flex-all cursorPoint"
                                v-if="!lastWeekSignData.status"
                                @click="getAward()"
                            >{{$t('领取奖励')}}</div>

                            <div class="getBtn geted u-flex-all" v-else>{{$t('已领取')}}</div>
                        </template>
                    </div>
                    -->
                </div>
            </div>

            <!-- 上周周勤记录 -->
            <el-dialog :visible.sync="isShowRecord" :show-close="isShowClose">
                <div class="record-container">
                    <div class="r-header u-flex-a">
                        <span class="line"></span>
                        <span>{{$t('上周周勤记录')}}</span>
                        <img loading="lazy"
                            class="cursorPoint"
                            @click="closeDialog()"
                            v-lazy="require('../../../assets/images/dze/close.png')"
                            alt
                        />
                    </div>
                    <div class="r-content">
                        <!-- <div class="total-data">
                            <div style="margin-right:10px;">
                                {{$t('上周周勤记录')}}
                                <span>{{lastWeekSignData.totalSignCount}}</span>
                                {{$t('天')}}！
                            </div>
                            <div>
                                {{$t('累计有效投注额')}}
                                <span>{{filterNumber(lastWeekSignData.totalBetAmountValid)}}</span>
                                {{$t('元')}}
                            </div>
                        </div> -->
                        <div class="per-day-container">
                            <div class="line"></div>
                            <div
                                v-for="(item,i) in lastWeekSignData.weekSignRecordList"
                                :key="i"
                                class="per-day-item"
                            >
                                <div class="per-day-o">
                                    <img v-show="!item.status" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6N0I4NEI0M0M2MkRFMTFFNzlGNjI4NDZDQ0Y3MkY2Q0MiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6N0I4NEI0M0Q2MkRFMTFFNzlGNjI4NDZDQ0Y3MkY2Q0MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3Qjg0QjQzQTYyREUxMUU3OUY2Mjg0NkNDRjcyRjZDQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3Qjg0QjQzQjYyREUxMUU3OUY2Mjg0NkNDRjcyRjZDQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pt1b+qEAAARHSURBVHja1FlPSBRRGH8z49/VNcRYvZVgC2p1EfEm0UG0EEUqiCCwS0I387CHTnYRTDtEYSchyKTAPwQpHiK6CXbJlgUVJPCQoskq6rrr+vp+w3syjjO7s7o7uR88dlZn3u8337/3fd8yliWiuLQP/19EFQfXZoL8LMTVUxA0LlUsLcmS9x17fmlpKSMaVRws457c8JlsJZWcFF7GrEUlEAiUdHR0tBQVFTXm5ORcV1X1kqIoJTo7zrcODw9/Hxwc/NzZ2fk+NjY21dfXtyWIHYrl2I8VhyRVI8mJiYkrJE/z8vLuEjGPE40Q8d1oNPppcXFxoL29fdFAlhtI89MQPeGLnZ2dRd3d3c8KCwuf0Pc83OTxePSVn5/PcnNzGWlVf5i0yWKxGNvf32e7u7v6EhLd29t7Mzg4+Hx4eHjHRNjWFRQHmtSDZXx8vKqmpmZE07Rr+IfX62WlpaU6OScC0pubm2x7e1v/Ho/H50Oh0AOh3bjJHXgqRI9IzszM1FVWVo6RmX0FBQWsrKyM4fM0EolE2MbGhv5J7rC2vLzc0dTU9MNE1hFRo7k18kd/bW3tVyJ5kYKGlZeXM7o+U/Imgmx1dZVRkOF6PRgM3iTNLhjInnABLYFfal1dXd7W1tbP5HeXi4uLWUVFxZlJ6iC0B/aDO9DykIUaKTuMzM3NxZymK0WQh+MVzM/Pv6SkzFdWVjgFB0+3YE/sDQxgAVNga2Zrq3ZRjuAR0a37ZDo0aaVZ7A0BFtKexQlme4TqN/j9/h68HaL7tIHjRLA3MIBFubnHTNCOqH5Tb29vCZI5/oAUlGmRGIR5B9hWZC1N39zc3IITB4ncaZ48iwADWMAEdiLTHzvPKQ3dkKeOWyKxBPaJIsfSR6nAuIoLHItuicQS2Al99OgtKG9WSpO4JRJLYjuKehKveMg1ohJLYCeN+nMrqvVRzLdlqeaWSCyBzRMRPSoE6KFlWZq5JRJLYpsLE0uNUoHwCxcoet0SiSWwbTV6rBGj8usbvhiq8oyLxBLY3MTJ0vR8enp6Cj0OHnbD/MAAFmHuAduqLVEs8qjei1Mx+5aS8EMUDD6fL6NE19bW9BaFzP+OivTHooCOG8mqNuMXTt3iC7wsNkDbkCnB3qKPilFdOmDX4FmaHsGHpou6xdf4B3octA/pFuyJvSHoTNva2hbsOlIt0UyJNpptaGi4TSnDBz9C+5Buk8M3qSMNDg0NPZqdnY1kfXOX1e2y5QAC/Ux1dfUHTdNq0zSACIZCoftOBxCa07nU6OjoXzLV+/r6+nwiVxeNRrVwOKyfKDin4Q5yGUc6MC8Irq+vM3pG50yB86q/v78zEAj8sdBiSiOdhEOyyclJf1VVVTf1OPeIWKFDv4wQ0Y9IQYboTsuQzOnY8ZZp7HhBEAubxo5fLMaOPJkms26Qm2qeUWy0rCSZ4XMb7fFUgc/9jw1Z8/NN1sg/AQYAKyvHmmpQqv0AAAAASUVORK5CYII=" alt="">
                                    <img v-show="item.status" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkU5OTUyNDc2MkRFMTFFN0EyNzNBNEM0MTc5QTlBRjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkU5OTUyNDg2MkRFMTFFN0EyNzNBNEM0MTc5QTlBRjEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCRTk5NTI0NTYyREUxMUU3QTI3M0E0QzQxNzlBOUFGMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCRTk5NTI0NjYyREUxMUU3QTI3M0E0QzQxNzlBOUFGMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnN2WC0AAARYSURBVHja1JlLaBNRFIbvTB5NjEpTXSmIC61SH0ufKFhFCoqmKrgoom6sG58LwY1gBV1VoYK23YiLCoq4EB9Vq1sRfCCIqKi7uhBto9jaJJOO55Z/xpObzCPJNNZbftJOMud8OXPvPfecaqkvHeJ/GOEq79cgUeLVLPFq1hJUY9LZq+4AOg6Z7LVs6HAFgBZUCAqza7oCOs5kkPLQuAIdCKgKGIYikPV3yAE0D0ipHGT97Rs47BMyxOCiUB0pSdpIWklaTJpDmo57f5G+kN6RnpEek4ZJGVIWyrFICzfYsAekziDroDhpEamd1EKKOdyfhJaQdpLGSP2kHtJ70m9AZ+Arz6LrG5RDRgATh+PjpDZcL2dIGynSFtI1UicirONLCLb4imB1j8cdAWACkblJ2lcBJB/y3r2wtRS247geUrY8T1DrccsoTMMclFFoDHAPl7b6YHsafIUZrCuoxla2NR+bSL2khklIOA2w3QRfdWy70/yARnCTNNRFqp/E7ChtX4SvGHy7gvJoRvEN5cJZWINUvgC+YvBdFFU30Eas7lqNNmx7vkBD7LEfDODQUm46b4fviLqodId9swGbeSBDo5/D9dtFx6w9ok5z3dla4DuipmRd2TutvN3sknHKGjqZPUqQG+LLxbLofHEyudsrKTQzDk0FFcqhY3VQkEfqU2J9fJl97Ws+7XXbauVEVpBC1eNbYzCRTIl18aX2tYHRV+Lyjzt+EkFIPTbqJRKA1Fw3S1EtLE4kd4n9Mzc7Qh6rby2AfESQlwjSx+FzrhpNNaJcCTdLpxraxJLoPPtkduXnI/u9ENk/lmwVa2NNDPIlRfKu3yN9ogRPyVzvOQaNb/bv2xKrxJ4ZG23I49VBeh6cTUUjbmmz+8c9EaNtxlokO6avmZgOs0MzxarYYvtzDwmyu3zIkRI8RRu6VRoMuoGa9NOVvk1wERtsa2JFwWceEGRPZZEcZBxFuZ4XYvKk/cHLWp4+2pm+JV5lPhW992D0RaWQAr7VArBgjvJq8akfi4aZF+eGb4jXmc/2tf4JyHvVzMmnSuFXFFGTVYdPlPLAceRMQ5wdvj4R2fujz0VvdZBj8G1xFM1RXtrKynAIhVjKj/UswXYMXQsimfXDd04t9vSCNfIXNINq0ajh6cnAaT/DQM1SxzyTzdEsStq+GoL2oQeQZXPUF6icL+dJH2sAKX1cgE9PUA6bw01yvhwipScRMg0f3+EzV6q2dwI1MFdkN+Mt6QCggx5DsP2WdU4MP6B8URn4hqPoHbUFPA0+wuYz+MiwPpSvTomp7AC/kX/fyLROulrlbmDAxg7YHIGPLIM0/faeTCXX8ilxmnQdj6yljJJFRuw+tqB3eFpjSiTLbpIJhw6xNSVeow4/Q9qEtswiHHp523EQ25x8vAMebUez0rYj71fmFdAsW2wyJd34141c9azKDy65qdYadwLOAywrptg/G1RgC2LK/vvGCXpSxx8BBgD/E7v9EIvXqwAAAABJRU5ErkJggg==" alt="">
                                </div>

                                <div>{{weekTypeHandler(item.weekType)}}</div>
                                <div class="money">{{filterNumber(item.betAmountValid)}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-dialog>
        </div>
        <!-- 月 -->
        <div v-if="actType==1">
            <div class="week-moon-container">
                <div class="content">
                    <div class="head-bg"></div>
                    <div class="per-day-container">
                        <div
                        v-for="(item,i) in thisMonthSignData.signRecordList"
                            :key="i"
                            class="per-day-item"
                        >
                            <div class="per-date">{{item.summaryDate.slice(-2)}}
                                <span class="per-current" v-if="item.today">{{$t('今')}}</span>
                            </div>
                            <div class="money" :class="item.status ? 'mAct' : '' ">{{item.betAmountValid ? item.betAmountValid.toFixed(2) : '0.00'}}</div>
                        </div>
                    </div>
                    <div class="item-wrap">
                        <div class="item">
                            <div class="first-row">
                                <span class="num">{{thisMonthSignData.totalSignCount || 0}}</span>
                              {{$t('天')}}
                            </div>
                            <div>{{$t('本期累计出勤天数')}}</div>
                    </div>
                    <div class="item">
                        <div class="first-row">
                            <span class="num">{{filterNumber(thisMonthSignData.totalBetAmountValid)}}</span>
                          {{$t('元')}}
                        </div>
                        <div>{{$t('本期累计的有效投注额')}}</div>
                    </div>
                    <div class="item">
                        <div class="first-row">
                            <span class="num">{{filterNumber(thisMonthSignData.amount)}}</span>
                          {{$t('元')}}
                        </div>
                        <div>
                          {{$t('出勤礼金')}}
                            <el-popover
                                placement="bottom"
                                width="553"
                                trigger="hover"
                                popper-class="week-gift-popover"
                            >
                                <div class="title">{{$t('周勤奖励礼金计算')}}</div>
                                <el-table :data="rewardRatios">
                                    <el-table-column
                                        width="200"
                                        :label="$t('本期出勤天数（单日投注≥')+daylyMinBet+'）'"
                                    >
                                        <template
                                            slot-scope="scope"
                                        >{{$t('最低')}}{{ scope.row.weekMinSignDays}}{{$t('天')}}</template>
                                    </el-table-column>
                                    <el-table-column
                                        width="200"
                                        :label="$t('周有效投注额（元）')"
                                    >
                                        <template slot-scope="scope">
                                            <div>≥ {{ scope.row.weekMinBet}}</div>
                                            <!-- <div
                                                v-if="scope.row.weekMaxBet"
                                            >{{ scope.row.weekMinBet}}{{$t('至')}}{{ scope.row.weekMaxBet}}</div>
                                            <div
                                                v-else
                                            >{{$t('最低')}}{{ scope.row.weekMinBet}}</div> -->
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        width="150"
                                        property="amount"
                                        :label="$t('周勤礼金（元）')"
                                    ></el-table-column>
                                </el-table>
                                <span slot="reference" class="seeGift">{{$t( '奖励一览')}}</span>
                            </el-popover>
                        </div>
                    </div>

                    <div class="item" v-if="grantType == 2">
                        <div class="first-row">
                          {{$t('上周期可领取出勤礼金')}} <span style="color: #E64340">{{ filterNumber(lastMonthSignData.amount) }}</span> $t('元')}}
                        </div>
                        <div class="btn-recive" :class="{'can': lastMonthSignData.status == 0 && lastMonthSignData.amount > 0}">
                            <span v-if="lastMonthSignData.status == 3 || lastMonthSignData.amount <= 0">{{$t('未达到领取条件')}}</span>
                            <span v-else-if="lastMonthSignData.status == 0" @click="getAward()">{{$t('领取礼金')}}</span>
                            <span v-else-if="lastMonthSignData.status == 1">{{$t('已领取')}}</span>
                            <span v-else-if="lastMonthSignData.status == 2">{{$t('已过期')}}</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        </div>
        <!-- 自定义 -->
        <div v-if="actType==2">
            <div class="week-moon-container">
            <div class="content">
                <div class="title">
                    <span class="flag"></span>
                    <span class="name">{{$t('本期出勤')}}</span>
                </div>
                <div class="head-bg"></div>
                <div class="customize per-day-container">
					<div class="" v-for="(items,i) in cycleSignDataList" :key="i">
                        <div v-if="items.isShowData===1">
                            <div v-for="(item2,index) in items.signRecordList" class="per-day-item" :key="index"
                                :class="isDisabled == i ? 'dateDrey' : '' ">
                                <div class="per-date">{{item2.summaryDate.slice(-2)}}
                                    <span class="per-current" v-if="item2.today">{{$t('今')}}</span>
                                </div>
                                <div class="money" :class="item2.status ? 'mAct' : '' ">
                                    {{item2.betAmountValid ? item2.betAmountValid.toFixed(2) : '0.00'}}
                                </div>

                            </div>
                        </div>

					</div>
				</div>

                <div class="title">
                    <span class="flag"></span>
                    <span class="name">{{$t('本期出勤统计')}}</span>
                </div>
                <div class="item-wrap">
                <div class="item">
                    <div class="first-row">
                        <span class="num">{{cycleSignDataList[isDisabled].totalSignCount || 0}}</span>
                      {{$t('天')}}
                    </div>
                    <div>{{$t('本期累计出勤天数')}}</div>
                </div>
                <div class="item">
                    <div class="first-row">
                        <span class="num">{{filterNumber(cycleSignDataList[isDisabled].totalBetAmountValid)}}</span>
                      {{$t('元')}}
                    </div>
                    <div>{{$t('本期累计的有效投注额')}}</div>
                </div>
                <div class="item">
                    <div class="first-row">
                        <span class="num" style="color: #E64340">{{filterNumber(cycleSignDataList[isDisabled].amount)}}</span>
                      {{$t('元')}}
                    </div>
                    <div style="display: flex;">
                        <div>{{$t('出勤礼金')}}</div>
                        <el-popover
                                placement="bottom"
                                width="553"
                                trigger="hover"
                                popper-class="week-gift-popover"
                            >
                                <div class="title">{{$t('周勤奖励礼金计算')}}</div>
                                <el-table :data="rewardRatios">
                                    <el-table-column
                                        width="200"
                                        :label="$t('本期出勤天数（单日投注≥')+daylyMinBet+'）'"
                                    >
                                        <template
                                            slot-scope="scope"
                                        >{{$t('最低')}}{{ scope.row.weekMinSignDays}}{{$t('天')}}</template>
                                    </el-table-column>
                                    <el-table-column
                                        width="200"
                                        :label="$t('周有效投注额（元）')"
                                    >
                                        <template slot-scope="scope">
                                            <div>≥ {{ scope.row.weekMinBet}}</div>
                                            <!-- <div
                                                v-if="scope.row.weekMaxBet"
                                            >{{ scope.row.weekMinBet}}{{$t('至')}}{{ scope.row.weekMaxBet}}</div>
                                            <div
                                                v-else
                                            >{{$t('最低')}}{{ scope.row.weekMinBet}}</div> -->
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        width="150"
                                        property="amount"
                                        :label="$t('周勤礼金（元）')"
                                    ></el-table-column>
                                </el-table>
                                <span slot="reference" class="seeGift">{{$t('奖励一览')}}</span>
                            </el-popover>
                    </div>
                </div>
                <div class="item" v-if="grantType == 2">
                    <div class="first-row">
                      {{$t('上周期可领取出勤礼金')}} <span style="color: #E64340">{{ filterNumber(lastCyclesDate[0].amount) }}</span> {{$t('元')}}
                    </div>
                    <div class="btn-recive" :class="{'can': lastCyclesDate[0].status == 0 && lastCyclesDate[0].amount > 0}">
                        <span v-if="lastCyclesDate[0].status == 3 || lastCyclesDate[0].amount <= 0">{{$t('未达到领取条件')}}</span>
                        <span v-else-if="lastCyclesDate[0].status == 0" @click="getAward()">{{$t('领取礼金')}}</span>
                        <span v-else-if="lastCyclesDate[0].status == 1">{{$t('已领取')}}</span>
                        <span v-else-if="lastCyclesDate[0].status == 2">{{$t('已过期')}}</span>
                    </div>
                </div>
                </div>
                </div>
            </div>
        </div>

        <!-- 温馨提示 -->
        <div class="bot-tips">
            <div class="title">{{$t('温馨提示：')}}</div>
            <div class="para" v-html="tip"></div>
        </div>

    </div>
</template>
<script>
import commonHeader from "./commonHeader.vue";
import Marquee from '@/components/Marquee/index.vue'
export default {
    data() {
        return {
            grantType: 0, //1.自动   2.手动
            dataList: {},
            isShowRecord: false,
            isShowClose: false,
            lastWeekSignData: {}, //上周数据
            thisWeekSignData: {}, //本周数据
            lastMonthSignData: {}, //上月数据
            thisMonthSignData:{}, // 本月數據
            cycleSignDataList:[],//自定义数据
            lastCyclesDate: {}, //自定义数据-上周期
            rewardRatios: null, //周勤奖励礼金计算
            award: "XXX",
            tip: '',
            actType:null,
            isDisabled: 0,
            daylyMinBet:0
        };
    },
     props: {
        dd: {
        type: Object,
        default: () => ({}),
        },
    },
    created() {
        this.id = this.dd.id;
        this.name = this.dd.name;
        this.getData(this.id);
    },
    methods: {
        async getData() {
            const res = await this.$http.get(
                this.$api.getThematicActivitiesByApp + "/" + this.id
            );
            if (res.code == 0 && res.data) {
                this.dataList = res.data || {};
                this.grantType = res.data.grantType;
                this.actType = parseInt(res.data.speActWeekSignVO.cycleKey);
                this.lastWeekSignData = res.data.speActWeekSignVO.lastWeekSignData;
                this.lastMonthSignData = res.data.speActWeekSignVO.lastMonthSignData;
                this.thisWeekSignData = res.data.speActWeekSignVO.thisWeekSignData;
                this.thisMonthSignData = res.data.speActWeekSignVO.thisMonthSignData;
                this.cycleSignDataList = res.data.speActWeekSignVO.cycleSignDataList;
                if (this.cycleSignDataList && this.cycleSignDataList.length) {
                    this.lastCyclesDate = this.cycleSignDataList.filter((e) => e.cycleType == 0);
                }
                this.daylyMinBet =  res.data.speActWeekSignVO.daylyMinBet;
                if(this.actType == 2){this.dateDisabled()}
                this.rewardRatios = res.data.speActWeekSignVO.rewardRatios;
                this.tip = res.data.intro
            }
        },
        filterNumber(num) {
            if (!num) {
                return "0.00";
            } else {
                return (num * 1).toFixed(2);
            }
        },
        dateDisabled() {
				let getDateDisabled = []
				this.cycleSignDataList.forEach((e, i) => {
					const isToday = e.signRecordList.find(element => element.today == true);
					getDateDisabled.push(isToday)
				})
                // console.log('getDateDisabled',getDateDisabled)
				getDateDisabled.forEach((s, b) => {
					for (let key in s) {
                        console.log('key',key)
						if (s[key]) {
                            // console.log('xxxxx',b)
							this.isDisabled = b
							return
						};
					}
				})
			},
        weekTypeHandler(val) {
            switch (val) {
                case 1:
                    return this.$t('周一');
                    break;
                case 2:
                    return this.$t('周二');
                    break;
                case 3:
                    return this.$t('周三');
                    break;
                case 4:
                    return this.$t('周四');
                    break;
                case 5:
                    return this.$t('周五');
                    break;
                case 6:
                    return this.$t('周六');
                    break;
                case 7:
                    return this.$t('周日');
                    break;
            }
        },

        onBack() {
            this.$router.go(-1);
        },
        openDialog() {
            this.isShowRecord = true;
        },
        closeDialog() {
            this.isShowRecord = false;
        },
        getAward() {
            var _this = this;
            this.$confirm(_this.$t("是否确认申请该注单奖励？"), "", {
                confirmButtonText: _this.$t("确认"),
                cancelButtonText: _this.$t("取消"),
                showClose: false
            }).then(() => {
                //申请
                this.getFn();
            });
        },
        async getFn() {
            const res = await this.$http.put(this.$api.getReceive + this.id);
            if (res.code == 0) {
                this.$message({
                    type: "success",
                    message: res.data
                });
                this.getData(this.id);
                //更新余额
                this.getuserMoney();
            } else {
                this.$message({ type: "warning", message: res.msg });
            }
        },
        getuserMoney() {
            this.$nkhttp.getuserMoney(
                res => {
                    if (res.code == 0) {
                        this.$message.success(this.$t("刷新余额成功"));
                    } else {
                        this.$message.error(res.msg || this.$t('请求失败'));
                    }
                },
                false,
                true
            );
        }
    },
    components: {
        commonHeader,
        Marquee
    }
};
</script>
<style lang="scss" scope >
.week-award-layout {
    .topTips {
        margin: 20px 0;
        background-color: #fff4d7;
        color: #e91919;
        font-size: 12px;
        padding: 10px;
    }
    .week-container {
        .title {
            overflow: hidden;
            margin-bottom: 15px;
            .flag {
                width: 4px;
                height: 21px;
                float: left;
                background: #e91919;
                margin-right: 8px;
            }
            .name {
                font-size: 14px;
                font-weight: bold;
                line-height: 21px;
                float: left;
                color: #333333;
            }
        }
    }

    .this-week-container {
        .content {
            padding: .45rem 0 .25rem 0;
            box-sizing: border-box;
            border-top: 1px solid #e8e8e8;
            border-bottom: 1px solid #e8e8e8;
            .total-data {
                font-size: 20px;
                line-height: 28px;
                color: #333;
                display: flex;
                justify-content: center;
                margin-bottom: 26px;
                span {
                    color: #e91919;
                }
            }
            .per-day-container {
                display: flex;
                padding: 0 80px 30px 80px;
                box-sizing: border-box;
                position: relative;
                top: 30px;
                .line {
                    position: absolute;
                    width: 660px;
                    height: 1px;
                    background: #dcdcdc;
                    box-shadow: 0 0 2px rgba(0, 0, 0, 0.15);
                    left: 0;
                    margin: 21px 0 0 136px;
                    top: -45px;
                }
                .per-day-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    font-size: 12px;
                    color: #333;
                    width: 110px;
                    z-index: 2;
                    position: relative;
                    .per-day-o {
                        position: absolute;
                        top: -45px;
                        width: 42px;
                        height: 42px;
                        img {
                            width: 100%;
                            height: 100%;
                        }
                    }
                    img {
                        width: 50px;
                        height: 50px;
                        flex-shrink: 0;
                    }
                    .money {
                        color: #e91919;
                        line-height: 17px;
                        margin-top: 10px;
                    }
                }
            }
        }
    }
    .last-week-container {
        .title {
            margin-top: 16px;
            .record {
                color: #0077ff;
                margin-left: 25px;
                line-height: 21px;
            }
        }

        .content {
            padding: 33px 18px;
            box-sizing: border-box;
            border-top: 1px solid #e8e8e8;
            border-bottom: 1px solid #e8e8e8;
            color: #999999;
            font-size: 13px;
            display: flex;
            align-items: center;
            .item {
                flex: 1;
                text-align: left;
                color: #666;
                .first-row {
                    margin-bottom: 10px;
                    .num {
                        height: 28px;
                        font-size: 20px;
                        font-weight: bold;
                        line-height: 28px;
                        color: #333333;
                        margin-right: 6px;
                    }
                }
                .seeGift {
                    display: inline-block;
                    background: #ffaa00;
                    height: 19px;
                    line-height: 19px;
                    border-radius: 10px;
                    font-size: 12px;
                    color: #ffffff;
                    padding: 0 4px;
                    box-sizing: border-box;
                    margin-left: 10px;
                }
            }
            .keepOnFighting {
                color: #e91919;
                text-align: center;
                .getBtn {
                    width: 120px;
                    height: 36px;
                    border-radius: 4px;
                }
                .getBtn.unget {
                    background-color: #e91919;
                    color: #fff;
                }
                .getBtn.geted {
                    background-color: #e6e6e6;
                    color: #999999;
                }
            }
        }
    }
    .bot-tips {
        padding-right: 36px;
        box-sizing: border-box;
        .title {
            padding: 25px 0 14px;
            font-size: 14px;
            color: #e91919;
            margin-bottom: 0;
        }
        .para {
            font-size: 12px;
            font-weight: 500;
            line-height: 17px;
            color: #333333;
            margin-bottom: 10px;
            .red {
                color: #e91919;
            }
        }
    }

    // 弹窗
    .el-dialog__wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        .el-dialog {
            width: 718px !important;
            margin: 0 !important;
            border-radius: 8px !important;
            .el-dialog__header {
                padding: 0 !important;
            }
            .el-dialog__body {
                padding: 0 !important;
                border-radius: 8px;
                .record-container {
                    .r-header {
                        height: 62px;
                        padding: 0 17px 0 23px;
                        box-sizing: border-box;
                        border: 1px solid #e1e1e1;
                        font-size: 16px;
                        font-weight: bold;
                        line-height: 22px;
                        color: #333;
                        border-top-left-radius: 8px;
                        border-top-right-radius: 8px;
                        position: relative;
                        .line {
                            display: inline-block;
                            width: 4px;
                            height: 21px;
                            background: #e91919;
                            margin-right: 4px;
                        }
                        img {
                            width: 20px;
                            height: 20px;
                            position: absolute;
                            top: 20px;
                            right: 17px;
                        }
                    }
                    .r-content {
                        padding: 32px 0 83px;
                        .total-data {
                            font-size: 20px;
                            line-height: 28px;
                            color: #333;
                            display: flex;
                            justify-content: center;
                            margin-bottom: 26px;
                            span {
                                color: #e91919;
                            }
                        }
                        .per-day-container {
                            display: flex;
                            padding: 0 60px;
                            box-sizing: border-box;
                            position: relative;
                            top: 40px;
                            .line {
                                position: absolute;
                                top: -45px;
                                width: 508px;
                                height: 1px;
                                background: #dcdcdc;
                                box-shadow: 0 0 2px rgba(0, 0, 0, 0.15);
                                left: 0;
                                margin: 21px 0 0 104px;
                            }
                            .per-day-item {
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                font-size: 12px;
                                color: #333;
                                width: 85px;
                                z-index: 2;
                                .per-day-o {
                                    position: absolute;
                                    top: -45px;
                                    width: 42px;
                                    height: 42px;
                                    img {
                                        width: 100%;
                                        height: 100%;
                                    }
                                }
                                img {
                                    width: 50px;
                                    height: 50px;
                                    flex-shrink: 0;
                                }
                                .money {
                                    color: #e91919;
                                    line-height: 17px;
                                    margin-top: 10px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    // 自然月樣式
    .week-moon-container{
        width: 9.38rem;
        .title {
            overflow: hidden;
            padding-bottom: 10px;
            margin-top: 20px;
            border-bottom: 1px solid #E5E5E5;
            display: flex;
            align-items: center;
            .flag {
                width: 4px;
                height: 21px;
                float: left;
                background: #e91919;
                margin-right: 8px;
            }
            .name {
                font-size: 18px;
                font-weight: bold;
                line-height: 25px;
                float: left;
                color: #333333;
            }
        }
        .head-bg {
            width: 100%;
            height: .6rem;
            background: url('./img/calendar-bg.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
	    }
        .per-day-container {
            display: flex;
            justify-content: space-between;
            // gap: calc(0%/1);
            flex-flow: row wrap;
            padding-top: 5px;
            margin-bottom: .15rem;
            box-shadow: 2px 4px 16px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
        }
        .per-day-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 12px;
            color: #333;
            width: .624rem;
            z-index: 2;
            position: relative;
            padding-bottom: 26px;
            margin-top: 20px;
            border-bottom: 1px solid #F1F1F1;
        }
        .per-date{
            color: #333;
            font-size: 16px;
            position: relative;
            .per-current{
                position: absolute;
                top: -8px;
                right: -18px;
                background: #ff2f43;
                color: #fff;
                font-size: 12px;
                padding: 0 3px;
                border-radius: 50%;

            }
         }
         .money {
            color: #fff;
            padding: 4px 10px;
            margin-top: 10px;
            background: #D4D4D4;
            box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
            border-radius: 38px;
        }
        .mAct{
            background: #00C657;
        }
        .item-wrap{
            padding: 33px 18px;
            box-sizing: border-box;
            border-top: 1px solid #e8e8e8;
            border-bottom: 1px solid #e8e8e8;
            color: #999999;
            font-size: 13px;
            display: flex;
            align-items: center;
        }
        .item {
            flex: 1;
            // text-align: center;
            color: #666;
            .first-row {
                margin-bottom: 10px;
                .num {
                    height: 28px;
                    font-size: 20px;
                    font-weight: bold;
                    line-height: 28px;
                    color: #333333;
                    margin-right: 6px;
                }
            }
            .seeGift {
                display: inline-block;
                background: #ffaa00;
                height: 19px;
                line-height: 19px;
                border-radius: 10px;
                font-size: 12px;
                color: #ffffff;
                padding: 0 4px;
                box-sizing: border-box;
                margin-left: 10px;
            }
        }
        // 自定義樣式
        .customize{
            width: 100%;
            background: #eaeaea;
            box-shadow: 1px 2px 8px rgba(0, 0, 0, 0.1);
            border-radius: 0 0 10upx 10upx;
            padding-bottom: 2upx;
            display: inline-block;
            .per-day-item{
                float: left;
                border-bottom: 1px solid #eaeaea;
                padding: .23rem 0;
                margin: 0 !important;
            }
            .dateDrey {
                background: #fff;
            }
        }

    }
}

.week-gift-popover {
    padding: 0;
    border: none;
    border-radius: 0;
    .el-table {
        border: 1px solid #dcdcdc;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        th {
            background-color: #f2f2f2;
            .cell {
                font-weight: normal;
            }
        }
        th,
        td {
            padding: 0;
            height: 32px;
            line-height: 32px;
            text-align: center;
            font-size: 12px;
        }
        td,
        th.is-leaf {
            border-bottom: 1px solid #dcdcdc;
        }
        .el-table__body {
            tbody {
                tr {
                    td:nth-child(3) {
                        color: #e91919 !important;
                        font-weight: bold !important;
                    }
                }
            }
        }
    }
    .triangle {
        position: absolute;
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border: 8px solid;
        border-color: transparent transparent #cccccc transparent;
    }

    .title {
        font-size: 14px;
        line-height: 20px;
        color: #333333;
        text-align: center;
        padding: 8px 0;
        border-top: 1px solid #dcdcdc;
        border-left: 1px solid #dcdcdc;
        border-right: 1px solid #dcdcdc;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }
}

.btn-recive {
    width: 100%;
    height: 40px;
    border-radius: 4px;
    line-height: 40px;
    text-align: center;
    background-color: #cccccc;
    color: #fff;
    cursor: pointer;
    span {
        display: inline-block;
        width: 100%;
        height: 100%;
    }
    &.can {
        background-color: #d9001b;
    }
    &:hover {
        opacity: .9;
    }
}
</style>
