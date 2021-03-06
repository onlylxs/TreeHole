// pages/field/index.js
import util from '../../utils/util.js';
Page({

    data: {
        MyFieldList: [],
        FollowFieldList: [],
        wx_show: false,
        page: 1,
        keywords: '',
        isNotField: false,
        isShowAdver: true,
    },
    onLoad: function(options) {
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
            let result = res.data.data,
                advert_list = [],
                advert_fiexd = '';
            for (var key in result.ads) {
                if (key != 'top_ad') {
                    advert_list.push(result.ads[key]);
                } else {
                    advert_fiexd = result.ads[key];
                }
            }
            this.setData({
                wx_show: true,
                advert: advert_list,
                advert_fiexd: advert_fiexd,
                FollowFieldList: result.data
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
            if (this.data.is_onPullDown) {
                this.setData({
                    MyFieldList: [],
                });
            }
            let res_data = this.data.MyFieldList;
            res_data = res_data.concat(res.data.data.data);
            if (res_data != undefined && res_data.length > 0) {
                this.setData({
                    MyFieldList: res_data,
                    last_page: res.data.data.last_page,
                    page: this.data.page,
                    is_onPullDown: false
                });
            } else {
                this.setData({
                    MyFieldList: [],
                    is_onPullDown: false
                });
            }
            this.data.page++;
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
            focus = e.currentTarget.dataset.focus,
            tit = e.currentTarget.dataset.tit;
        wx.navigateTo({
            url: '../field-list/index?cid=' + cid + '&focus=' + focus + '&tit=' + tit
        })
    },
    onPullDownRefresh: function () {
        this.setData({
            page: 1,
            loadmore: true,
            is_onPullDown: true
        })
        this.getMyFieldList();
    },
    // 关闭广告
    CloseAdver: function() {
        this.setData({
            isShowAdver: false,
        });
    }
})