//app.js
const util = require('/utils/util.js');
App({
    onLaunch: function() {
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
                                        util.requests(param, res => {
                                            // console.log('登录成功！' + res)
                                            wx.setStorage({
                                                key: 'token',
                                                data: res.data.data.token,
                                            })
                                            wx.setStorage({
                                                key: 'user_id',
                                                data: res.data.data.id,
                                            })
                                        });
                                    } else {
                                        console.log('登录失败！' + res.errMsg)
                                    }
                                }
                            });
                        }
                    })
                }
            }
        })
    },
})