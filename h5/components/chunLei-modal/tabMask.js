export class TabMask{
	constructor(option) {
		this.navList = []
		this.tabbarList = []
		option = option || {}
		let tabbarHeight = !option.tabbarHeight&&option.tabbarHeight != 0 ? 50: option.tabbarHeight
		let opacity = option.opacity || 0
		let fn = ()=>{}
		this.fn = option.fn || fn
		
		//#ifdef APP-PLUS
		this.creatPlusMask(tabbarHeight,opacity)
		//#endif
	}
	creatPlusMask(tabbarHeight,opacity){
		let opa = 1-Math.pow((1-opacity),1/10)
		
		for (let i = 1; i <= 10; i++) {
			
			let tabbarView = this.creatView({height:`${tabbarHeight+0.2}px`,bottom:0},opa)
			this.tabbarList.push(tabbarView)
		}
	}
	//生成 opacity view
	creatView(style,opa){
		style = {
			left:'0px',
			width:'100%',
			opacity:0.9,
			...style
		}
		let view = new plus.nativeObj.View('view',style);
		view.draw([
			{tag:'rect',id:'rect',color:`rgba(0,0,0,0.1)`,position:{top:'0px',left:'0px',width:'100%',height:'100%'}},
		]);
		view.addEventListener("click", (e) => {
			this.fn()
			// this.hide()
		}, false);
		return view
	}
	show(time=300){
		let i = 0
		this.timer = setInterval(()=>{
			if(i==10){
				clearInterval(this.timer)
			}else{
				if (this.tabbarList[i]) this.tabbarList[i].show()
				i++
			}
		},time/10)
	}
	hide(){
		
		clearInterval(this.timer)
		for (let item of this.tabbarList) {
			item.hide();
		}
	}
}
export default TabMask
/**
 * author:G brother
 * date:20200430
 * Thank:chunLei所提供的思路和参照
 * **/
 
// export class TabMask{
// 	constructor(option={}) {
	
// 		this.bodyModel=null;
// 		this.cancelModel=null;
// 		this.confirmModel=null;
// 		this.pageHeight=uni.getSystemInfoSync().screenHeight;
// 		let opacity = option.opacity || 0.6;
// 		let delCancel=option.delCancel||false;
// 		let fn = ()=>{}
// 		this.$event = option.$event || fn
		
// 		//#ifdef APP-PLUS
// 		this.creatView({height:`${this.pageHeight}px`,top:0},opacity)
// 		//#endif
// 	}

// 	//生成提示框view
// 	creatView(style,opa,clickEvent,modelInfo){
// 		style = {
// 			left:'0px',
// 			width:'100%',
// 			zIndex:'1',
// 			...style
// 		}

// 		let view = new plus.nativeObj.View('showModalView',style);
// 		view.draw([
// 			{tag:'rect',id:'modal',color:`rgba(0,0,0,${opa})`,position:{top:'0px',left:'0px',width:'100%',height:'100%',zIndex:'1'}},
// 		]);
	
// 	   this.bodyModel=view;
// 	}
//     showModalAnimationClose(){
// 		var options = {type:'pop-out',duration:300};
// 			plus.nativeObj.View.startAnimation(options,{bitmap:this.bodyModel},{bitmap:this.cancelModel},{bitmap:this.viewconfirm},function(){
// 				console.log('plus.nativeObj.View.startAnimation动画结束');
// 				// 关闭原生动画
// 				plus.nativeObj.View.clearAnimation();
// 			});
// 	}
// 	showModalAnimationOpen(){
// 		var options = {type:'pop-in',duration:300};
// 			plus.nativeObj.View.startAnimation(options,{bitmap:this.bodyModel},{bitmap:this.cancelModel},{bitmap:this.viewconfirm},function(){
// 				console.log('plus.nativeObj.View.startAnimation动画结束');
// 				// 关闭原生动画
// 				plus.nativeObj.View.clearAnimation();
// 			});
// 	}
// 	show(){
// 		this.showModalAnimationOpen();
// 		this.bodyModel.show();
// 		if(this.cancelModel){
// 			this.cancelModel.show();
// 		}
// 		this.confirmModel.show();
	
// 	}
// 	hide(){
// 		this.showModalAnimationClose();
// 		this.bodyModel.hide();
// 		if(this.cancelModel){
// 	      this.cancelModel.hide();	
// 		}
// 		this.confirmModel.hide();
		
		
// 	}
// }

// export default TabMask


