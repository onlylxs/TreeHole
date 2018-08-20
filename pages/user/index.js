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
        startDate: util.GetFilterDate('start'),
        endDate: util.GetFilterDate('end'),
        clss: 'icon-paixu',
        sortText: '时间倒序',
        page: 1,
        sortList: [{
            'idx': 1,
            'clss': 'icon-paixu',
            'text': '时间倒序'
        }, {
            'idx': 2,
            'clss': 'icon-shengxu',
            'text': '时间顺序'
        }, {
            'idx': 3,
            'clss': 'icon-remen',
            'text': '最热门'
        }],
        userTopic: [], //话题列表
        sortIdx: 1, //排序编号
        wx_show: false,
        loadmore: true,
        checkTo: true,
        lastY: 0, //滑动开始y轴位置
    },
    // 生命周期函数--监听页面加载
    onLoad: function(options) {
        wx.showLoading({
            title: '加载中',
        });
        this.getUserTopic();
    },
    onShow: function() {
        if (wx.getStorageSync('IsUpdateUser') == true) {
            wx.setStorage({
                key: 'IsUpdateUser',
                data: false,
            })
            this.setData({
                page: 1,
                is_onPullDown: true,
                loadmore: true
            })
            this.getUserTopic();
        }
    },
    //跳转详情页面
    ToDetail: function(e) {
        let tpid = e.currentTarget.dataset.tpid;
        if (this.data.checkTo) {
            wx.navigateTo({
                url: '../treeDetail/index?tid=' + tpid
            });
        }
    },
    // 长按删除
    deleteTopic: function(e) {
        let tpid = e.currentTarget.dataset.tpid,
            param = {};
        this.setData({
            checkTo: false
        })
        wx.showModal({
            title: '提示',
            content: "您确定要删除该话题吗？",
            success: (res) => {
                if (res.confirm) {
                    param.url = "we_topic/deleteTopic";
                    param.data = {};
                    param.data.id = tpid;
                    param.data.token = wx.getStorageSync('token');
                    param.closeLoad = true;
                    util.requests(param, res => {
                        wx.showToast({
                            title: "删除成功"
                        });
                        let ulist = this.data.userTopic
                        for (let i = 0; i < ulist.length; i++) {
                            if (ulist[i].id == tpid) {
                                ulist.splice(i, 1); //删除下标为i的元素
                            }
                        }
                        this.setData({
                            userTopic: ulist
                        });
                    });
                }
                this.setData({
                    checkTo: true
                });
            }
        })
    },
    // 切换开始时间
    ChangeStartDate: function(e) {
        let param = {};
        param.date = this.data.startDate;
        param.type = e.currentTarget.dataset.typei;
        param.index = e.detail.value;
        param.monthText = this.data.startDate.month[e.detail.value];
        this.setData({
            startDate: util.ChangeTimes(param)
        })
    },
    // 切换结束时间
    ChangeEndDate: function(e) {
        let param = {};
        param.date = this.data.endDate;
        param.type = e.currentTarget.dataset.typei;
        param.index = e.detail.value;
        param.monthText = this.data.endDate.month[e.detail.value];
        this.setData({
            endDate: util.ChangeTimes(param)
        })
    },
    // 按时间查看显示隐藏
    ChangeTimeTF: function() {
        this.setData({
            SortTF: false,
            TimeTF: !this.data.TimeTF
        });
    },
    ChangeTimeFunc: function() {
        this.setData({
            TimeTF: !this.data.TimeTF,
            page: 1,
            is_onPullDown: true,
            loadmore: true
        });
        this.getUserTopic();
    },
    // 排序显示隐藏
    ChangeSortTF: function(e) {
        this.setData({
            TimeTF: false,
            SortTF: !this.data.SortTF
        })
    },
    // 排序显示隐藏
    ChangeSortFunc: function(e) {
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
            is_onPullDown: true,
            loadmore: true
        })
        this.getUserTopic();
    },
    //获取话题列表
    getUserTopic: function() {
        let param = {};
        param.url = "we_topic/userTopic";
        param.data = {};
        param.data.order = this.data.sortIdx;
        param.data.page = this.data.page;
        param.data.token = wx.getStorageSync('token');
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
                is_onPullDown: false
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
    onPullDownRefresh: function() {
        this.setData({
            page: 1,
            loadmore: true,
            is_onPullDown: true
        });
        this.getUserTopic();
    },
    // 到达底部加载更多
    onReachBottom: function() {
        if (!this.data.loadmore) return;
        if (this.data.last_page >= this.data.page) {
            this.getUserTopic();
        }
    },
    handletouchmove: function(event) {
        var currentY = event.touches[0].pageY
        var ty = currentY - this.data.lastY
        console.info(ty)
        if (ty < 10 || ty > 10) {
            this.setData({
                SortTF: false,
                TimeTF: false
            });
        }
        //将当前坐标进行保存以进行下一次计算
        this.data.lastY = currentY
    },
})