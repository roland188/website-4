const api = {
    getUserInfo:'/member/api/v1/members', // 获取用户信息 appid
    getFrontList:'/longm/api/v1/settings/get/customer_center', // GET 客服模块获取前端列表
    suggest:'/longm/api/v1/complaintWithProposal/saveComplaintWithProposal', // POST 客服中心-投诉与建议（@author：小呆）提交投诉与建议
    problemList:'/longm/api/v1/frequentlyAskedQuestion/listFrequentlyAskedQuestion', // POST 客服中心-客服FAQ（@author：小呆） 常见问题列表查询
    list:'/longm/api/v1/customers/app/getList',
    addDespening:'/longm/api/v1/applyArrivedRecord', //  POST 添加出款未到账
    despeningList:'/longm/api/v1/applyArrivedRecord/list', // POST 出账未到账记录
    addSaveApply:'/longm/api/v1/depositUncollectedApply/saveDepositUncollectedApply', // POST 提交存款掉单申请
    saveApplyList:'/longm/api/v1/depositUncollectedApply/listDepositUncollectedApply', // POST 存款调单申请列表
    allHour:'/longm/api/v1/customerDomain/getCustomerDomain', // GET 获取24h客服域名
    applyUrl:'/longm/api/v1/discountDomain/getOne', // GET 获取自助优惠申请接口 
    getPhoneCode:'/member/api/v1/members/mobile', // GET 获取手机验证码
    mobilebyacc: '/member/api/v1/members/mobilebyacc', // GET 通过账号获取验证码
    getImgCode:'/member/api/v1/members/captcha', // GET 获取图片验证码
    uploader:'/longm/api/v1/file/upload', // POST 文件上传
    thaw:'/member/api/v1/customerCenter/accountThaw', // POST  账号解冻
    vertifyInfo:'/member/api/v1/customerCenter/validateMember', // POST 验证会员信息
    vertifySmscode:'/member/api/v1/customerCenter/validateSmsCode', // POST 验证短信验证码
    resetPassword:'/member/api/v1/customerCenter/resetPassword', // POST 重置密码
    bankInfo:'/pay/api/v1/customerCenter/bankList', // POST 获取会员银行卡信息
    updateBankInfo:'/pay/api/v1/customerCenter/updateBank', // POST 更新会员银行卡
    phoneUser:'/longm/api/v1/customerPhoneRecord', // POST 添加记录
}
module.exports = api;