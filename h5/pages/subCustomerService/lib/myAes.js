/**
 * 工具类
 */
import CryptoJS from 'crypto-js'
export default { //加密
	encrypt(word, keyStr) {
		keyStr = keyStr ? keyStr : 'abcdefgabcdefg12';
		var key = CryptoJS.enc.Utf8.parse(keyStr); //Latin1 w8m31+Yy/Nw6thPsMpO5fg==
		var srcs = CryptoJS.enc.Utf8.parse(word);
		var encrypted = CryptoJS.AES.encrypt(srcs, key, {
			iv: key,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		}); 
		 
		return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
	},
	//解密
	decrypt(word, keyStr) {
		keyStr = keyStr ? keyStr : 'abcdefgabcdefg12';
		var key = CryptoJS.enc.Utf8.parse(keyStr); //Latin1 w8m31+Yy/Nw6thPsMpO5fg==

		var decrypt = CryptoJS.AES.decrypt(word, key, {
			iv: key,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		return CryptoJS.enc.Utf8.stringify(decrypt).toString();
	}

}