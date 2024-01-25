(function() {
    var r = window.location.search.substr(1).match(new RegExp("(^|&)code=([^&]*)(&|$)", "i"));
    var g = r ? unescape(r[2]) : null;
    g && sessionStorage.setItem("inviteCode", JSON.stringify(g.slice(0, 8)));
    var u = window.location.hostname;
    var a = u.split(".");
    var l = u == "localhost";
    l || (l = /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g.test(u));

    function s() {
        var h;
        var p = a;
        var m = /Android|webOS|iPhone|ipad|iPod|BlackBerry|XiaoMi/i.test(navigator.userAgent);
        var z = p.length > 2 && p[0] == "m";
        if (p.length > 2) p = p.slice(p.length - 2);
        if (!m && z) {
            h = location.protocol + "//" + p.join(".");
        } else if (m && !z) {
            h = location.protocol + "//m." + p.join(".");
        };
        if (h) {
            var s = sessionStorage.getItem("inviteCode");
            if (s && s.length) h += "?code=" + JSON.parse(s);
            window.location.href = h;
        }
    };

    function t() {
        var c = [
            {
                "code": "ff10",
                "skin": "xoc88",
                "childCode": "ff10",
                "locale": 'vi',
                "name": "betcome",
                "theme": "a053",
                "winOpenTime": "6000",
                "customerServiceStatus": 1,//0旧版本   1新版本
                "sortArr": [1, 2, 3, 4, 5, 6, 7],//1电子游艺 2体育赛事 3棋牌游戏 4彩票游戏 5视讯直播 6电竞赛事 7捕鱼机
                "maintainUrl": "https://www.ffyl0202.com/clientMaintain/getClientMaintain",
                "domains": [],
            },
			{
                "code": "viet",
                "skin": "kubet",
                "childCode": "kbet",
                "locale": 'vi',
                "name": "ku bet",
                "theme": "a054",
                "winOpenTime": "6000",
                "customerServiceStatus": 1,//0旧版本   1新版本
                "sortArr": [1, 2, 3, 4, 5, 6, 7],//1电子游艺 2体育赛事 3棋牌游戏 4彩票游戏 5视讯直播 6电竞赛事 7捕鱼机
                "maintainUrl": "https://www.ffyl0202.com/clientMaintain/getClientMaintain",
                "domains": [],
			},
            {
                "code": "bgga",
                "skin": "bgga",
                "childCode": "bgga",
                "locale": 'pt',
                "name": "BG.GAME",
                "theme": "a055",
                "winOpenTime": "6000",
                "customerServiceStatus": 1,//0旧版本   1新版本
                "sortArr": [5, 1, 7, 2, 3, 8, 4, 6,],//1电子游艺 2体育赛事 3棋牌游戏 4彩票游戏 5视讯直播 6电竞赛事 7捕鱼机
                "maintainUrl": "https://www.ffyl0202.com/clientMaintain/getClientMaintain",
                "domains": [],
            },
            {
                "code": "ff10",
                "skin": "betc88",
                "childCode": "ff10",
                "locale": 'vi',
                "name": "bet come",
                "theme": "a053",
                "winOpenTime": "6000",
                "customerServiceStatus": 1,//0旧版本   1新版本
                "sortArr": [1, 2, 3, 4, 5, 6, 7],//1电子游艺 2体育赛事 3棋牌游戏 4彩票游戏 5视讯直播 6电竞赛事 7捕鱼机
                "maintainUrl": "https://www.ffyl0202.com/clientMaintain/getClientMaintain",
                "domains": [],
            },
			{
                "code": "viet",
                "skin": "betc88",
                "childCode": "new8",
                "locale": 'vi',
				"name": "betcom",
                "theme": "a053",
                "winOpenTime": "6000",
                "customerServiceStatus": 1,//0旧版本   1新版本
                "sortArr": [1, 2, 3, 4, 5, 6, 7],//1电子游艺 2体育赛事 3棋牌游戏 4彩票游戏 5视讯直播 6电竞赛事 7捕鱼机
                "maintainUrl": "https://www.ffyl0202.com/clientMaintain/getClientMaintain",
                "domains": [],
			},
            {
                "code": "svip",
                "skin": "sovip",
                "childCode": "svip",
                "locale": 'vi',
                "name": "sovip - best bet coming｜Thương hiệu Casino chuyên nghiệp số 1 Việt Nam｜chuyên trang tổng hợp cá độ bóng đá, xổ số lô đề, casino trực tuyến, game bài, bắn cá giải trí",
                "theme": "a053",
                "winOpenTime": "6000",
                "customerServiceStatus": 1,//0旧版本   1新版本
                "sortArr": [5, 1, 7, 2, 3, 8, 4, 6,],//1电子游艺 2体育赛事 3棋牌游戏 4彩票游戏 5视讯直播 6电竞赛事 7捕鱼机
                "maintainUrl": "https://www.ffyl0202.com/clientMaintain/getClientMaintain",
                "domains": [],
            },
            
            {
                "code": "viet",
                "skin": "xiaocao",
                "childCode": "kbet",
                // "code": "xcao",
                // "childCode": "xcao",
                "locale": 'vi',
                "name": "88bet",
                "theme": "a032",
                "winOpenTime": "6000",
                "customerServiceStatus": 1,//0旧版本   1新版本
                "sortArr": [1, 2, 3, 4, 5, 6, 7],//1电子游艺 2体育赛事 3棋牌游戏 4彩票游戏 5视讯直播 6电竞赛事 7捕鱼机
                "maintainUrl": "https://www.ffyl0202.com/clientMaintain/getClientMaintain",
                "domains": [],
            },
            {
                "code": "viet",
                "skin": "jun88",
                "childCode": "jun8",
                "locale": 'vi',
				"name": "jun88",
                "theme": "a060",
                "winOpenTime": "6000",
                "customerServiceStatus": 1,//0旧版本   1新版本
                "sortArr": [1, 2, 3, 4, 5, 6, 7],//1电子游艺 2体育赛事 3棋牌游戏 4彩票游戏 5视讯直播 6电竞赛事 7捕鱼机
                "maintainUrl": "https://www.ffyl0202.com/clientMaintain/getClientMaintain",
                "domains": [],
            },
            {
                "code": "viet",
                "skin": "phattai68",
                "childCode": "phat",
                "locale": 'vi',
				"name": "PHATTAI68",
                "theme": "a057",
                "winOpenTime": "6000",
                "customerServiceStatus": 1,//0旧版本   1新版本
                "sortArr": [1, 2, 3, 4, 5, 6, 7],//1电子游艺 2体育赛事 3棋牌游戏 4彩票游戏 5视讯直播 6电竞赛事 7捕鱼机
                "maintainUrl": "https://www.ffyl0202.com/clientMaintain/getClientMaintain",
                "domains": [],
            },
            {
                "code": "viet",
                "skin": "choibet",
                "childCode": "choi",
                "locale": 'vi',
				"name": "CHOIBET",
                "theme": "a058",
                "winOpenTime": "6000",
                "customerServiceStatus": 1,//0旧版本   1新版本
                "sortArr": [1, 2, 3, 4, 5, 6, 7],//1电子游艺 2体育赛事 3棋牌游戏 4彩票游戏 5视讯直播 6电竞赛事 7捕鱼机
                "maintainUrl": "https://www.ffyl0202.com/clientMaintain/getClientMaintain",
                "domains": [],
            },
            {
                "code": "viet",
                "skin": "g9bet",
                "childCode": "g9bt",
                "locale": 'vi',
				"name": "G9bet",
                "theme": "a059",
                "winOpenTime": "6000",
                "customerServiceStatus": 1,//0旧版本   1新版本
                "sortArr": [1, 2, 3, 4, 5, 6, 7],//1电子游艺 2体育赛事 3棋牌游戏 4彩票游戏 5视讯直播 6电竞赛事 7捕鱼机
                "maintainUrl": "https://www.ffyl0202.com/clientMaintain/getClientMaintain",
                "domains": [],
            },
        ];
        if (!l) {
            if (a.length > 2) a = a.slice(a.length - 2);
            u = a.join(".");
        }
        var o = c[2];// bggame
        // var o = c[0];// kubet
        var o = c[3];// betcome
        var o = c[5];// bet88
        var o = c[6];// jun88
        var o = c[0]
        var o = c[4];// betcome
        console.log('-----', o)
        for (var x in c) {
            var i = c[x];
            if (i.domains.indexOf(u) > -1) {
                o = i;
                break;
            }
        }
        //o.host = location.protocol + "//" + u + "/xxa";
        o.host ="https://lyjqv6pvv2.com/xxa"
        // o.host = "https://tc20014.com/xxa"// bet come
        // o.host = "https://tc00013.com/xxa/"// ku bet
        // o.host = "https://tc20011.com/xxa"
        // o.host = "https://715732.com/xxa";
        // o.host = "https://tc20009.com/xxa"
        // o.host = "https://tc00011.com/xxa"
		// gr86czdgdk.com  phattai68 内部域名
		// ofampihfkc.com  choibet 内部域名
		// tc20015.com  g9bet 内部域名
		// 715732.com  jun88 内部域名
        localStorage.setItem("host", o.host);
        sessionStorage.setItem("theme", parseInt(o.theme.slice(1)));
        window.theme = o.theme;
        window.clientCode = o.code;
        window.projectImgUrl = o.skin;
        window.projectName = o.name;
        window.winOpenTime = o.winOpenTime;
        window.childCode = o.childCode;
        window.locale = o.locale;
        window.mergeAccount = o.mergeAccount;
        window.maintainUrl = o.maintainUrl;
        window.interval = 180000;
        document.title = o.name;
        window.sortArr = o.sortArr;
        window.customerServiceStatus = o.customerServiceStatus;
    };
    !l && s();
    t();
})();
