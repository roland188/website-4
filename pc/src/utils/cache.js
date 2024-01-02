/*
 * @Description: 项目模块
 * @Version: 1.0
 * @Autor: steFan
 * @Date: 2020-03-19 16:23:26
 * @LastEditors: steFan
 * @LastEditTime: 2020-03-19 18:52:49
 */
const cache = {};
cache.set = function(key, val, time) {
    let valJson = {};
    let valSetJson = null;
    if (typeof val === 'object') {
        valJson.data = val
    } else {
        valJson = val
    }
    localStorage.setItem(key, JSON.stringify(valJson));
    // var seconds = parseInt(time);
    // if (seconds > 0) {
    // 	var timestamp = Date.parse(new Date()) / 1000 + seconds;
    //     localStorage.setItem(key,timestamp + "");
    // } else {
    //     localStorage.removeItem(_key(key))
    // }
}

cache.get = function(key) {
    let dataVal = null;
    // var time = parseInt(localStorage.getItem(_key(key)))
    // if (time) {
    // 	if (parseInt(time) < Date.parse(new Date()) / 1000) {
    // 		this.remove(key);
    // 		return null;
    // 	}
    // }
    var val = null;
    var str = localStorage.getItem(key);

    if (!str) {
        localStorage.removeItem(key);
        return null;
    } else {
        if (typeof str === 'string') {
            try {
                var obj = JSON.parse(str);
                if (typeof obj == 'object' && obj) {
                    val = JSON.parse(str);
                } else {
                    val = str;
                }
            } catch (e) {
                val = str;
            }
        } else {
            val = str;
        }
        if (val.hasOwnProperty("data")) {
            dataVal = val.data
        } else {
            dataVal = str.replace(/\"/g, "");
        }
        return dataVal;
    }
}

cache.remove = function(key) {
    localStorage.removeItem(key);
    localStorage.removeItem(_key(key));
}

cache.clear = function() {
    localStorage.clear();
};

function _key(key) {
    return key + '_time';
};

module.exports = cache;