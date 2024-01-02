(function() {
    var logoUrl = window.projectImgUrl;
    // 导航栏LOGO
    var link = document.querySelector("link[rel*='icon']")
    link.type = 'image/png';
    link.rel = 'shortcut icon';
    link.href = '/favicon/' + logoUrl + '.png';

})();