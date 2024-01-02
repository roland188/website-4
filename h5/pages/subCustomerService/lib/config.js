var config = {
	baseURL: '',
	'appVer': '1.0.0',
	'protocolVer': '1.0',
	'reqId': 0,
	clientCode: '',
	clientItem: '',
	username: '',
	lang: '',
	// appid:'',
	theme: '',
	haveValue: false,
	isShowBack: 0,
	applyUrl: false,
	type: '', // 传入判断类型 1.h5  2.app  3.android  4.ios
	suffix: '', // 后缀名
	statusHeight: 0, // 状态栏高度
	dealaccount: dealaccount
};
// 账号添加后缀规则
function dealaccount(val) {
	if (config.suffix != '') {
		if (val.length >= 2) {
			let newval = val.substr(val.length - 2);
			if (newval == config.suffix) {
				return val
			} else {
				return val + config.suffix
			}
		} else {
			return val + config.suffix
		}
	}
	 if(val == ''){
		 return val + config.suffix
	 }
	 else {
		return val
	}
}
export default config
