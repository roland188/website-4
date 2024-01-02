(function() {
	var logoUrl = window.projectImgUrl;
	var name = window.projectName;
	
	// 导航栏LOGO
	var link = document.querySelector("link[rel*='icon']")
	link.type = 'image/png';
	link.rel = 'shortcut icon';
	link.href = '/static/image/favicon/' + logoUrl + '.png';
	// APP LOGO
	var appLogo = document.querySelector("link[rel*='apple-touch-icon-precomposed']")
	appLogo.type = 'image/png';
	appLogo.rel = 'apple-touch-icon-precomposed';
	appLogo.href = '/static/image/favicon/' + logoUrl + '.png';
	// 导航栏title
	var navTitle = document.getElementsByTagName('meta')['apple-mobile-web-app-title']
	navTitle.content = name;
	navTitle.name = 'apple-mobile-web-app-title'
	console.log('导航栏LOGO:', appLogo.href)
	console.log('APP LOGO:', link.href)
	console.log('导航栏title:',navTitle.content)
})();