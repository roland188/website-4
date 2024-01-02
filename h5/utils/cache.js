const cache = {};

cache.set = function(key, val, time) {
	uni.setStorageSync(key, val);
	var seconds = parseInt(time);
	if (seconds > 0) {
		var timestamp = Date.parse(new Date()) / 1000 + seconds;
		uni.setStorageSync(_key(key), timestamp + "");
	} else {
		uni.removeStorageSync(_key(key));
	}
}

cache.get = function(key) {
	let dataVal = null;
	var time = parseInt(uni.getStorageSync(_key(key)));
	if (time) {
		if (parseInt(time) < Date.parse(new Date()) / 1000) {
			this.remove(key);
			return null;
		}
	}
	
	// #ifdef  APP-PLUS
		var val = uni.getStorageSync(key);
		if (val) {
			return val;
		} else {
			uni.removeStorageSync(key);
			return null;
		}
	// #endif
	// #ifdef  H5
		var val = null;
		var str = uni.getStorageSync(key);
		if(!str){
			uni.removeStorageSync(key);
			return null;
		}else{
			if(typeof str === 'string'){
				try {
					var obj=JSON.parse(str);
					if(typeof obj == 'object' && obj ){
						val=JSON.parse(str);
					}else{
						val = str;
					}
				} catch(e) {
					val = str;
				}
			}else{
				val = str;
			}
			if (val.hasOwnProperty("data")) {
				dataVal = val.data
			}else{
				// dataVal = str.replace(/\"/g, "");
				dataVal = str
			}
			return dataVal;
		}
		// #endif
}

cache.remove = function(key) {
	uni.removeStorageSync(key);
	uni.removeStorageSync(_key(key));
}

cache.clear = function() {
	uni.clearStorageSync();
};

function _key(key) {
	return key + '_time';
};

module.exports = cache;
