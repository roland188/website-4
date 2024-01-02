<!-- 银行卡支付 -->
<template>
    <div class="bank-recharge-page">
        <div class="bank-recharge-header">
            <img @click="back" style="width:16px;height:16px;position:absolute;left:12px;top:11px" src="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAAAZklEQVRIie3WMQqDUBBF0YN7SDD7X0kqiWgTiyxHixgQK0H9SHh3AXNgimFIaXt39HiWRgeMeJVCb3jP6Ad10KBBL4dCN6OD77HYXXXEkDNbr/oRPHjwv8OXr09bEv7hHZrScLpmExvAOL964pkiAAAAAElFTkSuQmCC" alt="">
            {{$t('银行卡支付')}}
        </div>
        <div class="bank-recharge-top">
            <img src="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDcuMC1jMDAwIDc5LmRhYmFjYmIsIDIwMjEvMDQvMTQtMDA6Mzk6NDQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjg2NTVCRDQ5MTJGOTExRUNBQTI5Q0Y1RURBRDQ1MDE3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjg2NTVCRDRBMTJGOTExRUNBQTI5Q0Y1RURBRDQ1MDE3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODY1NUJENDcxMkY5MTFFQ0FBMjlDRjVFREFENDUwMTciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ODY1NUJENDgxMkY5MTFFQ0FBMjlDRjVFREFENDUwMTciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz58m2jcAAAESUlEQVR42sxYWWxMURieqenUWFrF2IqIaqIhETS2JpbEkkh4QIhEJSoSagnxYIkXsSQ82PclHlRKUElF8GINsUxpkdSW2OMBqV1VY3x/8h35XdedudM71T/5Mueu893zL+f7jz+a38v3D8sGdgIpQB3g99XffgItgGJgdzwPBByuNQdG+ZJjlfHe6ETwKfCZX3wGeAxkcBbcmMx8DceTgNbAEzcEC4Es4AvdKfYdyASa8ng1cMWDmRtMgsOAb0Azy4fI8SkgogkuBXJivLi9B+Tkz9M4HkfY2UcrwTck+BV4B4SAWqCJIvbRA4Ly/h8cfwI+0EPyX0GgLa+9t7rYZOc+YBldK4R6Apf4EnFLWM2A2xg0VcD81w5gFWNaiPfgf4WckuQTb/7K49cqIfYwYZomSPAHf8NqNr8QYi/jyWLr7LRRQZxBeGUdLccZKkHjLjOvgPl8sNZDcvLR1y3noonUwbfANt9/thRfI7dGTzAQxweMYen5Xk/B4GciSvw98oqglJW9XAq9siXAeq9cHGX989JqvHSxuHU6FU1dPYmJi1OBKgf3/zVpsQjKSnKjAXIhqMYhNwQbymSpm0BykcZIsBo4kWiZGcAyUxOjzKRQot2ihLOzzkBvqpcQl9MHQHmiSSJ9yUml1eKxycBRy7l+wFyK1LDNM9eAA1RNrsrMT2ay285N2wImWqEi95o9jyk5g9jlnQW6uJlB0W1jKYdiEW3CD9ZlRETwTI5F+20CSunaWr43D5jHPmU0Q0S6yYp4CEqhvpNg4M9V5C5TulXaJIfM5DGgCNjOcCoBhsj1ZIkFSYKtHN8FhpPceOAq0F0p9TImzA4uCj62GzuTqWYWM+PNSmTichZbz2K2srOYOP14/aAhBpsiRGO5OMg4yrbZ/ohy6aqge3SrMJHjXSaWYLnAcaAvSQ7m+RL2Q20pktcABVxexwViyO403uxkORaCuSpbS9V5UedDbeJeVpCpTMbTTKByJk3/gGXBtppk2gbKrW8297S0CfyuqgI8U+efcYbe0iMhbqf4SVr33vdIsH08amaxy/hrrj5OK6BCNZb1tj8wTTVQfhtJFkzGWvycv60YV694LI16HxIxWy2beX86sEIJBZPl7wKJCkkHe8hGPZUxV6my0roHNJAwJSdCFT/IvEsTTGfPmunUp/7DQtzXec+ttXPsZRYB+xmPCxmf1YzrTsA6ujhLCYYC1dif9Efze11h1dabR24I+vlxq+lGs3tVpkrNHMszj1jMRwAXLLtoEaoemfm8gCoJzSz7dW6tqxqLAjpCt84GXgBr1fUZQDdmqy5PZSRnREadzKDdBqZbkxk8TxjLpPtM3B0GNgI3LR7qSIkm+5QdeK7IrCh+h010L6wdcAgYqc7dBu4zKbtQwHZQUk3idsvv+EkyQbNcrqSyCTvcJyJiOXDxjwBvAILGspjZeRwHmdFVzHrbPfBfAgwAis7xkOQ+JVsAAAAASUVORK5CYII=" alt="">
            <div class="bank-recharge-amount">{{query.amount}}</div>
        </div>
        <div class="bank-recharge-box">
            <div class="bank-recharge-title">{{$t('支付详情')}}</div>
            <div class="bank-recharge-row">
                <span>{{$t('收款户名')}}：</span>
                <span>{{query.bankuser}}</span>
                <img @click="copy(query.bankuser)" src="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDcuMC1jMDAwIDc5LmRhYmFjYmIsIDIwMjEvMDQvMTQtMDA6Mzk6NDQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjg2NTVCRDQ1MTJGOTExRUNBQTI5Q0Y1RURBRDQ1MDE3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjg2NTVCRDQ2MTJGOTExRUNBQTI5Q0Y1RURBRDQ1MDE3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTkwOTIwRDAxMkY4MTFFQ0FBMjlDRjVFREFENDUwMTciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ODY1NUJENDQxMkY5MTFFQ0FBMjlDRjVFREFENDUwMTciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz46fV9IAAABcUlEQVR42mJ86WvFAATuQFwJxLpAzAzE/xgIAyYg3gTEcdgkWYDYE4i3QfnPgPg/lE2M4d9xSYAMXg5VIAPE7xioBEAG8wPxZiRDRYE4C4jloN79TyA4WIGYEaruORAvAOIrLEgKQEASiG8BMQ8Fji0GYiuYgYxQuoVCQ2GgH2bwLyhtTEDDTyBeC8SvCKhTZkJLAb8IaDgBxCFAvJGAuj/oQfGXgIbfaOpxgb9MJIYdKxqNN7mQAmShtAQx6RgfaAbi81Cvg/BrqHgNEM+Bpt2/UAt7kX1CyGBQJJ3FIn4GimEAlMm6kA2GBYUCDoNBmr9Cs/wPIN4JFZ8F5X+Hyn8AYg70oOgE4st4YpsLiS0MpQWAmJ1QGFcg8Qklo09Q+gupqYKQwT+g9GcC6hjRDeYkoEEHiIOA2JyAOnb0VPGGiHS8loj0/gXdxdVUKucb0F18DIgDgbgAWqOQkjNBmeUlEM8DFfaM////Z6AFAAgwAOHXRkmSMoTRAAAAAElFTkSuQmCC" alt="">
            </div>
            <div class="bank-recharge-row">
                <span>{{$t('收款银行')}}：</span>
                <span>{{query.bankname}}</span>
                <img @click="copy(query.bankname)" src="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDcuMC1jMDAwIDc5LmRhYmFjYmIsIDIwMjEvMDQvMTQtMDA6Mzk6NDQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjg2NTVCRDQ1MTJGOTExRUNBQTI5Q0Y1RURBRDQ1MDE3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjg2NTVCRDQ2MTJGOTExRUNBQTI5Q0Y1RURBRDQ1MDE3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTkwOTIwRDAxMkY4MTFFQ0FBMjlDRjVFREFENDUwMTciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ODY1NUJENDQxMkY5MTFFQ0FBMjlDRjVFREFENDUwMTciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz46fV9IAAABcUlEQVR42mJ86WvFAATuQFwJxLpAzAzE/xgIAyYg3gTEcdgkWYDYE4i3QfnPgPg/lE2M4d9xSYAMXg5VIAPE7xioBEAG8wPxZiRDRYE4C4jloN79TyA4WIGYEaruORAvAOIrLEgKQEASiG8BMQ8Fji0GYiuYgYxQuoVCQ2GgH2bwLyhtTEDDTyBeC8SvCKhTZkJLAb8IaDgBxCFAvJGAuj/oQfGXgIbfaOpxgb9MJIYdKxqNN7mQAmShtAQx6RgfaAbi81Cvg/BrqHgNEM+Bpt2/UAt7kX1CyGBQJJ3FIn4GimEAlMm6kA2GBYUCDoNBmr9Cs/wPIN4JFZ8F5X+Hyn8AYg70oOgE4st4YpsLiS0MpQWAmJ1QGFcg8Qklo09Q+gupqYKQwT+g9GcC6hjRDeYkoEEHiIOA2JyAOnb0VPGGiHS8loj0/gXdxdVUKucb0F18DIgDgbgAWqOQkjNBmeUlEM8DFfaM////Z6AFAAgwAOHXRkmSMoTRAAAAAElFTkSuQmCC" alt="">
            </div>
            <div class="bank-recharge-row">
                <span>{{$t('收款卡号')}}：</span>
                <span>{{query.cardno}}</span>
                <img @click="copy(query.cardno)" src="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDcuMC1jMDAwIDc5LmRhYmFjYmIsIDIwMjEvMDQvMTQtMDA6Mzk6NDQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjg2NTVCRDQ1MTJGOTExRUNBQTI5Q0Y1RURBRDQ1MDE3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjg2NTVCRDQ2MTJGOTExRUNBQTI5Q0Y1RURBRDQ1MDE3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTkwOTIwRDAxMkY4MTFFQ0FBMjlDRjVFREFENDUwMTciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ODY1NUJENDQxMkY5MTFFQ0FBMjlDRjVFREFENDUwMTciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz46fV9IAAABcUlEQVR42mJ86WvFAATuQFwJxLpAzAzE/xgIAyYg3gTEcdgkWYDYE4i3QfnPgPg/lE2M4d9xSYAMXg5VIAPE7xioBEAG8wPxZiRDRYE4C4jloN79TyA4WIGYEaruORAvAOIrLEgKQEASiG8BMQ8Fji0GYiuYgYxQuoVCQ2GgH2bwLyhtTEDDTyBeC8SvCKhTZkJLAb8IaDgBxCFAvJGAuj/oQfGXgIbfaOpxgb9MJIYdKxqNN7mQAmShtAQx6RgfaAbi81Cvg/BrqHgNEM+Bpt2/UAt7kX1CyGBQJJ3FIn4GimEAlMm6kA2GBYUCDoNBmr9Cs/wPIN4JFZ8F5X+Hyn8AYg70oOgE4st4YpsLiS0MpQWAmJ1QGFcg8Qklo09Q+gupqYKQwT+g9GcC6hjRDeYkoEEHiIOA2JyAOnb0VPGGiHS8loj0/gXdxdVUKucb0F18DIgDgbgAWqOQkjNBmeUlEM8DFfaM////Z6AFAAgwAOHXRkmSMoTRAAAAAElFTkSuQmCC" alt="">
            </div>
            <div class="bank-recharge-row">
                <span>{{$t('开户行-支行信息')}}：</span>
                <span>{{query.branchname}}</span>
                <img @click="copy(query.branchname)" src="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDcuMC1jMDAwIDc5LmRhYmFjYmIsIDIwMjEvMDQvMTQtMDA6Mzk6NDQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjg2NTVCRDQ1MTJGOTExRUNBQTI5Q0Y1RURBRDQ1MDE3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjg2NTVCRDQ2MTJGOTExRUNBQTI5Q0Y1RURBRDQ1MDE3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTkwOTIwRDAxMkY4MTFFQ0FBMjlDRjVFREFENDUwMTciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ODY1NUJENDQxMkY5MTFFQ0FBMjlDRjVFREFENDUwMTciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz46fV9IAAABcUlEQVR42mJ86WvFAATuQFwJxLpAzAzE/xgIAyYg3gTEcdgkWYDYE4i3QfnPgPg/lE2M4d9xSYAMXg5VIAPE7xioBEAG8wPxZiRDRYE4C4jloN79TyA4WIGYEaruORAvAOIrLEgKQEASiG8BMQ8Fji0GYiuYgYxQuoVCQ2GgH2bwLyhtTEDDTyBeC8SvCKhTZkJLAb8IaDgBxCFAvJGAuj/oQfGXgIbfaOpxgb9MJIYdKxqNN7mQAmShtAQx6RgfaAbi81Cvg/BrqHgNEM+Bpt2/UAt7kX1CyGBQJJ3FIn4GimEAlMm6kA2GBYUCDoNBmr9Cs/wPIN4JFZ8F5X+Hyn8AYg70oOgE4st4YpsLiS0MpQWAmJ1QGFcg8Qklo09Q+gupqYKQwT+g9GcC6hjRDeYkoEEHiIOA2JyAOnb0VPGGiHS8loj0/gXdxdVUKucb0F18DIgDgbgAWqOQkjNBmeUlEM8DFfaM////Z6AFAAgwAOHXRkmSMoTRAAAAAElFTkSuQmCC" alt="">
            </div>
        </div>
        <div class="bank-recharge-box">
            <div class="bank-recharge-title">{{$t('温馨提示')}}</div>
            <div class="bank-recharge-row">1、{{$t('请正确填写收款卡号和充值金额')}}。</div>
            <div class="bank-recharge-row">2、{{$t('银行卡转账成功后请确认已付款')}}。</div>
            <div class="bank-recharge-row">3、{{$t('到账时间取决于银行处理时间，请耐心等待')}}。</div>
            <div class="bank-recharge-row">4、{{$t('请勿重复支付')}}。</div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            query: {
                amount: '',
                orderid: '',
                cardno: '',
                bankname: '',
                bankuser: '',
                branchname: ''
            }
        }
    },
    mounted () {
        const str = decodeURIComponent(this.$route.query.query)
        const arr = str.split('&')
        arr.forEach(e => {
            const a = e.split('=')
            this.query[a[0]] = a[1]
        })
    },
    methods: {
        back () {
            this.$router.back()
        },
        copy (span) {
            this.$copyText(span).then(() => {
                this.$message.success(this.$t('复制成功'))
            }, () => {
                this.$message.error(this.$t('复制失败'))
            })
        }
    }
}
</script>

<style scoped>
.bank-recharge-page {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 750px;
    margin: 0 auto;
    height: 100vh;
    background-color: rgba(247, 247, 247, 1);
    color: #666;
    span-align: center;
    box-shadow: 0 0 4px #e2dddd;
}
.bank-recharge-page img {
    cursor: pointer;
}
.bank-recharge-title {
    font-weight: bold;
    font-size: 15px;
    color: #000;
    margin-bottom: 10px;
}
.bank-recharge-header {
    width: 100%;
    line-height: 40px;
    font-weight: bold;
    font-size: 15px;
    color: #000;
    background-color:#fff;
    position: relative;
    text-align: center;
}
.bank-recharge-box {
    width: 94%;
    margin: 10px auto;
    box-shadow: 0 0 4px #e2dddd;
    border-radius: 4px;
    box-sizing: border-box;
    padding: 10px 20px 20px 20px;
    background-color:#fff;
    text-align: left;
}
.bank-recharge-row {
    line-height: 26px;
}
.bank-recharge-row img {
    width: 16px;
    height: 16px;
    position: relative;
    top: 2px;
    left: 10px;
}
.bank-recharge-top {
    padding: 20px 0;
}
.bank-recharge-amount {
    font-size: 20px;
    font-weight: bold;
    color: rgba(255, 56, 34, 1);
    line-height: 20px;
}
.bank-recharge-top img {
    width: 20px;
    height: 20px;
}
</style>