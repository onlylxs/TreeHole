// pages/field/index.js
import util from '../../utils/util.js';
Page({

    data: {
        MyFieldList: '',
        FollowFieldList: [],
        wx_show: false,
        page: 1,
        keywords: '',
        isNotField: false,
    },
    onShow: function(options) {
        wx.showLoading({
            title: '加载中',
        });
        this.getMyFieldList();
    },
    // 获取热门领域
    getHotFieldList: function() {
        let param = {};
        param.url = "we_category/index";
        param.data = {};
        param.data.token = wx.getStorageSync('token');
        util.requests(param, res => {
            this.setData({
                wx_show: true,
                FollowFieldList: res.data.data.data
            })
            wx.stopPullDownRefresh();
        });
        wx.stopPullDownRefresh();
    },
    // 获取关注的领域
    getMyFieldList: function() {
        let param = {};
        param.url = "we_user_category/index";
        param.data = {};
        param.data.token = wx.getStorageSync('token');
        param.data.page = this.data.page;
        util.requests(param, res => {
            let res_data = res.data.data.data;
            if (res_data != undefined && res_data.length > 0) {
                this.setData({
                    MyFieldList: res_data,
                    last_page: res.data.data.last_page
                });
            } else {
                this.setData({
                    MyFieldList: []
                });
            }
            this.getHotFieldList();
        });
    },
    //获取搜索内容
    search_content: function(e) {
        this.setData({
            keywords: e.detail.value
        });
        this.searchFunc();
    },
    //查询搜索领域
    searchFunc: function() {
        let param = {};
        param.url = "we_category/search";
        param.data = {};
        param.data.token = wx.getStorageSync('token');
        param.data.keywords = this.data.keywords || ' ';
        util.requests(param, res => {
            if (res.data.data.data.length > 0) {
                this.setData({
                    searchList: res.data.data.data,
                    isNotField: false
                });
            } else {
                this.setData({
                    searchList: [],
                    isNotField: true
                });
            }
        });
    },
    GOFieldList: function(e) {
        let cid = e.currentTarget.dataset.cid,
            focus = e.currentTarget.dataset.focus;
        wx.navigateTo({
            url: '../field-list/index?cid=' + cid + '&focus=' + focus
        })
    },
    onPullDownRefresh: function() {
        this.onShow();
    }
})