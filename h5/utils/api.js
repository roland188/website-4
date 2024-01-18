import config from "./config.js";
import server from "./server.js";
import i18n from '@/i18n/index'

const api = {};
let tokerTimer;

/**
 * 初始化api
 * @param {Function} callback 回调函数
 * @return
 */
api.init = function(callback = null) {
	this.refreshToken(callback);
};

/**
 * 获取图片验证码
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return {String} captchaKey 验证码key
 * @return {String} captchaCode 验证码code
 * @return {String} captcha_image_content base64图片
 */
api.captcha = function(callback = null, isLoading = false) {
	server.get("/member/api/v1/members/captcha", null, callback, isLoading);
};

/**
 * 获取手机验证码
 * @param {String} mobile 手机号
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @param {number} num  功能编号：1其他功能默认配置,2找回密码,3提款短信验证,4平台单发短信发送,5平台短信批量发送
 * @return
 */
api.sendSmsCode = function(mobile, num, callback = null, isLoading = true) {
	server.get("/member/api/v1/members/mobile/" + mobile + "?functionId=" + num + '&codePrefix=84&codeFlag=1', null, callback, isLoading);
};
api.mobilebyacc = function(name, num, callback = null, isLoading = true) {
	server.get("/member/api/v1/members/mobilebyacc/" + name + "?functionId=" + num, null, callback, isLoading);
};

//获取注册设置
api.getRegisterSet = function(key, callback = null, isLoading = true) {
	server.get("/longm/api/v1/settings/get/" + key, null, callback, isLoading);
};

//绑定银行卡-是否开启短信
api.getBindSmsSetting = function(callback = null, isLoading = true) {
	server.get("/longm/api/v1/settings/getBindSmsSetting", null, callback, isLoading);
};

/**
 * 注册
 * @param {String} phone 手机号
 * @param {String} username 用户名
 * @param {String} password 密码
 * @param {String} code 邀请码
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.register = function(data, callback = null, isLoading = true) {
	server.post(
		"/member/api/v1/members/register",
		data,
		function(err, res) {
			if (err) {
				clearToken();
				callback && callback(err);
			} else {
				setToken(res);
				callback && callback(null, res);
			}
		},
		isLoading
	);
};



/**
 * 登录
 * @param {String} phone 手机号
 * @param {String} username 用户名
 * @param {String} password 密码
 * @param {String} code 邀请码
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return {Int} user_id 用户id
 * @return {Int} tenant_id 商户ID
 * @return {Int} username 用户名
 */
api.login = function(data, callback = null, isLoading = true) {
	server.post(
		"/member/api/v1/members/login",
		data,
		function(err, res) {
			if (err) {
				console.log(err);
				clearToken();
				callback && callback(err);
			} else {
				setToken(res);
				callback && callback(null, res);
			}
		},
		isLoading
	);
};

/**
 * 登出
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.logout = function(callback = null, isLoading = true) {
	server.del(
		"/auth/token/logout",
		null,
		function(err, res) {
			if (err) {
				callback && callback(err);
			} else {
				clearToken();
				callback && callback(null, res);
			}
		},
		isLoading
	);
};

/**
 * 彩金
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.getJackpot = function(callback = null, isLoading = false) {
	server.post("/game/api/v1/game/getJackpot", null, callback, isLoading);
};

api.getJackpotList = function(data, callback = null, isLoading = false) {
	server.post("/wallet/api/v1/bonus/getAppList", data, callback, isLoading);
};
api.getJackpotReceive = function(id, callback = null, isLoading = false) {
	server.get("/wallet/api/v1/bonus/receive/" + id, null, callback, isLoading);
};
// 彩金兑换码
api.exchangeRedeemCode = function(data,callback = null, isLoading = false) {
	server.post("/wallet/api/v1/bonus/exchangeRedeemCode", data, callback, isLoading);
};
/**
 * 刷新Token
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.refreshToken = function(callback = null, isLoading = false) {
	var token = server.getRefreshToken();
	if (!token || !token.length) {
		callback &&
			callback({
				code: -4,
				msg: i18n.$t("请重新登录"),
			});
		return;
	}
	server.get(
		"/member/api/v1/members/refresh/" + token,
		null,
		function(err, res) {
			if (err) {
				clearToken();
				callback && callback(err);
			} else {
				setToken(res);
				callback && callback(null, res);
			}
		},
		isLoading
	);
};

/**
 * 获取用户信息
 * @param {Int} id 用户ID
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.userInfo = function(id, callback = null, isLoading = false) {
	server.get("/member/api/v1/members/" + id, null, callback, isLoading);
};
// ptg-api開始
/**
 * 轮播图
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
// huoqu kefudizhi
api.customerGetList = function(callback = null, isLoading = false) {
	server.get("/longm/api/v1/customers/app/getList", null, callback, isLoading);
};
api.banners = function(callback = null, isLoading = false) {
	server.get("/longm/api/v1/banners/app/list", null, callback, isLoading);
};
api.loginTip = function(callback = null, isLoading = false) {
	server.get("/longm/api/v1/settings/get/member_login_tip", null, callback, isLoading);
};
/**
 * 菜单
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.gameMenu = function(callback = null, isLoading = false) {
	server.get("/longm/api/v1/menus/list", null, callback, isLoading);
};

/**
 * 全部游戏接口
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.allKindGames = function(data, callback = null, isLoading = false) {
	server.post("/game/api/v1/games/allKindGames", data, callback, isLoading);
};
/**
 * 公告列表
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.ptgNotices = function(currentPage, pageSize, callback = null, isLoading = false) {
	var data = {
		currentPage,
		pageSize,
	};
	server.post("/longm/api/v1/notices/app/home/list", data, callback, isLoading);
};
/**
 * 畅玩游戏
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.getPlayerRecentGame = function(clientId, clientIp, memberId, username, callback = null, isLoading = false) {
	var data = {
		clientId,
		clientIp,
		memberId,
		username,
	};
	server.post("/game/api/v1/game/getPlayerRecentGame", data, callback, isLoading);
};
/**
 * 热门游戏
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.hotGame = function(callback = null, isLoading = false) {
	server.get("/game/api/v1/game/hotGame", null, callback, isLoading);
};
/**
 * 推荐游戏
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */

api.recommendGameA = function(gameKindId,vendorId,callback = null, isLoading = false) {
	server.get("/game/api/v1/game/recommendGame?gameKindId=" + gameKindId + "&vendorId=" + vendorId,null, callback, isLoading);
};
api.recommendGame = function(callback = null, isLoading = false) {
	server.get("/game/api/v1/game/recommendGame", null, callback, isLoading);
};
/**
 * 游戏详情接口
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.gameDetail = function(gameId, callback = null, isLoading = false) {
	server.get("/game/api/v1/games/" + gameId, null, callback, isLoading);
};

/**
 * 搜索游戏接口
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.gamePageList = function(data, callback = null, isLoading = false) {
	server.post("/game/api/v1/games/pageList", data, callback, isLoading);
};

/**
 * 获取用户信息
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.membersUser = function(id, callback = null, isLoading = false) {
	server.get("/member/api/v1/members/" + id, null, callback, isLoading);
};
/**
 * 搜索游戏接口
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.gameSearch = function(currentPage, pageSize, name, callback = null, isLoading = false) {
	var data = {
		currentPage,
		pageSize,
		name,
	};
	server.post("/game/api/v1/games/searchGame", data, callback, isLoading);
};
/**
 * 获取游戏连接
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.getTokenUrl = function(
	tenantId,
	username,
	vendorId,
	gameId,
	clientIp,
	memberId,
	terminalType = 2,
	callback = null,
	isLoading = false
) {
	var data = {
		tenantId,
		username,
		vendorId,
		gameId,
		clientIp,
		memberId,
		terminalType,
	};
	server.post("/game/api/v1/game/getToken", data, 
	function(err, res) {
		if (err) {
			callback && callback(err);
		} else {
			// #ifdef H5
			if(window.projectImgUrl == 'betc88') {
				if(localStorage.getItem('fbPixelId') && window.fbq){
					fbq('trackCustom', 'h5-enterGame')
				}
			}
			// #endif
			callback && callback(null, res);

		}
	}, isLoading);
};
api.bannerType = function(id,callback = null, isLoading = false) {
	server.get("/longm/api/v1/banners/app/list/" + id, null, callback, isLoading);
	
};
/**
 * 获取游戏连接
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.getTokenUrlNone = function(tenantId, username, vendorId, clientIp, memberId, terminalType = 2, callback = null,
	isLoading = false) {
	var data = {
		tenantId,
		username,
		vendorId,
		clientIp,
		memberId,
		terminalType,
	};
	server.post("/game/api/v1/game/getToken", data, callback, isLoading);
};
/**
 * 修改提款密码
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.withdrawPass = function(newWithdrawpassword, withdrawpassword, callback = null, isLoading = false) {
	var data = {
		newWithdrawpassword,
		withdrawpassword,
	};
	server.post("/member/api/v1/members/withdrawPass", data, callback, isLoading);
};
/**
 * 修改提款密码
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.withdrawPassSet = function(withdrawpassword, callback = null, isLoading = false) {
	var data = {
		withdrawpassword,
	};
	server.post("/member/api/v1/members/withdrawPass", data, callback, isLoading);
};
/**
 * 修改登录密码
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.updatePassword = function(newpassword1, password, callback = null, isLoading = false) {
	var data = {
		newpassword1,
		password,
	};
	server.post("/member/api/v1/members/updatePassword", data, callback, isLoading);
};
/**
 * 获取三级目录
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.getVendorGame = function(data, callback = null, isLoading = true) {
	server.post("/game/api/v1/manager/vendorGame", data, callback, isLoading);
};
/**
 * 所有游戏厂商余额接口
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.ptgOneKeyQueryBalance = function(memberId, clientId, username, clientIp, type, callback = null, isLoading = true) {
	var data = {
		memberId,
		clientId,
		username,
		clientIp,
		type,
	};
	server.post("/game/api/v1/game/oneKeyQueryBalance", data, callback, isLoading);
};
/**
 * 获取余额 = 中心钱包 + 所有厂商余额
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.userBalanceAllVendor = function(memberId, clientId, username, clientIp, callback = null, isLoading = true) {
	var data = {
		memberId,
		clientId,
		username,
		clientIp,
	};
	server.post("/game/api/v1/game/getAllBalances", data, callback, isLoading);
};
/**
 * 一键归集所有游戏商的余额（转账模式）
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.oneKeyBalanceCollectionPtg = function(memberId, clientId, username, clientIp, callback = null, isLoading = false) {
	var data = {
		memberId,
		clientId,
		username,
		clientIp,
	};
	server.post("/game/api/v1/game/oneKeyBalanceCollection", data, callback, isLoading);
};
/**
 * 转账（厂商、中心钱包互转）
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.transfer = function(
	memberId,
	clientId,
	username,
	transferInCode,
	transferInMoney,
	transferInType,
	transferMoney,
	transferOutCode,
	transferOutMoney,
	transferOutType,
	callback = null,
	isLoading = true
) {
	var data = {
		memberId,
		clientId,
		username,
		transferInCode, //转入钱包code
		transferInMoney, //现有的转入金额
		transferInType, //转入钱包类型 1 中心钱包 2 游戏厂商钱包
		transferMoney, //转账金额
		transferOutCode, //转出钱包code
		transferOutMoney, //现有的转出金额
		transferOutType, //转出钱包类型 1 中心钱包 2 游戏厂商钱包
	};
	server.post("/pay/api/v1/moneyFlow/transfer", data, callback, isLoading);
};

/**
 * 转账（厂商、中心钱包互转）
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.test1 = function(uid, callback = null, isLoading = true) {
	var data = {
		uid,
	};
	server.upImg("/wallet/api/v1/moneyFlow/test", data, callback, isLoading);
};
/**
 * 转账（厂商、中心钱包互转）
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.test2 = function(
	memberId,
	clientId,
	username,
	transferInCode,
	transferInMoney,
	transferInType,
	transferMoney,
	transferOutCode,
	transferOutMoney,
	transferOutType,
	callback = null,
	isLoading = true
) {
	var data = {};
	server.post("/wallet/api/v1/moneyFlow/test1", data, callback, isLoading);
};
api.uploadNew = function(file, callback = null, isLoading = true) {
	var data = {
		file,
	};
	server.upImg("/longm/api/v1/file/upload", data, callback, isLoading);
};
/**
 * 退出游戏后自动转账
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.afterGameTransfer = function(callback = null, isLoading = false) {
	server.get("/game/api/v1/game/afterGameTransfer", null, callback, isLoading);
};
/**
 * 根据游戏ids获取详情接口
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.getGameByIds = function(currentPage, pageSize, ids, gameKindId, callback = null, isLoading = false) {
	var data = {
		currentPage,
		pageSize,
		ids,
		gameKindId,
	};
	server.post("/game/api/v1/games/getGameByIds", data, callback, isLoading);
};
/**
 * 平台广告页
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.appAd = function(type, callback = null, isLoading = false) {
	server.get("/longm/api/v1/guideAd/appAd/" + type, null, callback, isLoading);
};
/**
 * 客服
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.clientCode = function(clientCode, callback = null, isLoading = false) {
	server.get("/game/api/v1/background/platform/clientCode/" + clientCode, null, callback, isLoading);
};
/**
 * 下载
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.appCodeList = function(callback = null, isLoading = false) {
	server.get("/longm/api/v1/appVersion/app/list", null, callback, isLoading);
};
api.getCenterWallet = function(memberId, callback = null, isLoading = false) {
	server.get("/wallet/api/v1/money/getCenterWallet?memberId=" + memberId, null, callback, isLoading);
};
api.getCenterWallet = function(memberId, callback = null, isLoading = false) {
	server.get("/wallet/api/v1/money/getCenterWallet?memberId=" + memberId, null, callback, isLoading);
};
///wallet/api/v1/bonus/getNotReceive
api.getNotReceive = function(callback = null, isLoading = false) {
	server.get("/wallet/api/v1/bonus/getNotReceive", null, callback, isLoading);
};
/**
 * 查找币种
 *  @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.listDigitPayWays = function(callback = null, isLoading = false) {
	server.post("/pay/api/v1/deposit/listDigitPayWays", null, callback, isLoading);
};
//充值记录
api.appDigitPayRecordsList = function(callback = null, isLoading = false) {
	server.post("/pay/api/v1/digitPayRecords/appDigitPayRecordsList", null, callback, isLoading);
};
// /pay/api/v1/deposit/listDigitPayWays

/**
 * 查找币种
 *  @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.getDigitRate = function(data, callback = null, isLoading = false) {
	server.post("/pay/api/v1/deposit/getDigitRate", data, callback, isLoading);
};
// ptg-api結束

// 小夫开始//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 游戏列表開始
/**
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.queryBetRecords = function(data, callback, isLoading = false) {
	server.post("/game/api/v1/game/queryBetRecords", data, callback, isLoading);
};
// 游戏列表結束

// 游戏详情開始
/**
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.queryBetRecordsById = function(id, callback, isLoading = false) {
	server.get("/game/api/v1/game/queryBetRecordsById?id=" + id, null, callback, isLoading);
};
// 游戏详情結束

// 游戏平台列表開始
/**
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.getAllVendorAndKindInfoByapp = function(callback, isLoading = false) {
	server.get("/game/api/v1/vendorCallback/getAllVendorAndKindInfoByapp", null, callback, isLoading);
};
// 游戏平台列表結束

// 活动记录開始
/**
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.getPartake = function(data, callback, isLoading = false) {
	server.post("/longm/api/v1/activities/getPartake", data, callback, isLoading);
};
// 活动记录結束

// 线上充值记录開始
/**
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.appOnlinePayRecordsList = function(data, callback, isLoading = false) {
	server.post("/pay/api/v1/onlinePayRecords/appOnlinePayRecordsList", data, callback, isLoading);
};
// 线上充值记录結束

// 线上充值记录详情開始
/**
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.appOnlinePayDetail = function(id, callback, isLoading = false) {
	server.post("/pay/api/v1/onlinePayRecords/appOnlinePayDetail/" + id, null, callback, isLoading);
};
// 线上充值记录详情結束

// 线上转账记录開始
/**
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.appOfflineRecordsList = function(data, callback, isLoading = false) {
	server.post("/pay/api/v1/offlineRecords/appOfflineRecordsList", data, callback, isLoading);
};
// 线上转账记录結束

// 线上转账记录详情開始
/**
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.appOfflineRecordsDetail = function(id, callback, isLoading = false) {
	server.get("/pay/api/v1/offlineRecords/appOfflineRecordsDetail/" + id, null, callback, isLoading);
};
// 线上转账记录详情結束

// 提现记录開始
/**
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.appWithdrawRecordsList = function(data, callback, isLoading = false) {
	server.post("/pay/api/v1/withdrawRecords/appWithdrawRecordsList", data, callback, isLoading);
};

// 提现记录結束

// 提现详情记录開始
/**
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.appWithdrawRecordsDetail = function(id, callback, isLoading = false) {
	server.post("/pay/api/v1/withdrawRecords/appWithdrawRecordsDetail/" + id, null, callback, isLoading);
};

// 提现详情记录结束

// 返水记录列表開始
/**
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.queryRebatesList = function(data, callback, isLoading = false) {
	server.post("/wallet/api/v1/rebates/appList", data, callback, isLoading);
};

// 返水记录列表結束

//数字货币开始
api.appDigitPayRecordsList = function(data, callback, isLoading = false) {
	server.post("/pay/api/v1/digitPayRecords/appDigitPayRecordsList", data, callback, isLoading);
};
//数字货币结束

//数字货币充值详情
api.appDigitPayDetail = function(id, callback, isLoading = false) {
	server.get("/pay/api/v1/digitPayRecords/appDigitPayDetail/" + id, null, callback, isLoading);
};
//数字货币充值详情

// 返回记录详情開始
/**
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.appDetailbyId = function(id, callback, isLoading = false) {
	server.get("/wallet/api/v1/rebates/appDetailbyId?id=" + id, null, callback, isLoading);
};

// 返水记录详情結束

// 个人中心设置获取版本号開始
/**
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.appVersion = function(data, callback, isLoading = false) {
	server.post("/longm/api/v1/appVersion/getMaxAppVersion", data, callback, isLoading);
};
// 个人中心设置获取版本号结束

// 其它
api.getList = function(data, callback, isLoading = false) {
	server.post("/pay/api/v1/accountMoneyChange/getList", data, callback, isLoading);
};

// 个人中心设置更新结束

// 小夫结束//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// --------------qq开始
/**
 * 会员更新
 * @param {Int} userId 用户ID
 * @param {String} email 邮箱
 * @param {String} nickname  真实姓名
 * @param {String} phone 手机号码(只能修改一次)
 * @param {String} qq  QQ号码
 * @param {String} wechat   微信号码
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.updateInfo = function(
	avatar,
	birthday,
	email,
	nickname,
	phone,
	qq,
	realName,
	sex,
	userId,
	wechat,
	codePrefix,
	callback = null,
	isLoading = false
) {
	var data = {
		avatar,
		birthday,
		email,
		nickname,
		phone,
		qq,
		realName,
		sex,
		userId,
		wechat,
		codePrefix,
	};
	server.put("/member/api/v1/members/", data, callback, isLoading);
};

/**
 * 绑定手机
 * @param {String} phone  新手机号
 * @param {String} smsCode 手机验证码
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.bindPhone = function(phone, smsCode, callback = null, isLoading = false) {
	var data = {
		phone,
		smsCode,
	};
	server.post(
		"/member/api/v1/members/bindPhone",
		data,
		function(err, res) {
			if (err) {
				callback && callback(err);
			} else {
				callback && callback(null, res);
			}
		},
		isLoading
	);
};

/**
 * 收件列表
 * @param {Int} currentPage 第几页 从1开始
 * @param {Int} pageSize 每页条数
 * @param {Int} receiverType 收件人类型 0：会员，1：管理员
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return {String} user_name 发件人
 * @return {String} subject 主题
 * @return {String} body 内容
 * @return {String} readted_at 为null未读 有值已读
 */
api.message = function(currentPage, pageSize, receiverType, callback = null, isLoading = true) {
	var data = {
		currentPage,
		pageSize,
		receiverType,
	};
	server.post("/longm/api/v1/messages/list", data, callback, isLoading);
};

/**
 * 站内信详情
 * @param {Int} id 站内信ID
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return 返回数据同 api.message
 */
api.messageInfo = function(id, callback = null, isLoading = true) {
	server.get("/longm/api/v1/messages/get/" + id, null, callback, isLoading);
};

/**
 * 标记已读 todo
 * @param {Int} id id
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.readMessage = function(id, callback = null, isLoading = true) {
	server.put("/longm/api/v1/messages/read/" + id, null, callback, isLoading);
};

/**
 * 批量标记已读 todo
 * @param {Array} messageIds 站内信ids
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.readMessages = function(messageIds, callback = null, isLoading = true) {
	var data = {
		messageIds,
	};
	server.put("/longm/api/v1/messages/read", data, callback, isLoading);
};

/**
 * 删除站内信
 * @param {number}  id 站内信id
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.deleteMessage = function(id, callback = null, isLoading = false) {
	server.del("/longm/api/v1/messages/delete/0/" + id, null, callback, isLoading);
};

/**
 * 批量删除站内信
 * @param {Array} messageIds 站内信ids
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.deleteMessages = function(messageIds, type, callback = null, isLoading = false) {
	var data = {
		messageIds,
		type,
	};
	server.delArray("/longm/api/v1/messages/delete", data, callback, isLoading);
};

/**
 * 公告列表
 * @param {String} createdAt 创建时间
 * @param {Int} currentPage 第几页 从1开始
 * @param {Int} pageSize 每页条数
 * @param {String} publishedAt 发布时间
 * @param {String} subject 公告主题
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return {String} user_name 发件人
 * @return {String} subject 主题
 * @return {String} body 内容
 * @return {String} readted_at 为null未读 有值已读
 */
api.noticeList = function(createdAt, currentPage, pageSize, publishedAt, subject, callback = null, isLoading = true) {
	var data = {
		createdAt,
		currentPage,
		pageSize,
		publishedAt,
		subject,
	};
	server.post("/longm/api/v1/notices/app/home/list", data, callback, isLoading);
};

/**
 * 公告详情
 * @param {Int} id 公告ID
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return 返回数据同 api.message
 */
api.noticeInfo = function(id, callback = null, isLoading = true) {
	server.get("/longm/api/v1/notices/app/" + id, null, callback, isLoading);
};

/**
 * 标记已读 todo
 * @param {String} content 公告内容
 * @param {Int} delFlag 删除标记
 * param {String} endAt 公告截至时间
 * param {Int} id id
 * param {Int} memberId id 用户id(必填)
 * param {Array} noticeIds  公告数组
 * param {String} operator 操作人
 * param {String} publishedAt 发布时间
 * param {Int} publishedAtType 发布时间类型: 0 立即 1 提定时间
 * param {Int} readFlag 已读状态 0 未读 1已读
 * param {Int} status 发布状态1已发布0未发布
 * param {String} subject 公告主题
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.readNotice = function(
	content,
	delFlag,
	endAt,
	id,
	memberId,
	noticeIds,
	operator,
	publishedAt,
	publishedAtType,
	readFlag,
	status,
	subject,
	callback = null,
	isLoading = true
) {
	var data = {
		content,
		delFlag,
		endAt,
		id,
		memberId,
		noticeIds,
		operator,
		publishedAt,
		publishedAtType,
		readFlag,
		status,
		subject,
	};
	server.post("/longm/api/v1/notices/readNotices", data, callback, isLoading);
};

/**
 * 活动列表
 * @param {Int} pageSize 每页条数
 * @param {Int} currentPage 第几页 从1开始
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return {Int} meta.pagination.total 总条数
 * @return {Int} meta.pagination.count 当前页条数
 * @return {Int} meta.pagination.per_page 每页条数
 * @return {Int} meta.pagination.current_page 第几页
 * @return {Int} meta.pagination.total_pages 总页数
 * @return {Int} data.id 活动id
 * @return {String} data.name 活动名称
 * @return {String} data.start_time 活动开始时间
 * @return {String} data.end_time 活活动结束时间
 * @return {Int} data.type 活动类型 0站内活动 1专题活动 2客服领取 3宣传优惠
 * @return {Int} data.picture 活动图片,用config.host拼接
 * @return {Int} data.rules 活动规则,点击图片后用webview显示
 */
api.activity = function(currentPage, pageSize, ascriptionType = "", callback = null, isLoading = true) {
	var data = {
		currentPage,
		pageSize,
		ascriptionType,
	};
	server.post("/longm/api/v1/activities/list", data, callback, isLoading);
};

api.activityType = function(data, callback = null, isLoading = false) {
	server.get("/longm/api/v1/settings/getSettingsByType/7", data, callback, isLoading);
};
/**
 * 活动详情
 * @param {Int} id 活动ID
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return 返回数据同 api.activity
 */
api.activityInfo = function(id, callback = null, isLoading = true) {
	server.get("/longm/api/v1/activities/appGet/" + id, null, callback, isLoading);
};

//用户参与活动 

api.getAutoJoinAct = function(data, callback = null, isLoading = true) {
	server.put("/longm/api/v1/activities/autoJoinAct?memberId=" + data, null, callback, isLoading);
};

api.ptgNotices = function(currentPage, pageSize, callback = null, isLoading = false) {
	var data = {
		currentPage,
		pageSize,
	};
	server.post("/longm/api/v1/notices/app/home/list", data, callback, isLoading);
};
/**
 * 上传文件
 * @param {String} file 文件地址
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return {String} url 图片绝对地址
 * @return {String} fileName 文件名字
 */
// api.upload = function(file, callback = null, isLoading = true) {
// 	server.upImg('/longm/api/v1/file/upload', file, null, callback, isLoading);
// };
api.uploadNew = function(file, callback = null, isLoading = true) {
	var data = {
		file,
	};
	server.upImg("/longm/api/v1/file/upload", data, callback, isLoading);
};
//-------------------qq结束

//dze--开始
/**
 * 获取银行卡列表
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.getbankcardlist = function(callback = null, isLoading = true) {
	server.get("/pay/api/v1/memberBanks/list", null, callback, isLoading);
};

/**
 * 查找银行
 *  @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
api.getbanklist = function(callback = null, isLoading = false) {
	server.get("/pay/api/v1/banks/list", null, callback, isLoading);
};
/**
 * 新增银行卡
 * data包含的参数
 * @param {string}  account	银行卡账户名
 * @param {string}  branch	支行
 * @param {number}   memberId	会员id
 * @param {string}   name	银行名称
 * @param {string}  number 卡号
 * @param {string}  phone 绑定银行卡手机号
 * @param {string}  smsCode  手机验证码
 * @param {number}  bindPhone  手机号绑定状态  0：未绑定 1：已绑定
 *
 */
api.addbankcard = function(data, callback = null, isLoading = true) {
	server.post("/pay/api/v1/memberBanks", data, callback, isLoading);
};
/**
 * 付款方式
 * @param {number}  terminal  设备 1,PC端 0,移动端
 */
api.getPayment = function(position, callback = null, isLoading = true) {
	server.post("/pay/api/v1/deposit/listPayWays", position, callback, isLoading);
};
/**
 * 充值位置入口
 * @param {type}  money			入款金额
 * @param {type}  online		支付模式
 * @param {type}  channelId		充值通道
 * @param {type}  payType		支付方式
 * @param {type}  terminal		终端类型 0手机端 1:pc端
 * @param {type}
 * @param {type}
 * @param {type}
 * @param {type}
 */
api.getPaymentNextStep = function(option, callback = null, isLoading = true) {
	server.post("/pay/api/v1/deposit/entranceDeposit", option, callback, isLoading);
};

// api.getPaymentNextStep = function(option, callback = null, isLoading = true) {
// 	server.post('/api/test', option, callback, isLoading);
// };

/**
 * 查找手机
 *  @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return
 */
 api.getPhonelist = function(id, callback = null, isLoading = true) {
    server.get('/member/api/v1/members/memberDeviceFeatureCode/list/' + id, null, callback, isLoading);
};
/**
 * 解绑手机
 * @param {number}  id 手机id
 */
api.deletePhoneid = function(id, callback = null, isLoading = false) {
    server.get('/member/api/v1/members/memberDeviceFeatureCode/del/' + id, null, callback, isLoading);
};

/**
 * 发送验证码
 * @param {number}  mobile	手机号
 * @param {string}  name	用户名
 */
api.sendValidateSmsCode = function(data, callback = null, isLoading = false) {
    server.post('/member/api/v1/memberValidate/sendValidateSmsCode', data, callback, isLoading);
};

/**
 * 验证身份
 * @param {number}  mobile	手机号
 * @param {string}  name	用户名
 * @param {number}  smsCode;	验证码
 * @param {string}  fingerprint;	设备唯一标识
 */
api.checkValidateSmsCode = function(data, callback = null, isLoading = true) {
    server.post('/member/api/v1/memberValidate/checkValidateSmsCode', data, callback, isLoading);
};

/**
 * 删除银行卡
 * @param {number}  id 银行卡id
 */
api.deleteBankid = function(id, callback = null, isLoading = false) {
	server.del("/pay/api/v1/memberBanks/" + id, null, callback, isLoading);
};
/**
 * 多选删除银行卡
 * @param {String}  ids
 */
api.deleteBankids = function(ids, callback = null, isLoading = false) {
	server.del("/pay/api/v1/memberBanks/batchDel?ids=" + ids, null, callback, isLoading);
};
/**
 * 一键归集
 * @param {number}  clientId	平台id
 * @param {string}  clientIp	请求ip
 * @param {number}  memberId	会员id
 * @param {string}  username	用户名
 */
api.getOneMerge = function(data, callback = null, isLoading = false) {
	server.post("/game/api/v1/game/oneKeyBalanceCollection", data, callback, isLoading);
};

// 获取语言配置列表
api.getLangList = (callback) => server.get('/longm/api/v1/language/list', {}, callback, false)

/**
 * 钱包提现
 * @param {number}  amount	提款金额
 * @param {string}  bankNo	银行卡号
 * @param {string}  password	提款密码
 */
api.getWithdrawMoney = function(data, callback = null, isLoading = false) {
	server.post("/wallet/api/v1/moneyCashout/applyCashout", data, callback, isLoading);
};
/**
 * 厂商平台余额
 * @param {number}  clientId	平台id
 * @param {string}  clientIp	请求ip
 * @param {number}  memberId	会员id
 * @param {string}  username	用户名
 */
api.getGameBalance = function(data, callback = null, isLoading = true) {
	api.userBalanceAllVendor(data.memberId, data.clientId, data.username, data.clientIp, callback, isLoading);
};
/**
 * 获取账户余额
 * @param {number}  clientId	平台id
 * @param {string}  clientIp	请求ip
 * @param {number}  memberId	会员id
 * @param {string}  username	用户名
 */
api.getUserBalance = function(data, callback = null, isLoading = false) {
	server.post("/wallet/api/v1/money/userBalanceAllVendor", data, callback, isLoading);
};
/**
 * 获取会员等级信息
 * member/api/v1/memberLevels/1
 * @param {number} id  会员等级ID
 */
api.getvipdata = function(id, callback = null, isLoading = false) {
	server.get("/member/api/v1/memberLevels/" + id, null, callback, isLoading);
};
/**
 * 获取会员列表
 */
api.getVipList = function(data = "", callback = null, isLoading = false) {
	server.post("/member/api/v1/memberLevels/app/list", data, callback, isLoading);
};
/**
 * 获取提款页面可提款余额
 * @param {number}  clientId 平台ID
 * @param {string}  username 用户名字
 */
api.getBalanceMoney = function(data, callback = null, isLoading = false) {
	server.post("/wallet/api/v1/money/queryBalance", data, callback, isLoading);
};
/**
 * 商城信息
 */
api.getClientMall = function(callback = null, isLoading = false) {
	server.get("/mall/api/v1/clientMall/getClientMall", null, callback, isLoading);
};
/**
 * 提款页面获取手续费
 * @param {type}  id  用户ID
 */
api.getServiceCharge = function(id, callback = null, isLoading = false) {
	server.get("/member/api/v1/members/getMemberInfoById/" + id, null, callback, isLoading);
};
/**
 * 提款页面确认提款
 * @param {number}  amount        金额
 * @param {string}  bankAccount    银行卡户名
 * @param {string}  bankBranch    支行
 * @param {string}  bankName    银行名称
 * @param {string}  bankNo        卡号
 * @param {string}  password    取款密码
 * @param {number}  handlingfee    手续费
 * @param {number}  administrativeCosts  行政费用
 * @param {number}  discountDeduction	优惠扣除
 * @param {string}  operator 操作人
 */
api.setBankDrawing = function(data, callback = null, isLoading = true) {
	server.post("/pay/api/v1/withdraw/entranceWithdraw", data, callback, isLoading);
};
/**
 * 获取用户提款扣除费用
 * @param {type}  memberId 会员ID（userID）
 * @param {type}
 * @param {type}
 */
api.getCost = function(data, callback = null, isLoading = false) {
	server.post("/pay/api/v1/audit/getCurrentAudit", data, callback, isLoading);
};
/**
 * 查询用户返水
 * /wallet/api/v1/rebates/getRebateAmount?memberId=177
 */
api.getUserFanshui = function(id, callback = null, isLoading = false) {
	server.get("/wallet/api/v1/rebates/getRebateAmount?memberId=" + id, null, callback, isLoading);
};
/**
 * 领取返水
 * /wallet/api/v1/rebates/receiveRebate?memberId=177
 */
api.getUserReceiveFanshui = function(id, callback = null, isLoading = false) {
	server.get("/wallet/api/v1/rebates/receiveRebate?memberId=" + id, null, callback, isLoading);
};
/**
 * app返水记录查询批次信息
 */
api.getDetailByBetNo = function(betNo, callback = null, isLoading = false) {
	server.post("/wallet/api/v1/rebates/getDetailByBetNo", betNo, callback, isLoading);
};

/**
 * app返水记录查询批次信息
 */
api.getRebateAmountDetail = function(data, callback = null, isLoading = false) {
	server.post("/wallet/api/v1/rebates/getRebateAmountDetail", data, callback, isLoading);
};
//dze--结束

/**
 * 救济金
 * /api/v1/thematicActivities/getThematicActivitiesList
 */
api.getThematicActivitiesList = function(data, callback = null, isLoading = false) {
	server.post("/longm/api/v1/thematicActivities/getThematicActivitiesListByApp", data, callback, isLoading);
};

// 获取首页JP及广告弹出规则
// api.getPopUpAdsSetting = function(callback, isLoading = false) {
//     server.get("/longm/api/v1/settings/getPopUpAdsSetting", null, callback, isLoading);
// };

// 获取首页JP及广告弹出规则
api.getPopUpAdsSetting = function(callback, isLoading = false) {
	server.get("/longm/api/v1/guideAd/list", null, callback, isLoading);
};

// 获取gt
api.geetFirstRegister = function(t, callback = null, isLoading = false) {
	server.get("/member/api/v1/geeTest/firstRegister?t=" + t, null, callback, isLoading);
};

// 获取验证码类型
api.getDefaultStatus = function(callback = null, isLoading = false) {
	server.get("/member/api/v1/validateCode/getDefaultStatus", null, callback, isLoading);
};

//***********找回密码功能start
//根据账号名称查询会员手机号
api.getMemberByName = function(data, callback = null, isLoading = true) {
	server.post("/member/api/v1/members/getMemberByName", data, callback, isLoading);
};

//前台验证短信验证码
api.checkSmsCode = function(name, phone, smsCode, callback = null, isLoading = true) {
	var data = {
		name,
		phone,
		smsCode,
	};
	server.post("/member/api/v1/members/checkSmsCode", data, callback, isLoading);
};

//前台根据手机号重置用户密码
api.resetMemberPwdByClient = function(memberId, password, code, name, callback = null, isLoading = true) {
	var data = {
		memberId,
		password,
		code,
		name,
	};
	server.post("/member/api/v1/members/resetMemberPwdByClient", data, callback, isLoading);
};
//***********找回密码功能end

//登录前验证
/**
 * name "88liu",   //登陆用户名
    password" "RmJmvMg4BgUXmu43SAkG2g=="  //加密后密码
 */
api.validateLogin = function(option, callback = null, isLoading = true) {
	server.post("/member/api/v1/memberValidate/validateLogin", option, callback, isLoading);
};
/**
     * name    登陆用户名
        realName  真实姓名
     */
api.validateRealName = function(option, callback = null, isLoading = true) {
	server.post("/member/api/v1/memberValidate/validateRealName", option, callback, isLoading);
};

/**
 * 会员可领取返利金额
 */
api.availableAmount = function(option, callback = null, isLoading = true) {
	server.post("/wallet/api/v1/allowance/availableAmount", option, callback, isLoading);
};
/**
 * 领取返利
 */
api.setReceive = function(option, callback = null, isLoading = true) {
	server.post("/wallet/api/v1/allowance/receive", option, callback, isLoading);
};

/**
 * 获取邀请码以及链接
 */
api.getReferralLink = function(option, callback = null, isLoading = false) {
	server.get("/member/api/v1/members/referralLink", option, callback, isLoading);
};
/**
 * 判断全民返利是否启用
 */
api.getEnableLink = function(option, callback = null, isLoading = false) {
	server.get("/longm/api/v1/settings/get/11", option, callback, isLoading);
};
/**
 *
 * 全民返利规则说明
 */
api.ExplainRule = function(option, callback = null, isLoading = true) {
	server.get("/wallet/api/v1/allowance/allowanceExplain", option, callback, isLoading);
};
/**
 *  验证是否首次提款
 */
api.firstWithdraw = function(callback = null, isLoading = false) {
	server.get("/pay/api/v1/withdrawRecords/firstWithdraw", null, callback, isLoading);
};
//名下返利会员个数
api.memberAllowanceCount = function(callback = null, isLoading = false) {
	server.get("/wallet/api/v1/allowance/memberAllowanceCount", null, callback, isLoading);
};
//名下返利会员记录
api.memberAllowanceRecord = function(data, callback = null, isLoading = false) {
	server.post("/wallet/api/v1/allowance/memberAllowanceRecord", data, callback, isLoading);
};
//利息宝列表
api.interestList = function(data, callback = null, isLoading = false) {
	server.post("/wallet/api/v1/interest/list", data, callback, isLoading);
};

//利息宝记录列表
api.interestRecordList = function(data, callback = null, isLoading = false) {
	server.post("/wallet/api/v1/interest/interestRecordList", data, callback, isLoading);
};

//领取利息
api.receiveInterest = function(id, callback = null, isLoading = false) {
	server.put("/wallet/api/v1/interest/receiveInterest/" + id, null, callback, isLoading);
};
//利息宝详情
api.interestDetail = function(id, callback = null, isLoading = false) {
	server.get("/wallet/api/v1/interest/interestDetail/" + id, null, callback, isLoading);
};
//利息宝存款
api.interestJoin = function(amount, interestId, callback = null, isLoading = true) {
	var data = {
		amount,
		interestId,
	};
	server.post("/wallet/api/v1/interest/join", data, callback, isLoading);
};
//利息宝记录可领取资金以及稽核值(提前领取)
api.interavailableAmount = function(interestRecordId, callback = null, isLoading = false) {
	server.post("/wallet/api/v1/interest/availableAmount/" + interestRecordId, null, callback, isLoading);
};
//利息宝预计盈利
api.profitForecast = function(amount, interestId, callback = null, isLoading = false) {
	var data = {
		amount,
		interestId,
	};
	server.post("/wallet/api/v1/interest/profitForecast", data, callback, isLoading);
};
//判断进行中利息宝
api.existRunningStatus = function(callback = null, isLoading = false) {
	server.get("/wallet/api/v1/interest/existRunningStatus", null, callback, isLoading);
};

//高额返利 有效会员人数
api.validMemberCount = function(callback = null, isLoading = false) {
	server.get("/wallet/api/v1/allowance/validMemberCount", null, callback, isLoading);
};
//app端专题活动详情
api.getThematicActivitiesByApp = function(id, callback = null, isLoading = false) {
	server.get("/longm/api/v1/thematicActivities/getThematicActivitiesByApp/" + id, null, callback, isLoading);
};
/**
 * 活动记录详情
 * @param {Int} id 活动ID
 * @param {Function} callback 回调函数
 * @param {Boolean} isLoading 是否显示加载
 * @return 返回数据同 api.activity
 */
api.appActDetail = function(id, callback = null, isLoading = false) {
	server.get("/longm/api/v1/activities/appActDetail/" + id, null, callback, isLoading);
};
// 代理加盟
api.getAgentCommissionPlan = function(data, callback = null, isLoading = false) {
	server.get("/longm/api/v1/agentCommissionPlan/getAgentCommissionPlan", data, callback, isLoading);
};

api.getAppSave = function(data, callback = null, isLoading = false) {
	server.post("/agent/api/v1/agent/appSave", data, callback, isLoading);
};

//h5 悬浮框
api.getListFloatingWindows = function(data, callback = null, isLoading = false) {
	server.get("/longm/api/v1/settingsEntryWindows/listFloatingWindows", data, callback, isLoading);
};

// 获取用户线上最新未发送的成功充值记录
api._getAppNotSendLatestSuccessRecord = function(data, callback, isLoading = false) {
    server.post('/pay/api/v1/onlinePayRecords/onlinePay/getAppNotSendLatestSuccessRecord', data, callback, isLoading);
};
// 更新用户线上最新未发送的成功充值记录
api._updateNotSendLatestSuccessRecord = function(data, callback, isLoading = false) {
    server.post('/pay/api/v1/onlinePayRecords/onlinePay/updateNotSendLatestSuccessRecord', data, callback, isLoading);
};
// 根据单号获取线上交易记录
api._getByOrderNo = function(data, callback, isLoading = false) {
    server.post('/pay/api/v1/onlinePayRecords/getByOrderNo', data, callback, isLoading);
};


// ================================= 周签活动 开始===================================
//获取用户签到数据详情
api.getActivityById = function (id, callback = null, isLoading = false) {
  server.get(
    "/longm/api/v1/thematicActivities/v2/" + id,
    null,
    callback,
    isLoading
  );
};
//点击签到
api.activitySignById = function (
  thematicActivitiesId,
  callback = null,
  isLoading = false
) {
  server.put(
    "/longm/api/v1/thematicActivities/v2/signIn?thematicActivitiesId=" +
      thematicActivitiesId,
    null,
    callback,
    isLoading
  );
};
//领取活跃值奖励
api.receiveActive = function (
  thematicActivitiesId,
  id,
  callback = null,
  isLoading = false
) {
  server.put(
    "/longm/api/v1/thematicActivities/receiveActiveGift?thematicActivitiesId=" +
      thematicActivitiesId +
      "&configId=" +
      id,
    null,
    callback,
    isLoading
  );
};
//补签
api.signSupply = function (
  thematicActivitiesId,
  day,
  callback = null,
  isLoading = false
) {
  server.put(
    "/longm/api/v1/thematicActivities/signInLate?thematicActivitiesId=" +
      thematicActivitiesId +
      "&day=" +
      day,
    null,
    callback,
    isLoading
  );
};
// ================================= 周签活动 结束===================================
// 活动打码
api.putReceive = function (
	thematicActivitiesId,
	betNo,
	callback = null,
	isLoading = true
  ) {
	server.get(
	  "/longm/api/v1/thematicActivities/receive?thematicActivitiesId=" +
		thematicActivitiesId +
		"&betNo=" +
		betNo,
	  null,
	  callback,
	  isLoading
	);
};

// vip 新 start ==============================
api.getUserLevel = function (position, callback = null, isLoading = true) {
	server.get(
	  "/member/api/v1/memberNewVipLevel/getAppLevel",
	  position,
	  callback,
	  isLoading
	);
  };
  api.getUserVIPlist = function (position, callback = null, isLoading = true) {
	server.get(
	  "/member/api/v1/memberNewVipConf/ljList",
	  position,
	  callback,
	  isLoading
	);
  };
  api.getUserVIPRebate = function (position, callback = null, isLoading = true) {
	server.get(
	  "/member/api/v1/memberNewVipConf/getLevelRebate",
	  position,
	  callback,
	  isLoading
	);
  };
  // vip 新 end ================================

/**
 * 是否已经登录
 */
api.isLogin = function() {
	var token = server.getToken();
	return token && token.length;
};
/**
 * 绑定邀请码
 * @param {Int} code code
 */
api.bindAgentCode = function(data, callback = null, isLoading = false) {
	server.get("/member/api/v1/members/bindAgentCode?agentCode="+ data.agentCode, null, callback, isLoading);
  };

/**
 * 设置token
 * @param {Object} res token对象
 */
function setToken(res) {
	if (res && res.token_type && res.access_token) {
		var accessToken = res.token_type + " " + res.access_token;
		var accessTime = res.expires_in;
		var refreshToken = res.refresh_token;
		server.setToken(accessToken, accessTime, refreshToken);
		server.setUser(res);
		var time = Math.ceil(accessTime * 0.8) * 1000;
		tokerTimer = setTimeout(api.refreshToken, time);
	}
}

/**
 * 清除token
 */
function clearToken() {
	server.clearToken();
	clearTimeout(tokerTimer);
}

/**
 * 积分商城--获取获取会员积分信息
 * @param {Int} code code
 * @return
 */
api.getMallMemberPoint = function (callback = null, isLoading = false) {
	server.get(
		"/mall/api/v1/memberPoint/getMemberPoint",
		null,
		callback,
		isLoading
	);
  };
  
/**
 * 积分商城--会员签到前置信息
 * @param {Int} code code
 * @return
 */
api.getSignPrecondition = function (callback = null, isLoading = false) {
server.get(
	"/mall/api/v1/sign/getSignPrecondition",
	null,
	callback,
	isLoading
);
};

/**
 * 积分商城--会员签到
 * @param {Int} code code
 * @return
 */
api.doSignIn = function (callback = null, isLoading = false) {
server.get("/mall/api/v1/sign/doSignIn", null, callback, isLoading);
};

/**
 *  积分商城--商品列表
 * @param {Int} code code
 * @return
 */
api.shoppingMallList = function (callback = null, isLoading = false) {
server.get("/mall/api/v1/shoppingMall/list", null, callback, isLoading);
};

/**
 *  积分商城--获取商城信息
 * @param {Int} code code
 * @return
 */
api.getClientMall = function (callback = null, isLoading = false) {
server.get(
	"/mall/api/v1/clientMall/getClientMall",
	null,
	callback,
	isLoading
);
};

/**
 *  积分商城--会员抽奖
 * @param {Int} code code
 * @return
 */
api.doLottery = function (callback = null, isLoading = false) {
server.post("/mall/api/v1/shoppingMall/doLottery", null, callback, isLoading);
};

/**
 *  积分商城--兑换记录列表
 * @param {Int} code code
 * @return
 */
api.listShoppingExchangeRecord = function (callback = null, isLoading = false) {
server.get(
	"/mall/api/v1/shoppingExchangeRecord/listShoppingExchangeRecord",
	null,
	callback,
	isLoading
);
};

/**
 *  积分商城--获取会员积分账变流水
 * @param {Int} code code
 * @return
 */
api.pageMemberPointChange = function (
	data,
	callback = null,
	isLoading = false
) {
server.post(
	"/mall/api/v1/memberPoint/pageMemberPointChange",
	data,
	callback,
	isLoading
);
};

/**
 *  积分商城--收货地址列表
 * @param {Int} code code
 * @return
 */
api.shoppingExchangeAddress = function (callback = null, isLoading = false) {
server.get(
	"/mall/api/v1/shoppingExchangeAddress/list",
	null,
	callback,
	isLoading
);
};


/**
 *  积分商城--实物中奖添加收货地址
 * @param {Int} code code
 * @return
 */
api.updateLotteryGoodsAddress = function (
	data,
	callback = null,
	isLoading = false
) {
server.post(
	"/mall/api/v1/shoppingMall/updateLotteryGoodsAddress",
	data,
	callback,
	isLoading
);
};

/**
 *  积分商城--商品兑换
 * @param {Int} code code
 * @return
 */
api.exchangeMall = function (data, callback = null, isLoading = false) {
server.post("/mall/api/v1/shoppingMall/exchange", data, callback, isLoading);
};

/**
 *  积分商城--删除商品地址
 * @param {Int} code code
 * @return
 */
api.deleteShoppingExchangeAddress = function (
	id,
	callback = null,
	isLoading = false
) {
server.del(
	"/mall/api/v1/shoppingExchangeAddress/" + id,
	null,
	callback,
	isLoading
);
};

/**
 *  积分商城--新增或更新收货地址
 * @param {Int} code code
 * @return
 */
api.updateShoppingExchangeAddress = function (
	data,
	callback = null,
	isLoading = false
) {
server.post(
	"/mall/api/v1/shoppingExchangeAddress",
	data,
	callback,
	isLoading
);
};
/** 积分商城--新接口获取用户信息
 * @param {Int} code code
 * @return
 */
api.getUserInfo = function(id, callback = null, isLoading = false) {
server.get("/member/api/v1/members/"+ id, null, callback, isLoading);
};

/** 积分商城--用户添加收货地址信息
 * @param {Int} code code
 * @return
 */
api.addAddress = function(data, callback = null, isLoading = false) {
server.post("/member/api/v1/members/addAddress", data, callback, isLoading);
};

/** 积分商城--用户修改默认收货地址
 * @param {Int} code code
 * @return
 */
api.updateAddressStatus = function(data, callback = null, isLoading = false) {
server.post("/member/api/v1/members/updateAddressStatus", data, callback, isLoading);
};

api.getVipfaq = function ( callback = null, isLoading = true) {
	server.get("/member/api/v1/vipGuide/get",null,callback,isLoading);
};
api.getSpinBigWheel = function(data, callback = null, isLoading = false) {
    server.post("/longm/api/v1/thematicActivities/spinBigWheel",data, callback, isLoading);
};
api.getWaterBallList = function (
	clientItem,
	callback = null,
	isLoading = false
  ) {
	server.get(
	  "/longm/api/v1/thematicActivities/getWaterBallList?clientItem=" +
		clientItem,
	  null,
	  callback,
	  isLoading
	);
  };
module.exports = api;
