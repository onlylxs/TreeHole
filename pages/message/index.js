//index.js
//获取应用实例
const app = getApp();
import util from '../../utils/util.js';

Page({
    data: {
        height: '',
        wx_show: true,
        loadmore: true,
        message_list:[],
    },
    // 生命周期函数--监听页面加载
    onLoad: function (options) {
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    height: res.windowHeight - 46
                })
            }
        });
        wx.showLoading({
            title: '加载中',
        });
        this.getMessageList();
    },
    //获取消息通知列表
    getMessageList: function () {
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
            let arrlist = res.data.data.data,
                mlist=this.data.message_list;
            for (let i = 0; i < arrlist.length; i++) {
                mlist.push(arrlist[i]);
            }
            this.setData({
                message_list: mlist,
                wx_show: true
            });
            if (arrlist.last_page <= this.data.page) {
                this.setData({
                    loadmore: false
                });
            }
            this.data.page++;
        });
    },
    // 到达底部加载更多
    lower: function (e) {
        if (this.data.last_page >= this.data.page) {
            this.getMessageList();
        }
    },
})