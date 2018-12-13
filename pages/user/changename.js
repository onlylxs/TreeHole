import util from '../../utils/util.js';
var app = getApp();
Page({
    data: {},
    ReturnFunc() {
        wx.navigateBack();
    },
    getNameVal(e) {
        this.setData({
            inputValue: e.detail.value
        });
    },
    ConfirmFunc() {
        let param = {};
        param.url = "we_users/changeName";
        param.data = {};
        param.data.token = wx.getStorageSync('token');
        param.data.nick_name = this.data.inputValue;
        param.closeLoad = true;
        util.requests(param, res => {
            wx.showModal({
                title: '提示',
                content: res.data.msg,
                success: function (res) {
                    if (res.confirm) {
                        wx.navigateBack();
                    }
                }
            })
        });
    },
})