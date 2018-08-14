//index.js
//获取应用实例
const app = getApp();
import util from '../../utils/util.js';

Page({
    data: {
        height: '',
        wx_show: true,
        loadmore: true,
        message_list: [],
        scrollTop: 0,
        page: 1,
    },
    // 生命周期函数--监听页面加载
    onShow: function(options) {
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    page: 1,
                    message_list: [],
                    height: res.windowHeight
                })
            }
        });
        wx.showLoading({
            title: '加载中',
        });
        this.getMessageList();
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
            let arrlist = res.data.data,
                mlist = [];
            mlist = mlist.concat(arrlist);
            this.setData({
                message_list: mlist,
                wx_show: true
            });
            this.data.page++;
            if ((arrlist.last_page <= this.data.page) || arrlist.length <= 9) {
                this.setData({
                    loadmore: false
                });
            }
        });
    },
    // 下拉刷新
    upper: function (e) {
    },
    // 到达底部加载更多
    lower: function(e) {
        if (this.data.last_page >= this.data.page) {
            this.getMessageList();
        }
    }
})