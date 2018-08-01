// pages/field/index.js
import util from '../../utils/util.js';
Page({

    data: {
        MyFieldList: [],
        FollowFieldList: []
    },
    onLoad: function(options) {
        this.getFieldList();
    },
    getFieldList: function() {
        console.info(wx.getStorageSync('token'))
        let param = {};
        param.url = "we_category/index";
        param.data = {};
        param.data.token = wx.getStorageSync('token');
        util.requests(param, res => {

        });
    }
})