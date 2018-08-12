//app.js
const util = require('/utils/util.js');
App({
    onLaunch: function () {
    },
    checkLogin: function (success) {
        wx.getSetting({ // 查看是否授权
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({ // 已经授权，可以直接调用 getUserInfo
                        success: res => {
                            let loginrawData = res.rawData,
                                loginSignature = res.signature;
                            wx.login({ //登录
                                success: res => {
                                    if (res.code) {
                                        let loginCode = res.code,
                                            param = {};
                                        param.url = "login/signIn";
                                        param.data = {};
                                        param.data.code = loginCode;
                                        param.data.raw_data = loginrawData;
                                        param.data.signature = loginSignature;
                                        wx.request({
                                            url: util.BASEURL + param.url,
                                            method: 'POST',
                                            data: param.data,
                                            header: {
                                                'content-type': 'application/json'
                                            },
                                            success(res) {
                                                switch (res.data.code) {
                                                    case 1:
                                                        wx.setStorage({
                                                            key: 'token',
                                                            data: res.data.data.token,
                                                        })
                                                        wx.setStorage({
                                                            key: 'user_id',
                                                            data: res.data.data.id,
                                                        });
                                                        return success();
                                                        break;
                                                    case 0:
                                                        wx.showModal({
                                                            title: '提示',
                                                            content: res.data.msg
                                                        })
                                                        break;
                                                    default:
                                                        wx.showModal({
                                                            title: '提示',
                                                            content: '程序异常，请稍后再试'
                                                        })
                                                        break;
                                                }
                                            },
                                            fail(res) {
                                                wx.showModal({
                                                    title: '提示',
                                                    content: '获取数据失败，请稍后再试！'
                                                })
                                            },
                                            complete() {
                                                wx.hideLoading();
                                            }
                                        })
                                    } else {
                                        console.log('登录失败！' + res.errMsg)
                                    }
                                }
                            });
                        }
                    })
                } else {
                    return success();
                    wx.hideLoading();
                }
            }
        })
    }
})