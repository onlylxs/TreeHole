//index.js
//获取应用实例
const app = getApp();
import util from '../../utils/util.js';

Page({
    data: {
        height: '',
        TimeCk: true,
        TimeTF: false,
        SortTF: false,
        startDate: util.formatTime(new Date()),
        endDate: util.formatTime(new Date()),
        clss: 'icon-paixu',
        sortText: '时间顺序',
        page: 1,
        sortList: [{
            'idx': 1,
            'clss': 'icon-paixu',
            'text': '时间顺序'
        }, {
            'idx': 2,
            'clss': 'icon-shengxu',
            'text': '时间倒序'
        }, {
            'idx': 3,
            'clss': 'icon-remen',
            'text': '最热门'
        }],
        userTopic: [], //话题列表
        sortIdx: 1, //排序编号
        wx_show: false,
        loadmore: true,
    },
    // 生命周期函数--监听页面加载
    onShow: function (options) {
        wx.showLoading({
            title: '加载中',
        });
        this.getUserTopic();
    },
    //跳转详情页面
    ToDetail: function (e) {
        let tpid = e.currentTarget.dataset.tpid;
        wx.navigateTo({
            url: '../treeDetail/index?tid=' + tpid
        })
    },
    // 获取开始时间
    startDateFunc: function (e) {
        this.setData({
            startDate: e.detail.value
        })
    },
    // 获取结束时间
    endDateFunc: function (e) {
        this.setData({
            endDate: e.detail.value
        })
    },
    // 按时间查看显示隐藏
    ChangeTimeTF: function () {
        this.setData({
            TimeTF: !this.data.TimeTF
        });
    },
    ChangeTimeFunc: function () {
        this.setData({
            TimeTF: !this.data.TimeTF,
            page: 1,
            userTopic: [],
            loadmore: true
        });
        this.getUserTopic();
    },
    // 排序显示隐藏
    ChangeSortTF: function (e) {
        this.setData({
            SortTF: !this.data.SortTF
        })
    },
    // 排序显示隐藏
    ChangeSortFunc: function (e) {
        let clsss = e.currentTarget.dataset.clss || '',
            sortTexts = e.currentTarget.dataset.text || '',
            sortIdx = e.currentTarget.dataset.idx;
        if (clsss != '') {
            this.setData({
                clss: clsss,
                sortText: sortTexts
            })
        }
        this.setData({
            SortTF: !this.data.SortTF,
            sortIdx: sortIdx,
            page: 1,
            userTopic: [],
            loadmore: true
        })
        this.getUserTopic();
    },
    //获取话题列表
    getUserTopic: function () {
        let param = {};
        param.url = "we_topic/userTopic";
        param.data = {};
        param.data.order = this.data.sortIdx;
        param.data.token = wx.getStorageSync('token');
        param.data.start_time = Date.parse(this.data.startDate);
        param.data.end_time = Date.parse(this.data.endDate);
        param.data.page = this.data.page;
        param.closeLoad = true;
        util.requests(param, res => {
            if (this.data.is_onPullDown) {
                this.setData({
                    userTopic: [],
                });
            }
            let topic_list = res.data.data,
                list = this.data.userTopic;
            list = list.concat(topic_list.data)
            this.setData({
                userTopic: list,
                last_page: topic_list.last_page,
                wx_show: true,
                is_onPullDown:false
            });
            if (topic_list.last_page <= this.data.page) {
                this.setData({
                    loadmore: false
                });
            }
            this.data.page++;
            wx.stopPullDownRefresh();
        });
        wx.stopPullDownRefresh();
    },
    // 下拉刷新
    onPullDownRefresh: function () {
        this.setData({
            page: 1,
            loadmore: true,
            is_onPullDown: true
        });
        this.getUserTopic();
    },
    // 到达底部加载更多
    onReachBottom: function () {
        if (!this.data.loadmore) return;
        if (this.data.last_page >= this.data.page) {
            this.getUserTopic();
        }
    }
})