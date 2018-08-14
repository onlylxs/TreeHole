// pages/field/index.js
import util from '../../utils/util.js';
Page({

    data: {
        FollowFieldList: [],
        wx_show: false,
        page: 1,
        ApplyCateVal: '',
    },
    onShow: function(options) {
        wx.showLoading({
            title: '加载中',
        });
        this.getHotFieldList();
    },
    setReturn:function(){
        wx.navigateBack();
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
    //获取申请的内容
    getApplyCate: function(e) {
        this.setData({
            ApplyCateVal: e.detail.value
        });
    },
    //领域申请
    setApplyCate: function() {
        let param = {};
        param.url = "we_category/applyCate";
        param.data = {};
        param.data.keywords = this.data.ApplyCateVal;
        param.data.token = wx.getStorageSync('token');
        util.requests(param, res => {

        });
    }
})