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
				"code": "bgga",
				"skin": "bgga",
				"childCode": "bgga",
				"locale": 'pt',
				"name": "BG.GAME",
				"theme": "a055",
				"winOpenTime": "6000",
				"customerServiceStatus": 0,//0旧版本   1新版本
				"sortArr": [5, 1, 7, 2, 3, 8, 4, 6,],//1电子游艺 2体育赛事 3棋牌游戏 4彩票游戏 5视讯直播 6电竞赛事 7捕鱼机
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
				"sortArr": [5, 1, 7, 2, 3, 8, 4, 6,],//1电子游艺 2体育赛事 3棋牌游戏 4彩票游戏 5视讯直播 6电竞赛事 7捕鱼机
				"domainName": "306167.com",
				"statistics": "",
				"maintainUrl": "https://www.ffyl0202.com/clientMaintain/getClientMaintain",
				"domains": [],
			},
			{
				"code": "viet",
				"skin": "betc88",
				"childCode": "new8",
				"mergeAccount": "",
				"locale": 'vi',
				"name": "bet come",
				"theme": "a053",
				"invite": "",
				"winOpenTime": "6000",
				"customerServiceStatus": 1, //0旧版本   1新版本
				"sortArr": [5, 1, 3, 4, 2, 6], //1电子游艺 2体育赛事 3棋牌游戏 4彩票游戏 5视讯直播 6电竞赛事 7捕鱼机
				"domainName": "306167.com",
				"statistics": "",
				"maintainUrl": "https://www.ffyl0202.com/clientMaintain/getClientMaintain",
				"domains": ["306167.com"]
			},
			{
				"code": "viet",
				"skin": "xiaocao",
				"childCode": "new8",
				"mergeAccount": "",
                "locale": 'vi',
                "name": "88bet",
				"theme": "a053",
				"invite": "",
				"winOpenTime": "6000",
				"customerServiceStatus": 1, //0旧版本   1新版本
				"sortArr": [5, 1, 3, 4, 2, 6], //1电子游艺 2体育赛事 3棋牌游戏 4彩票游戏 5视讯直播 6电竞赛事 7捕鱼机
				"domainName": "306167.com",
				"statistics": "",
				"maintainUrl": "https://www.ffyl0202.com/clientMaintain/getClientMaintain",
				"domains": ["306167.com"]
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
		var codeList = [//0 sovip、1 bggame、2 kubet、3 betcome 、4 88bet、5 jun88、6  phattai68、7 choibet、8 g9bet
			{ data: c[0],host: 'https://m.sovip66.com/xxa'},
			{ data: c[1],host: 'https://m.tc20014.com/xxa'},
			{ data: c[2],host: 'https://m.tc00013.com/xxa'},
			{ data: c[3],host: 'https://m.betcome1.com/xxa'},
			{ data: c[4],host: 'https://m.tc00011.com/xxa'},
			{ data: c[5],host: 'https://m.715732.com/xxa'},
			{ data: c[6],host: 'https://m.gr86czdgdk.com/xxa'},
			{ data: c[7],host: 'https://m.ofampihfkc.com/xxa'},
			{ data: c[8],host: 'https://m.tc20015.com/xxa'},
		]
		var codeData = codeList[8]
		var o = codeData.data
		for (var x in c) {
			var i = c[x];
			if (i.domains.indexOf(u) > -1) {
				o = i;
				break;
			}
		}
		o.host = codeData.host
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
