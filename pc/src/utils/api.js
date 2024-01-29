/*
 * @Description: 项目模块
 * @Version: 1.0
 * @Autor: steFan
 * @Date: 2020-03-19 14:01:03
 * @LastEditors: steFan
 * @LastEditTime: 2020-03-19 18:45:19
 */
let dzr = {
  banklist: "/pay/api/v1/memberBanks/list", //获取我的银行卡列表
  bindBankNnm: "/longm/api/v1/settings/get/withdraw_open", //获取绑定银行卡数
  addbank: "/pay/api/v1/memberBanks", //添加银行卡
  mygame: "/game/api/v1/game/getPlayerRecentGame", //我的游戏
  oneKeyBalance: "/game/api/v1/game/oneKeyBalanceCollection", //一键归集
  getGameMoneyList: "/game/api/v1/game/getAllBalances", //获取游戏厂商列表
  getuserMoney: "/game/api/v1/game/getAllBalances", //获取账户余额
  querybank: "/pay/api/v1/banks/list", //查找银行列表
  queryBalance: "/wallet/api/v1/money/queryBalance", //中心钱包余额，可提现
  getCurrentAudit: "/pay/api/v1/audit/getCurrentAudit", //获取手续费，行政费用等
  getlistPayWays: "/pay/api/v1/deposit/listPayWays", //获取充值方式
  getPaymentNextStep: "/pay/api/v1/deposit/entranceDeposit", //充值入口
  entranceWithdraw: "/pay/api/v1/withdraw/entranceWithdraw", //提款
  getRebateAmount: "/wallet/api/v1/rebates/getRebateAmount?memberId=", //查询反水
  receiveRebate: "/wallet/api/v1/rebates/receiveRebate?memberId=", //领取反水
  removeBack: "/pay/api/v1/memberBanks/", //删除银行卡
  getThematicActivitiesListByApp:
    "/longm/api/v1/thematicActivities/getThematicActivitiesListByApp", //获取专题活动列表
  getThematicActivitiesByApp:
    "/longm/api/v1/thematicActivities/getThematicActivitiesByApp", //app端专题活动详情
  getListFloatingWindows:
    "/longm/api/v1/settingsEntryWindows/listFloatingWindows", // 获取浮悬框列表
  signIn: "/longm/api/v1/thematicActivities/signIcn", //点击签到
  firstWithdraw: "/pay/api/v1/withdrawRecords/firstWithdraw", //验证是否首次
  getBindSmsSetting: "/longm/api/v1/settings/getBindSmsSetting", //判断获取绑定银行卡短信设置
  getPopUpAdsSetting: "/longm/api/v1/settings/getPopUpAdsSetting", //设置广告弹出啊条件
  getGuideAd: "/longm/api/v1/guideAd/list", //获取多窗口广告弹窗
  interestRecordList: "/wallet/api/v1/interest/interestRecordList", //利息宝记录列表
  interestList: "/wallet/api/v1/interest/list", //利息宝列表
  interestDetail: "/wallet/api/v1/interest/interestDetail", //利息宝详情
  profitForecast: "/wallet/api/v1/interest/profitForecast", //预计盈利
  joininterest: "/wallet/api/v1/interest/join", //参与利息宝活动
  receiveInterest: "/wallet/api/v1/interest/receiveInterest", //领取金额
};

const api = {
  validateLogin: "/member/api/v1/memberValidate/validateLogin", //判断是否异常登录接口
  validateRealName: "/member/api/v1/memberValidate/validateRealName", //判断真实用户名
  customerService: "/longm/api/v1/customers/app/getList", //客服
  captcha: "/member/api/v1/members/captcha",
  login: "/member/api/v1/members/login",
  banner: "/longm/api/v1/banners/app/list",
  members: "/member/api/v1/members", //用户信息
  //-------------ptg--------------
  menusList: "/longm/api/v1/menus/list", //获取游戏菜单
  recommendGame: "/game/api/v1/game/recommendGame", //推荐游戏
  gamesDetail: "/game/api/v1/games", //获取游戏详情
  getToken: "/game/api/v1/game/getToken", //获取游戏链接
  hotGame: "/game/api/v1/game/hotGame", //热门游戏
  vendorGame: "/game/api/v1/manager/vendorGame", //获取三级
  getGameByIds: "/game/api/v1/games/getGameByIds", //
  getListCustomer: "/longm/api/v1/customers/app/getList", //获取客服地址
  //-------------ptg--------------
  // -----------------------------------------------------------------------------------------------------------------------xf-start
  afterGameTransfer: "/game/api/v1/game/afterGameTransfer",
  announcement: "/longm/api/v1/notices/app/home/list",
  pcOnlinePayRecordsList: "/pay/api/v1/onlinePayRecords/pcOnlinePayRecordsList", //充值记录
  bankTransfer: "/pay/api/v1/offlineRecords/pageLlist", //银行转账
  withdrawalsRecords: "/pay/api/v1/withdrawRecords/appWithdrawRecordsList", //提款记录
  rebates: "/wallet/api/v1/rebates/appList", //返水记录
  logout: "/member/api/v1/members/logout", //退出登录
  searchGame: "/game/api/v1/games/searchGame", //游戏搜索
  balance: "/game/api/v1/game/getAllBalances", //用户余额查询
  query: "/game/api/v1/game/queryBetRecords", //投注记录查询
  platform: "/game/api/v1/vendorCallback/getAllVendorAndKindInfoByapp", //游戏平台列表get
  clientCode: "/game/api/v1/background/platform/clientCode", //获取客服
  codeList: "/longm/api/v1/appVersion/app/list", //获取二维码
  getPartake: "/longm/api/v1/activities/getPartake", //活动记录
  appActDetail: "/longm/api/v1/activities/appActDetail/", //活动记录详情
  getJackpot: "/game/api/v1/game/getJackpot", //获取将次金额
  appSave: "/agent/api/v1/agent/appSave", //获取将次金额
  getContact: "/game/api/v1/background/platform/clientCode", //获取合作专区的联系方式
  getCenterWallet: "/wallet/api/v1/money/getCenterWallet?memberId=", //冻结金额
  getList: "/pay/api/v1/accountMoneyChange/getList", //其它
  getAppList: "/wallet/api/v1/bonus/getAppList", //彩金列表
  receive: "/wallet/api/v1/bonus/receive/", //领取彩金
  getNotReceive: "/wallet/api/v1/bonus/getNotReceive", //彩金状态
  getDigitRate: "/pay/api/v1/deposit/getDigitRate", //获取汇率
  listDigitPayWays: "/pay/api/v1/deposit/listDigitPayWays", //绑定数字货币列表
  memberRegister: "/longm/api/v1/settings/get/", //代理显示项
  listQuickEntry: "/longm/api/v1/settingsEntryWindows/listQuickEntry", //头部动态设置选项及颜色等
  availableAmount: "/wallet/api/v1/allowance/availableAmount", //会员可领取返利金额
  validMemberCount: "/wallet/api/v1/allowance/validMemberCount", //有效会员
  getReceive: "/wallet/api/v1/allowance/receive", //领取返利
  referralLink: "/member/api/v1/members/referralLink", //获取返利邀请码及链接
  allowanceExplain: "/wallet/api/v1/allowance/allowanceExplain", //高額返利規則
  getSettings: "/longm/api/v1/settings/get/", //高额返利显示隐藏
  memberAllowanceCount: "/wallet/api/v1/allowance/memberAllowanceCount", //会员邀请人数
  memberAllowanceRecord: "/wallet/api/v1/allowance/memberAllowanceRecord", //会员邀请查询
  existRunningStatus: "/wallet/api/v1/interest/existRunningStatus", //判断进行中利息宝

  getWaterBallList:
    "/longm/api/v1/thematicActivities/getWaterBallList?clientItem=", //请求活动打码列表
  getReceives: "/longm/api/v1/thematicActivities/receive?thematicActivitiesId=", ///自助优惠领取
  getSbwReceive:
    "/longm/api/v1/thematicActivities/receive?thematicActivitiesId=", ///自助优惠领取

  // -----------------------------------------------------------------------------------------------------------------------xf-end

  // ------------qq
  register: "/member/api/v1/members/register", //注册
  sendSmsCode: "/member/api/v1/members/mobile", //获取短信验证码
  mobilebyacc: "/member/api/v1/members/mobilebyacc", // 通过账号获取验证码
  getReceiveActivities:
    "/longm/api/v1/thematicActivities/receive?thematicActivitiesId=", //自助优惠领取
  updateInfo: "/member/api/v1/members/", //修改个人信息
  bindPhone: "/member/api/v1/members/bindPhone", //绑定手机
  updatePassword: "/member/api/v1/members/updatePassword", //修改登录密码
  withdrawPassSet: "/member/api/v1/members/withdrawPass", //设置资金密码
  withdrawPass: "/member/api/v1/members/withdrawPass", //修改资金密码
  getMemberByName: "/member/api/v1/members/getMemberByName", //根据账号名称查询会员手机号
  checkSmsCode: "/member/api/v1/members/checkSmsCode", //前台验证短信验证码
  resetMemberPwdByClient: "/member/api/v1/members/resetMemberPwdByClient", //前台根据手机号重置用户密码
  message: "/longm/api/v1/messages/list", //站内信列表
  messageInfo: "/longm/api/v1/messages/get/", //站内信详情
  readMessages: "/longm/api/v1/messages/read", //站内信标记已读
  deleteMessage: "/longm/api/v1/messages/delete/", //删除站内信
  deleteMessages: "/longm/api/v1/messages/delete", //批量删除站内信
  noticeList: "/longm/api/v1/notices/app/home/list", //公告列表
  noticeInfo: "/longm/api/v1/notices/app/", //公告详情
  readNotice: "/longm/api/v1/notices/readNotices", //公告标记已读
  activity: "/longm/api/v1/activities/list", //优惠活动列表
  activityType: "/longm/api/v1/settings/getSettingsByType/7", // 优惠分类
  activityInfo: "/longm/api/v1/activities/appGet/", //活动详情
  joinAct: "/longm/api/v1/activities/joinAct", //用户参与活动
  getTokenUrl: "/game/api/v1/game/getToken", //获取游戏链接
  getvipdata: "/member/api/v1/memberLevels/", //获取会员等级信息
  getVipList: "/member/api/v1/memberLevels/app/list", //获取会员列表，
  getReturnWaterMoney: "/wallet/api/v1/rebates/getRebateAmount", //查询用户待领取返水金额
  getRegisterSet: "/longm/api/v1/settings/get/", //获取注册设置
  getRebateAmountDetail: "/wallet/api/v1/rebates/getRebateAmountDetail", //平台查询用户待领取返水金额明细
  getDetailByBetNo: "/wallet/api/v1/rebates/getDetailByBetNo", //app返水记录查询批次信息
  getAgentCommissionPlan:
    "/longm/api/v1/agentCommissionPlan/getAgentCommissionPlan",
  getDefaultStatus: "/member/api/v1/validateCode/getDefaultStatus", //获取验证码类型
  geetFirstRegister: "/member/api/v1/geeTest/firstRegister", //获取gt
  sendValidateSmsCode: "/member/api/v1/memberValidate/sendValidateSmsCode", //发送验证码
  checkValidateSmsCode: "/member/api/v1/memberValidate/checkValidateSmsCode", //验证身份
  getPhonelist: "/member/api/v1/members/memberDeviceFeatureCode/list/", //查找设备
  deletePhoneid: "/member/api/v1/members/memberDeviceFeatureCode/del/", //解绑设备
  getActivationPage: "/longm/api/v1/activationCode/getActCode", // 获取激活码活动
  getActivationCdk: "/longm/api/v1/activationCode/receiveCdk", // 领取CDK列表
  getVipfaq: "/member/api/v1/vipGuide/get", // vip 规则说明
  allHour: "/longm/api/v1/customerDomain/getCustomerDomain", // GET 获取24h客服域名
  getSpinBigWheel: "/longm/api/v1/thematicActivities/spinBigWheel", // 抢红包
  getUserLevel: "/member/api/v1/memberNewVipLevel/getLevel", //vip
  getUserVIPlist: "/member/api/v1/memberNewVipLevel/getAppLevel",
  // 兑换码
  exchangeRedeemCode: "/wallet/api/v1/bonus/exchangeRedeemCode",
  // 积分商城
  getClientMall: "/mall/api/v1/clientMall/getClientMall", //获取商城信息'
  doSignIn: "/mall/api/v1/sign/doSignIn", //会员签到
  getSignPrecondition: "/mall/api/v1/sign/getSignPrecondition", //会员签到前置信息
  getMemberPoint: "/mall/api/v1/memberPoint/getMemberPoint", //获取会员积分信息'
  exchangeRecordList:
    "/mall/api/v1/shoppingExchangeRecord/listShoppingExchangeRecord", //兑换记录列表
  doLottery: "/mall/api/v1/shoppingMall/doLottery", //会员抽奖'
  shoppingMallList: "/mall/api/v1/shoppingMall/list", //商品列表
  exchange: "/mall/api/v1/shoppingMall/exchange", //商品兑换
  // addressList: '/mall/api/v1/shoppingExchangeAddress/list',   //收货地址列表
  addressList: "/member/api/v1/members/{id}", //收货地址列表
  updateAddressStatus: "/member/api/v1/members/updateAddressStatus", //修改默认收货地址列表
  exchangeAddress: "/mall/api/v1/shoppingExchangeAddress", //新增或更新收货地址
  addAddress: "/member/api/v1/members/addAddress", //新增用户地址
  deleteAddress: "/mall/api/v1/shoppingExchangeAddress", //删除用户地址
  waterRecordList: "/mall/api/v1/memberPoint/pageMemberPointChange", //获取会员积分账变流水
  associate: "/mall/api/v1/shoppingMall/updateLotteryGoodsAddress", //关联会员抽奖实物的物流信息,用在抽奖实物'
  getLangList: '/longm/api/v1/language/list', //获取语言

  // ------------qq
  ...dzr,
};
module.exports = api;
