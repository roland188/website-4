import i18n from '@/i18n/index';
// 复制封装

export default function uniCopy(content) {
	content = typeof content === 'string' ? content : content.toString()
	// 小程序和app复制
	// #ifndef H5
	uni.setClipboardData({
		data: content,
		success: function () {
			uni.showToast({
				title: i18n.$t('复制成功'),
				icon: 'success',
			})
			// success('复制成~')
		},
		fail: function () {
			uni.showToast({
				title: i18n.$t('复制失败!'),
				icon: 'none',
			})
			// success('复制失败!')
		}
	})
	//#endif

	/* 
	 * h5 的复制
	 * */
	// #ifdef H5
	if (!document.queryCommandSupported('copy')) {
		error('浏览器不兼容')
	}
	let textarea = document.createElement('textarea')
	textarea.value = content
	textarea.readOnly = 'readOnly'
	document.body.appendChild(textarea)
	textarea.select() // 选择对象
	textarea.setSelectionRange(0, content.length)
	let result = document.execCommand('copy') // 执行浏览器复制命令
	if (result) {
		uni.showToast({
			title: i18n.$t('复制成功'),
			icon: 'success',
		})
		// success('复制成功~')
	} else {
		uni.showToast({
			title: i18n.$t('复制失败!'),
			icon: 'none',
		})
		// error("复制失败!")
	}
	textarea.remove()
	// #endif
}