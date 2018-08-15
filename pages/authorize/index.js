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
            wx.showModal({
                title: '提示',
                content: "您未授权登录，有些功能无法操作",
                success: function(res) {
                    if (res.confirm) {
                        wx.reLaunch({
                            url: "/pages/index/index"
                        })
                    }
                }
            })
        }
    },
    ckLogin: function(loginrawData, loginSignature) {
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
                        wx.navigateBack()
                    });
                } else {
                    wx.showModal({
                        title: '提示',
                        content: "登录失败，请重新授权"
                    })
                }
            }
        });
    }
})