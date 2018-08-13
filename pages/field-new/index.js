// pages/field/index.js
import util from '../../utils/util.js';
Page({

    data: {
        FollowFieldList: [],
        wx_show:false,
        page:1,
        keywords:'',
        isNotField:false,
    },
    onShow: function (options) {
        this.getHotFieldList();
    },
    // 获取热门领域
    getHotFieldList: function () {
        let param = {};
        param.url = "we_category/index";
        param.data = {};
        param.data.token = wx.getStorageSync('token');
        util.requests(param, res => {
            this.setData({
                wx_show: true,
                FollowFieldList: res.data.data.data
            })
        });
    },
})