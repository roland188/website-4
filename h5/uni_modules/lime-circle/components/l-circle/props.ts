// @ts-nocheck
// import { CircleProps} from './type';
// import { PropType } from 'vue';

export default {
	percent: {
		type:  Number,
		default: 0
	},
	size: {
		type: String,
		default: '120px'
	},
	lineCap: {
		type: String,
		default: 'round'
	},
	strokeWidth: {
		type: [String, Number],
		default: 6
	},
	strokeColor: {
		type: [String , Array],
		default: '#2db7f5'
	},
	trailWidth: {
		type: [String, Number],
		default: 6
	},
	trailColor: {
		type: String,
		default: '#ddd'
	},
	dashborad: Boolean,
	clockwise: {
		type: Boolean,
		default: true
	},
	duration: {
		type: Number,
		default: 300
	},
	max: {
		type: Number,
		default: 100
	},
	/**缺口角度 暂未实现*/
	// gapDegree: {
	// 	type: Number,
	// },
	/**成功配置 暂未实现*/
	// success: {
	// 	type: Object
	// },
	canvas: Boolean
}