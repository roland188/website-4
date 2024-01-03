(function() {
    var logoUrl = window.projectImgUrl;
    // 导航栏LOGO
    var link = document.querySelector("link[rel*='icon']")
    link.type = 'image/png';
    link.rel = 'shortcut icon';
    link.href = '/favicon/' + logoUrl + '.png';
    if (logoUrl === 'betc88') {
        document.title = 'Betcome - best bet coming｜Thương hiệu Casino chuyên nghiệp số 1 Việt Nam｜chuyên trang tổng hợp cá độ bóng đá, xổ số lô đề, casino trực tuyến, game bài, bắn cá giải trí'
    }
})();