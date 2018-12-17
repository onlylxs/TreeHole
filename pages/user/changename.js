import util from '../../utils/util.js';
var app = getApp();
Page({
    data: {
        changeNum: wx.getStorageSync('change_name') == 1 ? 0 : 1,
        resetName: wx.getStorageSync('reset_name'),
    },
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
            wx.setStorage({
                key: 'change_name',
                data: 0,
            })
            wx.showModal({
                title: '提示',
                content: res.data.msg,
                success: function(res) {
                    if (res.confirm) {
                        wx.navigateBack();
                    }
                }
            })
        });
    },
})