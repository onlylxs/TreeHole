// pages/saysome/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        index: 0,
        array: ['美国', '中国', '巴西', '日本']
    },
    onLoad: function(options) {

    },
    bindPickerChange: function(e) {
        this.setData({
            index: e.detail.value
        })
    },
    getMap: function(e) {
        wx.chooseLocation({
            success: function(res) {
                console.info(res);
            },
            fail: function (res) {
                console.info(res);
            }
        })
    }
})