//index.js
//获取应用实例
const app = getApp();
import util from '../../utils/util.js';

Page({
    data: {
        wx_show: true,
        loadmore: true,
        message_list: [],
        scrollTop: 0,
        page: 1,
    },
    // 生命周期函数--监听页面加载
    onLoad: function(options) {
        wx.showLoading({
            title: '加载中',
        });
        wx.setStorage({
            key: 'IsUpdateMsg',
            data: false,
        })
        this.getMessageList();
    },
    onShow: function () {
        if (wx.getStorageSync('IsUpdateMsg') == true) {
            wx.setStorage({
                key: 'IsUpdateMsg',
                data: false,
            })
            this.setData({
                page: 1,
                is_onPullDown: true,
                loadmore: true
            })
            this.getMessageList();
        }
    },
    //获取消息通知列表
    getMessageList: function() {
        let param = {};
        param.url = "user_center/index";
        param.data = {};
        param.data.order = this.data.sortIdx;
        param.data.category_id = this.data.cid;
        param.data.token = wx.getStorageSync('token');
        param.data.start_time = Date.parse(this.data.startDate);
        param.data.end_time = Date.parse(this.data.endDate);
        param.data.page = this.data.page;
        param.closeLoad = true;
        util.requests(param, res => {
            if (this.data.is_onPullDown) {
                this.setData({
                    message_list: [],
                });
            }
            let arrlist = res.data.data,
                mlist = this.data.message_list;
            mlist = mlist.concat(arrlist);
            this.setData({
                message_list: mlist,
                wx_show: true,
                is_onPullDown: false
            });
            this.data.page++;
            let mlistLen = arrlist.length || 0;
            if (arrlist.length <= 9) {
                this.setData({
                    loadmore: false
                });
            }
            wx.stopPullDownRefresh();
        });
        wx.stopPullDownRefresh();
    },
    //跳转详情页面
    ToDetail: function (e) {
        let tpid = e.currentTarget.dataset.tpid;
        wx.navigateTo({
            url: '../treeDetail/index?tid=' + tpid
        })
    },
    // 下拉刷新
    onPullDownRefresh: function() {
        this.setData({
            page: 1,
            loadmore: true,
            is_onPullDown: true
        });
        this.getMessageList();
    },
    // 到达底部加载更多
    onReachBottom: function() {
        if (!this.data.loadmore) return;
        this.getMessageList();
    }
})