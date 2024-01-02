<template>
    <div class="Modal" :class="!setWidthFlag ? 'setWidthClass' : ''">
        <!-- 兑换弹窗 -->
        <el-dialog
            class="changeModal"
            :title="changeItem.name"
            :modal="false"
            :lock-scroll="false"
            top="25vh"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="true"
            :visible.sync="changevisible"
        >
            <div class="changeBox">
                <!-- 左侧dom -->
                <div class="boxLeft">
                    <div class="modalContent">
                        <div class="picter">
                            <img loading="lazy"
                                v-lazy="$config.getImgUrl(changeItem.imgUrl)"
                                class="img"
                            />
                        </div>
                        <p class="tip">{{ $t('注：图片颜色仅供参考，具体请以发货颜色为准。') }}</p>
                        <div class="content">
                            <div class="price">
                                <p class="boxprice">{{ $t('单价：') }}</p>
                                <b class="redPrice">{{ toThousands(changeItem.amount) }}</b>
                            </div>
                            <div class="number">
                                <p>{{ $t('数量：') }}</p>
                                <el-input-number
                                    size="small"
                                    :min="1"
                                    :max="changeItem.reserveCount"
                                    :step-strictly="true"
                                    v-model="count"
                                ></el-input-number
                                ><span class="maxClass" @click="setCount">{{
                                    $t('最大')
                                }}</span>
                            </div>
                        </div>
                        <div class="allPrece">
                            {{ $t('总结：')
                            }}<b class="price">{{ toThousands(totalPrice) }}</b>
                        </div>
                    </div>
                </div>
                <!-- 右侧dom -->
                <div class="boxRight">
                    <div v-show="!editFlag">
                        <p class="tip">{{ $t('请选择收货信息进行兑换：') }}</p>
                        <div class="father">
                            <div
                                class="list"
                                @click="openEdit(item, false)"
                                v-for="(item, index) in AddressList"
                                :key="index"
                            >
                                <div class="detail">
                                    <p v-if="item.status != 1">
                                        {{ $t('收货人') }}：{{
                                            item.name
                                        }}
                                    </p>
                                    <p v-else>
                                        {{ $t('收货人') }}：{{
                                            item.name
                                        }}
                                    </p>
                                    <p>
                                        {{ $t('收货地址') }}：{{ item.address }}
                                    </p>
                                    <p>
                                        {{ $t('收货号码') }}：{{
                                            item.phone
                                        }}
                                    </p>
                                    <p style="text-align: right;display: flex;justify-content: flex-end;margin-top: 10px;">
                                        <span v-if="item.status==1" type="border" style="color: #CCA456;border: 1px solid #CCA456;padding: 0px 10px;border-radius: 10px;" color="error">{{ $t('默认') }}</span>
                                        <span v-if="item.status==0" @click.stop="changeDefault(item)" style="border: 1px solid #ccc;border-radius: 50%;height: 15px;width: 15px;"></span>
                                    </p>
                                </div>
                            </div>
                            <div
                                class="addlist list"
                                v-if="AddressList.length < 2"
                            >
                                <div class="box" @click="openAddPerson()">
                                    <span class="bgc"></span>
                                    <div class="tip">{{ $t('请添加收货地址') }} {{AddressList.length}}/2</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-show="editFlag" class="eaitClass">
                        <el-form
                            label-position="left"
                            :model="ruleForm"
                            :rules="rules"
                            ref="ruleForm"
                            label-width="120px"
                            class="demo-ruleForm"
                        >
                            <el-form-item
                                :label="$t('收货人')"
                                prop="name"
                            >
                                <el-input
                                    v-model="ruleForm.name"
                                    :placeholder="$t('请输入收货人姓名')"
                                    maxlength="10"
                                    show-word-limit
                                    :disabled="!addFlag"
                                ></el-input>
                            </el-form-item>
                            <el-form-item
                                :label="$t('手机号')"
                                :prop="addFlag?'phone':''"
                            >
                                <el-input
                                    v-model="ruleForm.phone"
                                    :placeholder="$t('请输入手机号')"
                                    maxlength="11"
                                    type="text"
                                    show-word-limit
                                    oninput="value=value.replace(/[^0-9.]/g,'')"
                                    :disabled="!addFlag"
                                ></el-input>
                            </el-form-item>
                            <!-- <el-form-item
                                :label="$t('所在地址')"
                                prop="address"
                            >
                              <el-col :span="8">
                                <el-form-item prop="province">
                                  <el-select :disabled="!addFlag" v-model="ruleForm.province" :placeholder="$t('所在省')" @change="changeProvince();changeCity()">
                                    <el-option v-for="item in provinceList" :key="item.label" :label="item.label" :value="item.label"></el-option>
                                  </el-select>
                                </el-form-item>
                              </el-col>
                              <el-col :span="8">
                                <el-form-item prop="city">
                                  <el-select :disabled="!addFlag" v-model="ruleForm.city" :placeholder="$t('所在市')" @change="changeCity()">
                                    <el-option v-for="item in cityList" :key="item.label" :label="item.label" :value="item.label"></el-option>
                                  </el-select>
                                </el-form-item>
                              </el-col>
                              <el-col :span="8">
                                <el-form-item prop="area">
                                  <el-select :disabled="!addFlag" v-model="ruleForm.area" :placeholder="$t('所在区')">
                                    <el-option v-for="item in areaList" :key="item.label" :label="item.label" :value="item.label"></el-option>
                                  </el-select>
                                </el-form-item>
                              </el-col>
                            </el-form-item> -->
                            <el-form-item
                                :label="$t('详细地址')"
                                prop="address"
                            >
                                <el-input
                                    v-model="ruleForm.address"
                                    :placeholder="$t('请输入详细地址')"
                                    maxlength="60"
                                    show-word-limit
                                    :disabled="!addFlag"
                                ></el-input>
                            </el-form-item>
                            <!-- <el-form-item
                                :label="$t('备注')"
                                style="margin-bottom: 20px"
                            >
                                <el-input
                                    v-model="ruleForm.remark"
                                    :placeholder="$t('额外信息备注，选填')"
                                    maxlength="200"
                                    show-word-limit
                                ></el-input>
                            </el-form-item> -->
                            <div class="quester">
                                <el-popover
                                    ref="popover1"
                                    placement="top-start"
                                    title=""
                                    width="390"
                                    trigger="hover"
                                >
                                    <div class="notice_list">
                                        <ol style="padding-left: 10px">
                                            <li>{{ $t('确定兑换该物品后，除因缺货或选择兑换的商品有误，其他原因均不能取消该笔订单') }}</li>
                                            <li>{{ $t('兑换的物品不能换为现金；') }}</li>
                                            <li>{{ $t('订单审核成功后，预计48小时内发货，如遇商家活动，以商家实际发货时间为准。') }}</li>
                                            <li>{{ $t('兑换商品如因缺货导致无法购买，自动取消该笔订单，可重新选择其他物品兑换；') }}</li>
                                            <li>{{ $t('收件地址只支持大陆地区；') }}</li>
                                            <li>{{ $t('如因收件信息错误导致商品派送失败，后果自己承担；如出现商品拒收的情况，该订单直接失效；') }}</li>
                                            <li>{{ $t('贵重物品签收时，请当面拆包，有任何疑问请联系快递员；') }}</li>
                                            <li>{{ $t('网站不接受无理由退换货；如因质量问题，导致需要换货，可凭商品的保修卡，联系商家处理。') }}</li>
                                            <li>{{ $t('所有商品增值税发票一概不予提供。') }}</li>
                                        </ol>
                                    </div>
                                </el-popover>
                                <span
                                    v-popover:popover1
                                    style="margin-right: 20px"
                                >
                                    <span class="dian">*</span>
                                    <el-checkbox
                                        v-model="ruleForm.checked"
                                        class="checkbox"
                                        >{{ $t('注意事项') }}</el-checkbox
                                    >
                                    <svg
                                        t="1617266095078"
                                        style="
                                            width: 20px;
                                            height: 20px;
                                            position: relative;
                                            top: 5px;
                                        "
                                        class="icon"
                                        viewBox="0 0 1024 1024"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        p-id="1433"
                                        width="64"
                                        height="64"
                                    >
                                        <path
                                            d="M511.514 63.894c-114.532 0-229.062 43.51-316.72 131.168-174.677 174.676-174.677 458.764 0 633.44 87.658 87.659 202.188 131.168 316.72 131.168s229.063-43.51 316.72-131.168c174.677-174.676 174.677-458.764 0-633.44-87.657-87.659-202.189-131.168-316.72-131.168z m0 44.79c52.467 0 103.654 10.236 151.642 29.432 49.907 20.475 94.695 49.907 133.086 88.937 39.03 38.39 68.463 83.18 88.937 133.086 19.195 47.988 29.433 99.175 29.433 151.642s-10.238 103.654-29.433 151.642c-20.474 49.907-49.907 94.695-88.937 133.086-38.39 39.03-83.18 68.463-133.086 88.937-47.988 19.196-99.175 29.433-151.642 29.433s-103.654-10.237-151.642-29.433c-49.907-20.475-94.696-49.907-133.086-88.937-39.03-38.39-68.463-83.18-88.937-133.086-19.196-47.988-29.433-99.175-29.433-151.642s10.237-103.654 29.433-151.642c20.475-49.907 49.907-94.695 88.937-133.086 38.39-39.03 83.18-68.463 133.086-88.937 47.988-19.196 99.175-29.433 151.642-29.433z"
                                            p-id="1434"
                                            fill="#f85a3f"
                                        ></path>
                                        <path
                                            d="M511.514 674.3c-18.556 0-34.551 15.356-34.551 34.551 0 18.556 15.996 33.912 34.55 33.912 19.196 0 34.552-15.356 34.552-33.912 0-19.194-15.356-34.55-34.551-34.55z m0.64-393.5c-42.23 0-76.14 10.877-101.734 33.91-25.593 22.395-41.589 55.027-46.707 97.896l58.225 7.039c4.479-31.992 15.356-55.666 31.352-70.382 15.996-15.356 35.83-22.394 59.505-22.394 24.953 0 46.068 8.317 63.344 24.953 16.636 15.996 24.953 35.191 24.953 57.585 0 11.518-2.56 23.035-8.317 33.272-5.758 10.237-18.556 23.674-37.751 40.95-19.835 17.275-33.272 30.073-40.95 39.03-9.597 12.157-17.275 24.314-21.754 36.47-6.399 15.997-9.598 35.192-9.598 56.946l0.64 17.276h53.746c0.64-22.394 1.92-39.03 4.479-48.628 3.199-10.237 7.038-19.195 12.796-26.873 5.758-7.678 17.276-19.834 35.831-35.83 26.873-24.315 45.429-44.79 55.027-61.426 8.958-16.636 14.076-35.191 14.076-55.026 0-34.55-13.437-63.984-40.31-88.298-26.233-24.314-62.064-36.47-106.852-36.47z"
                                            p-id="1435"
                                            fill="#f85a3f"
                                        ></path>
                                    </svg>
                                </span>
                                <el-checkbox
                                    v-model="ruleForm.status"
                                    class="selectAdderss"
                                    >{{ $t('保存为默认地址') }}
                                </el-checkbox>
                            </div>
                            <div class="questerBtn">
                                <el-button @click="resetForm('ruleForm')">{{
                                    $t('返回')
                                }}</el-button>
                                <el-button
                                    type="primary"
                                    @click="submitForm('ruleForm')"
                                    >{{
                                        addFlag ? $t('保存') : $t('立即兑换')
                                    }}</el-button
                                >
                            </div>
                        </el-form>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 删除用户信息提示弹窗 -->
        <el-dialog
            class="deleteModal"
            :title="$t('温馨提示')"
            top="30vh"
            :visible.sync="deletevisible"
            width="450px"
        >
            <i class="el-icon-warning icon"></i>
            <span class="tipcon">{{ $t('确认删除该收货信息') }}</span>
            <span slot="footer" class="dialog-footer">
                <el-button
                    @click="deletevisible = false"
                    class="cancel"
                    size="small"
                    >{{ $t('取 消') }}</el-button
                >
                <el-button type="primary" @click="deleteOpen" size="small">{{
                    $t('确定')
                }}</el-button>
            </span>
        </el-dialog>
        <!-- 提示弹窗 -->
        <el-dialog
            class="openModal" center
            :title="$t('温馨提示')"
            top="30vh"
            :visible.sync="visibleTip"
            width="350px"
        >
            <div style="text-align: center;">
                <MyImage loading="lazy" :src="require('@/assets/shop/X.png')" style="vertical-align: middle;display: inline-block;width: 20px"/>
                <span class="tipcon">{{$t('用户')}}{{clientMalls.currency}}{{$t('小于礼品所需')}}{{clientMalls.currency}}</span>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button class="subBtn" @click="visibleTip = false">{{
                    $t('确定')
                }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { mapMutations } from "vuex";
import cityData from '@/utils/areadata.js';
export default {
    data() {
        return {
            visibleTip: false,
            changevisible: false,
            canClose: true, // 是否可以关闭弹窗
            deletevisible: false,
            editFlag: false, //编辑的状态
            count: 1,
            ruleForm: {
                address: "",
                name: "",
                phone: "",
                remark: "",
                checked: true,
                province: "省",
                city: "市",
                area: "区",
                status: false, //0:非默认，1:默认
            },
            rules: {
                address: [
                    {
                        required: true,
                        message: this.$t('请输入收货地址'),
                        trigger: "blur",
                    },
                ],
                name: [
                    {
                        required: true,
                        message: this.$t('请输入收货人姓名'),
                        trigger: "blur",
                    },
                ],
                phone: [
                    {
                        required: true,
                        message: this.$t('请输入收货手机号'),
                        trigger: "blur",
                    },
                    {
                        pattern: /^\d{10,11}$/,
                        message: this.$t('请输入正确的手机号'),
                        trigger: "blur",
                    },
                ],
            },
            totalPrice: 0,
            isShowBox: true,
            setWidthFlag: true, //不显示兑换弹窗左侧盒子动态设置宽度的状态
            changeItem: {},
            AddressList: [],
            provinceList: [], //省数组
            cityList:[],//市数组
            areaList:[],//区数组
            addFlag: false, //新增用户地址   true保存，false 立即兑换
            deleteItem: {}, //要删除的用户信息
            updateFlag: false, // true：表示编辑用户信息，false表示新增用户信息
            limitCount:0   //控制加减的数量
        };
    },
    created() {
        this.provinceList = cityData;
        this.rules = {
            address: [
                {
                    required: true,
                    message: this.$t('请输入收货地址'),
                    trigger: "blur",
                },
            ],
            name: [
                {
                    required: true,
                    message: this.$t('请输入收货人姓名'),
                    trigger: "blur",
                },
            ],
            phone: [
                {
                    required: true,
                    message: this.$t('请输入收货手机号'),
                    trigger: "blur",
                },
                {
                    pattern: /^\d{10,11}$/,
                    message: this.$t('请输入正确的手机号'),
                    trigger: "blur",
                },
            ],
        };
    },
    computed: {
        // Product() {
        //     return this.$t("Product");
        // },
        clientMalls() {
            return this.$store.state.clientMall;
        },
    },
    methods: {
        ...mapMutations(["setUserRmb"]),
        //余额三位加逗号
        toThousands(num) {
            return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    },

        // 当省改变时
        changeProvince(){
            this.provinceList.forEach((item)=>{
                if (item.label === this.ruleForm.province){
                this.cityList = item.children;
                }
            })
            this.ruleForm.city = this.cityList[0].label;
        },

        // 当市改变的时候
        changeCity(){
            this.cityList.forEach((item)=>{
                if (item.label === this.ruleForm.city){
                this.areaList = item.children;
                }
            })
            // this.form.area = this.areaList[0];
            if (this.areaList && this.areaList.length){
                this.ruleForm.area = this.areaList[0].label;
            } else {
                this.ruleForm.area = "";
            }
        },
        //获取收货地址列表
        getAddressList() {
            let data = "/" + this.$common.getUser().user_id;
            this.$http.get(this.$api.members, data).then((res) => {
                if (res.code == 0) {
                    this.AddressList = res.data.addressList;
                }
            });
        },
        //打开删除提示弹窗
        deletePerson(item) {
            this.deleteItem = item;
            this.deletevisible = true;
        },
        //确认删除用户信息
        deleteOpen() {
            this.$http
                .delete(this.$api.deleteAddress, this.deleteItem.id)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message({
                            message: this.$t('删除用户信息成功'),
                            type: "success",
                        });
                        this.deletevisible = false;
                        this.getAddressList();
                    }
                });
        },
        //编辑、添加用户信息
        openEdit(item, type) {
            this.editFlag = true;
            this.addFlag = type;
            if (type == true) {
                this.updateFlag = true;
            }
            this.deleteItem = item;
            this.ruleForm = {
                address: item.address,
                name: item.name,
                phone: item.phone,
                remark: item.remark,
                province: item.province,
                city: item.city,
                area: item.area,
                checked: true,
                status: item.status == 1 ? true : false, //0:非默认，1:默认
            };
        },
        //新增用户信息
        openAddPerson() {
            this.editFlag = true;
            this.addFlag = true;
            this.updateFlag = false;
        },
        //返回
        resetForm(ruleForm) {
            this.editFlag = false;
            this.$refs[ruleForm].resetFields();
        },
        //保存
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log(123)
                    if (this.addFlag) {
                        //保存编辑、添加用户信息
                        this.exchangeAddress();
                    } else {
                        if (!this.isShowBox) {
                            this.changeItem.address = this.ruleForm.address;
                            this.changeItem.name = this.ruleForm.name;
                            this.changeItem.phone = this.ruleForm.phone;
                            this.changeItem.province = this.ruleForm.province;
                            this.changeItem.city = this.ruleForm.city;
                            this.changeItem.area = this.ruleForm.area;
                            this.changeItem.status = this.ruleForm.status ? 1 : 0, //0:非默认，1:默认
                            this.changeItem.codePrefix = this.$config.codePrefix
                            this.$http
                                .post(this.$api.associate, this.changeItem)
                                .then((res) => {
                                    if (res.code == 0) {
                                        this.$message({
                                            // message: "成功",
                                            message: this.$t('成功'),
                                            type: "success",
                                        });
                                        console.log(111)
                                        this.ruleForm.phone = ''
                                        this.resetForm('ruleForm')
                                        this.changevisible = false;
                                    } else {
                                        console.log(1111)
                                        this.$message({
                                            message: res.msg,
                                            type: "error",
                                        });
                                    }
                                });
                            return;
                        }
                        //立即兑换商品
                        this.submitModal();
                    }
                } else {
                    return false;
                }
            });
        },
        changeDefault(item) {
            let params = {
                id: item.id
            };
            this.$http.post(this.$api.updateAddressStatus, params).then((res) => {
                if (res.code == 0) {
                    this.getAddressList();
                    this.$refs["ruleForm"].resetFields();
                    this.$message({
                        message: res.msg,
                        type: "success",
                    });
                } else {
                    this.$message.error(res.msg)
                }
            });
        },
        //编辑、添加用户信息
        exchangeAddress() {
            let { name, phone, province, city, area, address } = this.ruleForm
            let params = {
                name,
                phone,
                province,
                city,
                area,
                address,
                status: this.ruleForm.status ? 1 : 0, //0:非默认，1:默认
                codePrefix: this.$config.codePrefix
            };
            if (this.updateFlag) {
                //表示编辑用户信息
                params.memberName = this.deleteItem.memberName;
                params.memberId = this.deleteItem.memberId;
                params.id = this.deleteItem.id;
            }
            this.$http.post(this.$api.addAddress, params).then((res) => {
                if (res.code == 0) {
                    console.log(222)
                    this.getAddressList();
                    this.editFlag = false;
                    this.ruleForm.phone = ''
                    this.$refs["ruleForm"].resetFields();
                    this.$message({
                        message: this.$t('新增用户信息成功'),
                        type: "success",
                    });
                } else {
                    console.log(2222)
                    this.$message.error(res.msg)
                }
            });
        },
        submitModal() {
            if (this.changeItem.reserveCount <= 0) {
                this.$message({ message: this.$t('商品库存不足，无法兑换'), type: "error" });
                return;
            }
            if (this.totalPrice > this.$store.state.userRmb) {
                //判断用户腾博是否大于兑换商品所需腾币
                this.visibleTip = true;
                return;
            }
            let params = {
                count: this.count,
                id: this.changeItem.id,
                address: this.ruleForm.address,
                phone: this.ruleForm.phone,
                name: this.ruleForm.name,
                remark: this.ruleForm.remark,
                province: this.ruleForm.province,
                city: this.ruleForm.city,
                area: this.ruleForm.area,
            };
            this.$http.post(this.$api.exchange, params).then((res) => {
                if (res.code == 0) {
                    this.changevisible = false
                    this.$message({
                        message: this.$t('恭喜您，成功兑换') + this.changeItem.name + this.$t('，请及时联系客服处理提供收件人相关信息'),
                        type: "success",
                    });
                    this.changevisible = false;
                    this.$refs["ruleForm"].resetFields();
                    this.getMemberPoint();
                } else {
                    this.$message({ message: res.msg, type: "error" })
                }
            });
        },
        //更新剩余币数
        getMemberPoint() {
            if (!this.$common.getUser()) return
            this.$http.get(this.$api.getMemberPoint).then((res) => {
                if (res.code == 0) {
                    this.setUserRmb(res.data.balance);
                }
            });
        },
        //点击最大数量
        setCount() {
            if (this.changeItem.reserveCount <= 0) {
                this.$message({ message: this.$t('商品库存不足，无法兑换'), type: "error" });
                return;
            }
            this.count = this.changeItem.reserveCount;
        },
    },
    watch: {
        isShowBox(newData) {
            if (newData == false) {
                this.setWidthFlag = false;
            }
        },
        count(newData) {
            if (newData) {
                this.totalPrice = newData * 1 * this.changeItem.amount;
            }
        },
        changeItem(newData) {
            if (newData) {
                this.totalPrice = newData.amount * 1;
            }
        },
        editFlag(newData) {
            if (!newData) {
                this.$refs["ruleForm"].resetFields();
                this.ruleForm.remark = "";
                this.ruleForm.status = false;
            }
        },
        changevisible(newData) {
            if (newData == false) {
                this.$refs["ruleForm"].resetFields();
                this.totalPrice = 0;
                this.count = 0;
                this.changeItem = {};
                this.editFlag = false;
                this.ruleForm.remark = "";
            } else {
                this.getAddressList();
                if(this.limitCount == 0){   //根据后台数据控制加减数量
                    this.count = 1;
                }else{
                    this.count = this.limitCount;
                    this.changeItem.reserveCount = this.limitCount;
                }
            }
        },
    },
};
</script>
<style lang='scss'>
.el-button--default {
    color: #999;
    width: 88px;
    height: 38px;
    box-sizing: border-box;
}
.el-button--default:hover {
    background-color: transparent;
    color: #000;
    border: none;
    border: 1px solid #dcdfe6;
}
.el-button--primary,
.el-button--primary:hover {
    background-color: #E73621;
    border: none;
    width: 108px;
    height: 38px;
}
.popper__arrow::after,
.popper__arrow {
    border-top-color: transparent !important;
    display: none !important;
}
.Modal {
    .el-input.is-disabled .el-input__inner {
        background: #eee !important;
        color: #aaa;
        border: 1px solid #d0d0d0;
        cursor: not-allowed !important;
    }
    .checkbox {
        .el-checkbox__input.is-checked + .el-checkbox__label {
            color: rgb(248, 90, 63) !important;
        }
    }
    .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #606266 !important;
    }
    .changeModal.el-dialog__wrapper {
        .el-dialog {
            border-radius: 12px;
            width: 1200px !important;
            box-sizing: border-box;
        }
        .el-dialog__header {
            border-bottom: 1px solid #e8e8e8 !important;
            padding: 20px !important;
            padding-right: 55px!important;
        }
        .el-dialog__body {
            padding: 0 !important;
        }
    }
    .deleteModal.el-dialog__wrapper {
        .el-dialog {
            padding: 20px !important;
            border-radius: 5px !important;
            .el-dialog__body {
                padding: 20px 0 !important;
            }
            .el-dialog__header {
                border: none !important;
                padding: 0 !important;
            }
            .el-dialog__headerbtn {
                font-size: 24px !important;
            }
            .el-dialog__footer {
                padding: 0 !important;
            }
            .el-button--default,
            .el-button--primary {
                width: 56px !important;
                height: 32px !important;
            }
        }
    }
}
.setWidthClass {
    .changeModal.el-dialog__wrapper {
        .el-dialog {
            border-radius: 12px;
            width: 980px !important;
            box-sizing: border-box;
        }
    }
}
.openModal.el-dialog__wrapper {
    .el-dialog {
        .el-dialog__header {
            padding: 20px !important;
        }
        .el-dialog__body {
            padding: 10px 30px 0 !important;
        }
        .el-dialog__footer {
            padding: 10px 30px 20px !important;
        }
    }
}
</style>
<style lang="scss" scoped>
.Modal {
    .dian {
        color: rgb(248, 90, 63);
        font-size: 20px;
        position: relative;
        margin-right: 5px;
        top: 5px;
    }
    .changeModal {
        .changeBox {
            display: flex;
            .boxLeft {
                width: 400px;
                box-sizing: border-box;
                .modalContent {
                    text-align: center;
                    padding: 30px;
                    border-right: 1px solid #e8e8e8;
                    .tip {
                        color: #E73621;
                        margin-bottom: 0;
                        margin-top: 30px;
                        text-align: left;
                    }
                    .picter {
                        width: 200px;
                        height: 200px;

                        border: 1px solid #dcdcdc;
                        margin: auto;
                        position: relative;
                        .img {
                            width: 120px;
                            height: 120px;
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                    }
                    .content {
                        background-color: #f6f6f6;
                        height: 81px;
                        box-sizing: border-box;
                        margin-bottom: 12px;
                        color: #999;
                        text-align: left;
                        margin-top: 10px;
                        padding: 12px 15px;
                        display: flex;
                        justify-content: flex-start;
                        p {
                            margin-bottom: 0;
                        }
                        .price {
                            .boxprice {
                                margin: 0;
                                margin-bottom: 5px;
                            }
                            width: 44%;
                            padding-bottom: 12px;
                            .redPrice {
                                color: #CCA456;
                            }
                        }
                        .number {
                            flex: 1;
                            padding-bottom: 12px;
                            p {
                                margin: 0;
                            }
                            .maxClass {
                                line-height: 34px;
                                font-size: 14px;
                                color: #008dff;
                                vertical-align: middle;
                                padding: 0 0.5em;
                                cursor: pointer;
                                white-space: nowrap;
                            }
                        }
                    }
                    .allPrece {
                        text-align: left;
                        line-height: 38px;
                        margin-top: 30px;
                        font-size: 13px;
                        color: #999;
                        .price {
                            color: #CCA456;
                        }
                    }
                }
            }
            .boxRight {
                flex: 1;
                padding: 30px;
                box-sizing: border-box;
                .tip {
                    color: #E73621;
                    margin-bottom: 0;
                    text-align: left;
                }
                .father {
                    display: flex;
                    justify-content: flex-start;
                    flex-flow: wrap;
                }
                .list {
                    width: 220px;
                    height: 150px;
                    overflow: hidden;
                    position: relative;
                    border-radius: 8px;
                    box-shadow: 0 0 10px #00000014;
                    margin: 15px 0 0 19px;
                    background: #f8f8f8;
                    border: 1px solid #aaa;
                    cursor: pointer;
                    -webkit-transition: all 0.1s linear;
                    transition: all 0.1s linear;
                    .detail {
                        padding: 10px 20px;
                        line-height: 30px;
                        position: relative;
                        .icon {
                            position: absolute;
                            font-size: 18px;
                            right: 10px;
                            color: silver;
                            transition: all 0.5s;
                            display: none;
                        }
                        .icon:hover {
                            font-size: 22px;
                            font-weight: 600;
                            color: red;
                        }
                        p {
                            margin: 0;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }
                    }
                    .btnChange {
                        float: right;
                        margin-right: 10px;
                        border: 1px solid #FF782F;
                        color: #FF782F;
                    }
                }
                .list:hover {
                    border-color: #aaa;
                    background: #fafafa;
                    box-shadow: 0 1px 15px #00000033;
                }
                .list:hover .icon {
                    display: block;
                }
                .addlist {
                    border: 1px dashed rgb(170, 170, 170);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .box {
                        text-align: center;
                        .bgc {
                            margin: 0 0 2px;
                            position: relative;
                            display: inline-block;
                            width: 48px;
                            height: 48px;
                            background: url("../../../assets/shop/addlist.png") no-repeat;
                            background-size: contain;
                        }
                        .tip {
                            color: #000;
                        }
                    }
                }
                .eaitClass {
                    .quester {
                        .icon {
                            color: rgb(248, 90, 63);
                            font-size: 16px;
                            cursor: pointer;
                            margin-left: 5px;
                        }
                    }
                    .questerBtn {
                        float: right;
                    }
                }
            }
        }
    }
    .deleteModal {
        .icon {
            font-size: 24px;
            color: #e6a23c;
            vertical-align: bottom;
            margin-right: 10px;
        }
        .cancel:hover {
            color: #E73621;
            border-color: #ffc4bf;
            background-color: #ffebea;
        }
        .cancel:active {
            border-color: #E73621;
        }
    }
    .openModal {
        .tipcon {
            margin-left: 15px;
            display: inline-block;
            height: 68px;
            line-height: 68px;
        }
    }
    .subBtn {
        background: linear-gradient(180deg, #F99541 0%, #E73621 100%);
        color:#fff;
        height:44px;
    }
}
</style>