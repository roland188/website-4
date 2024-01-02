<template>
  <div class="pwdforget">
    <div id="fgPg-wrap" class="fgpw-wrap">
      <div class="lock-pic-wrap">
        <div class="lock-line motion"></div>
      </div>
      <div class="txt-wrap">
        <div class="pw-info-wrap">
          <div class="pw-st-title">{{$t('找回密码')}}</div>
            <!-- 找回密码 -->
          <forgetPsw></forgetPsw>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import forgetPsw from "../../components/forgetPsw/forgetPsw";
export default {
  data() {
    return {};
  },
  components: {
    forgetPsw
  }
};
</script>

<style>
@charset "UTF-8";
.clear,
blockquote,
body,
dd,
div,
dl,
dt,
fieldset,
form,
h1,
h2,
h3,
h4,
h5,
h6,
input,
li,
ol,
p,
pre,
td,
th,
ul {
  margin: 0;
  padding: 0;
}
.clear,
.clearfix:after {
  clear: both;
}
a {
  outline: 0;
}
ol,
ul {
  list-style: none;
}
button,
html input[type="button"],
input[type="reset"],
input[type="submit"] {
  -webkit-appearance: button;
  cursor: pointer;
}
input {
  line-height: normal;
}
button {
  overflow: visible;
}
.clearfix:after,
.clearfix:before {
  content: "";
  display: table;
}
body {
  font-size: 12px;
  background: #293242;
}
.zh-cn body {
  font-family: STHeiti, microsoft yahei, 微软雅黑, SimSun, 宋体, arial;
}
.zh-tw body {
  font-family: microsoft jhenghei, 微軟正黑體, arial, helvetica, sans-serif;
}
@keyframes safe-circle {
  0%,
  100% {
    transform: rotate(0);
  }
  40% {
    transform: rotate(180deg);
  }
  60% {
    transform: rotate(90deg);
  }
}
.fgpw-wrap {
  position: relative;
  margin: 150px auto 0;
  box-sizing: border-box;
  border-radius: 10px;
  padding: 106px 10px 20px;
  background: #fff;
  width: 386px;
  min-height: 510px;
}

.lock-pic-wrap {
  position: absolute;
  top: -140px;
  left: 50%;
  margin-left: -106px;
  width: 212px;
  height: 235px;
  /*background: url(../../assets/image/safe.svg) 50% 0 no-repeat;*/
  /*background: url(../../assets/image/safe.png) 50% 0 no-repeat\9;*/
}
.lock-pic-wrap .lock-line {
  position: absolute;
  left: 39px;
  top: 49px;
  width: 135px;
  height: 135px;
  /*background: url(../../assets/image/safe-line.svg) 50% 0 no-repeat;*/
  background: 0 0\9;
}
.lock-pic-wrap .lock-line.motion {
  animation: safe-circle 8s infinite linear;
}

.pw-info-wrap .pw-st-title {
  color: #242424;
  font-size: 22px;
  text-align: center;
  letter-spacing: 2px;
}
</style>