<template>
    <div class="securityCenter personal">
        <el-collapse accordion>
            <el-collapse-item :title="$t('账户密码')" name="1">
                <!-- 账号密码 -->
                <accountPwd/>
            </el-collapse-item>
            <el-collapse-item :title="$t('交易密码')" name="2">
                <!-- 交易密码 -->
                <TransactionPdw/>
           </el-collapse-item>
            <el-collapse-item :title="$t('设备管理')" name="3">
                <!-- 设备管理 -->
                <Equipment/>
           </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
import accountPwd from './accountPwd'
import TransactionPdw from './TransactionPdw'
import Equipment from './equipment'
export default {
  name: "securityCenter",
  components:{
      accountPwd,
      TransactionPdw,
      Equipment
  },
  data() {
    return {

    };
  },
  created(){
  },
  methods:{
  }
};
</script>
<style >
   .personal .el-input__inner{
       height: 0.44rem;
       line-height: 0.44rem;
       border: none;
       padding-left: 0.08rem!important;
   }
   .personal .el-input__inner::-webkit-input-placeholder{
       color: #616161;
   }
   .securityCenter .el-collapse-item__header{
       padding: 0 0.16rem;
   }
</style>
<style scoped>
.securityCenter{
        padding-left: 25%;
        padding-right: 25%;
    }
.personal{
    padding: 0 25%;
}
.personal .input{
    background-color: #fff;
    border: 1px solid #ccc;
}
.perDialog {
  box-sizing: border-box;
  position: relative;
}

.alertHeader {
  padding: 0.32rem;
  border-top-left-radius: 0.1rem;
  border-top-right-radius: 0.1rem;
  position: relative;
}
.alertTitle {
  font-size: 24px;
}
.perBody {
  min-height: 6.27rem;
  padding: 0 0.7rem 0.4rem;
  box-sizing: border-box;
  position: relative;
}
.perNav {
  padding-bottom: 0.2rem;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}
.perNavBtn {
  width: 0.94rem;
  height: 0.49rem;
  border-bottom: 0.03rem solid transparent;
  font-size: 0.14rem;
}
.perRow {
  padding: 0.16rem;
  box-sizing: border-box;
  display: flex;
}
.perRow > div,
.perRow > input {
  height: 0.44rem;
  line-height: 0.44rem;
}
.perRow > div:nth-child(1) {
  font-size: 0.15rem;
  flex: 1;
  display: flex;
  box-sizing: border-box;
}
.perRow > input {
  flex: 4;
}

.perInfoRow > input {
  flex: 5;
}
.infoSex {
  font-size: 0.15rem;
}
.infoSex > div:nth-child(1) {
  flex: none;
  width: 18%;
}
/* .infoSex > input {
  flex: none;
} */
.infoSex .unSelectRadio {
  width: 0.14rem;
  height: 0.14rem;
  border: 0.01rem solid rgba(51, 51, 51, 1);
  border-radius: 50%;
  opacity: 1;
  position: relative;
  margin-right: 0.14rem;
}

.infoSex .selectRadio {
  border: 0.01rem solid rgba(50, 160, 237, 1);
}
.infoSex .selectRadioInner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0.07rem;
  height: 0.07rem;
  background: rgba(50, 160, 237, 1);
  border-radius: 50%;
  opacity: 1;
}

.smsCode {
  position: relative;
}
.smsCode > div:nth-child(1) {
  flex: none;
  width: 20%;
}
.smsCode > input {
  width: calc(80% - 1.08rem);
  flex: none;
  padding-right: 0.11rem;
  box-sizing: border-box;
}
.smsCodeBtn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 1rem;
  height: 0.34rem;
  background: #329feb;
  border-radius: 0.04rem;
  font-size: 0.12rem;
  color: #fff;
  z-index: 99;
}
.smsCodeDisabled {
  opacity: 0.5;
}
.perSubmit {
  margin-top: 0.2rem;
  box-sizing: border-box;
  text-align: center;
  padding: 0 0.16rem;
}
.perSubmit > div {
  width: 100%;
  height: 0.46rem;
  border-radius: 0.25rem;
  font-size: 0.16rem;
}
.bindedPhoneNumber {
  flex: 5;
  padding-left: 0.08rem;
  border: 1px solid rgba(204, 214, 228, 1);
  border-radius: 0.08rem;
  box-sizing: border-box;
  color: #999999;
}
.myDatePicker {
  position: absolute;
  top: 0;
  left: 0;
  width: 100% !important;
  height: 0.44rem;
  z-index: 99;
}

.myDatePicker > input {
  padding: 0 !important;
}
/* .myDatePicker > input::placeholder {
  font-size: 0.14rem !important;
  color: #a7a7a7;
} */
</style>
<style lang="less">
.el-dialog {
  /* 居中对齐 */
  margin: 0 !important;
  position: absolute !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.personal .el-dialog {
  max-height: 100% !important;
}
.perDialog .el-dialog__header {
  padding: 0 !important;
}

.perDialog .el-dialog__body {
  padding: 0 !important;
}
.perDialog .el-date-editor.el-input {
  width: 100%;
}
// 禁用样式
.perDialog .el-input.is-disabled .el-input__inner {
  background: #f4f4f4;
  color: #9695a6 !important;
}
.perDialog .el-input--suffix .el-input__inner {
  height: 0.44rem;
  line-height: 0.44rem;
  padding-left: 0.08rem;
  // border: 1px solid rgba(204, 214, 228, 1);
  border-radius: 0.08rem;
  box-sizing: border-box;
  font-size: 0.16rem;
  display: flex;
  align-items: center;
  outline: none;
  // color: #333;
}
.perDialog .el-input--suffix .el-input__inner::placeholder {
  font-size: 0.14rem !important;
  // color: #a7a7a7;
}
.perDialog .el-input--suffix .el-input__inner:focus {
  border: 1px solid var(--themeColor) !important;
}
.perDialog .el-input--prefix .el-input__inner {
  padding-right: 0;
}
.perDialog .el-input__prefix {
  left: 0;
}
.perDialog .el-input__prefix i.el-input__icon {
  line-height: 100%;
  display: none;
}

.perDialog .el-input__suffix .el-input__suffix-inner .el-input__icon {
  height: 0.44rem;
  width: 0.25rem;
  text-align: center;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  line-height: 0.44rem;
}

.personal .el-dialog__wrapper {
  overflow: hidden;
}
</style>