/** 
 * @description: 时间格式化处理 
 * @param date  
 */ 
export const moment = (date = new Date()) => { 
	class Moment {
		constructor(date) {
			this.date = date
		}
		returnZero(num){
			return num * 1 < 10 ? `0${num}` : num
		}
		before(day){
			let time = this.date.getTime()
			time-= day * 24 * 60 * 60 * 1000
			this.date = new Date(time)
			return this
		}
		format(str){
			let time = this.date
			const YYYY = time.getFullYear()
			const MM = time.getMonth() + 1
			const DD = time.getDate()
			const hh = time.getHours()
			const mm = time.getMinutes()
			const ss = time.getSeconds() 
			const obj = {
				YYYY,
				MM,
				DD,
				hh,
				mm,
				ss
			}
			for(let key in obj) {
				const reg = new RegExp(key)
				const val = this.returnZero(obj[key])
				str = str.replace(reg,()=>val)
			}
			return str
		}
	}
	return new Moment(date)
}