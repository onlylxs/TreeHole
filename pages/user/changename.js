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
        param.url = "WeUsers/changeName";
        param.data = {};
        param.data.token = wx.getStorageSync('token');
        param.data.nick_name = this.data.inputValue;
        param.closeLoad = true;
        util.requests(param, res => {

        });
    },
})