// pages/authorize/index.js
import util from '../../utils/util.js';
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {},
    onLoad() {},
    authCheck: function(success) {
        wx.showLoading({
            title: '加载中',
        })
        wx.getSetting({ // 查看是否授权
            success: res => {
                wx.hideLoading();
                // if (res.authSetting['scope.userInfo']) {}
            }
        })
    },
    onGotUserInfo: function(e) {
        let rawData = e.detail.rawData || '';
        if (rawData) {
            wx.showLoading({
                title: '加载中',
            })
            this.ckLogin(rawData, e.detail.signature);
        } else {
            wx.showToast({
                title: '需要授权才能继续使用服务',
                icon: "none"
            })
        }
    },
    ckLogin: function(loginrawData, loginSignature) {
        setTimeout(() => {
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
                            wx.setStorage({
                                key: 'token',
                                data: res.data.data.token,
                            })
                            util.setStorageAll();
                            wx.navigateBack();
                        });
                    } else {
                        wx.showToast({
                            title: '登录失败，请重新授权',
                            icon: "none"
                        })
                    }
                }
            });
        }, 800)
    }
})