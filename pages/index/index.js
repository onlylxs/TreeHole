//index.js
//获取应用实例
const app = getApp();
import util from '../../utils/util.js';

Page({
    data: {
        TimeCk: true,
        TimeTF: false,
        SortTF: false,
        startDate: {
            value: util.formatTime(new Date()),
            text: util.formatTimeText(util.formatTime(new Date())),
        },
        endDate: {
            value: util.formatTime(new Date()),
            text: util.formatTimeText(util.formatTime(new Date())),
        },
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
        hots: [], //最热门
        todays: [], //今日话题
        topicList: [], //话题列表
        sortIdx: 1, //排序编号
        wx_show: false,
        loadmore: true,
    },
    // 生命周期函数--监听页面加载
    onLoad: function(options) {
        this.getTopicList();
        wx.showLoading({
            title: '加载中',
        });
    },
    onShow: function() {
        if (wx.getStorageSync('IsUpdate') == true) {
            wx.setStorage({
                key: 'IsUpdate',
                data: false,
            });
            this.setData({
                page: 1,
                is_onPullDown: true,
                loadmore: true
            })
            this.getTopicList();
        }
    },
    //跳转详情页面
    ToDetail: function(e) {
        let tpid = e.currentTarget.dataset.tpid;
        wx.navigateTo({
            url: '../treeDetail/index?tid=' + tpid
        })
    },
    // 获取开始时间
    startDateFunc: function(e) {
        let times = e.detail.value,
            obj = {};
        obj.value = times;
        obj.text = util.formatTimeText(times);
        this.setData({
            startDate: obj
        })
    },
    // 获取结束时间
    endDateFunc: function(e) {
        let times = e.detail.value,
            obj = {};
        obj.value = times;
        obj.text = util.formatTimeText(times);
        this.setData({
            endDate: obj
        })
    },
    // 按时间查看显示隐藏
    ChangeTimeTF: function() {
        this.setData({
            TimeTF: !this.data.TimeTF,
            SortTF: false
        });
    },
    ChangeTimeFunc: function() {
        this.setData({
            TimeTF: !this.data.TimeTF,
            page: 1,
            is_onPullDown: true,
            loadmore: true
        });
        this.getTopicList();
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
        if (sortIdx == 3) {
            this.theHot();
        } else {
            this.getTopicList();
        }

    },
    //获取话题列表
    getTopicList: function() {
        let param = {};
        param.url = "we_topic/index";
        param.data = {};
        param.data.order = this.data.sortIdx;
        param.data.token = wx.getStorageSync('token');
        param.data.start_time = Date.parse((this.data.startDate.value).replace(/-/g, "/") + " 00:00:00") /1000;
        param.data.end_time = Date.parse((this.data.endDate.value).replace(/-/g, "/") + " 23:59:59") / 1000;
        param.data.page = this.data.page;
        param.closeLoad = true;
        util.requests(param, res => {
            if (this.data.is_onPullDown) {
                this.setData({
                    topicList: [],
                });
            }
            let topic_list = res.data.data.topic_list,
                list = this.data.topicList,
                today_list = [],
                hots_list = [];
            today_list.push(res.data.data.today);
            hots_list.push(res.data.data.hot);
            list = list.concat(topic_list.data);
            this.setData({
                todays: today_list,
                hots: hots_list,
                topicList: list,
                last_page: topic_list.last_page,
                advert: res.data.data.ads,
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
    },
    //话题点赞
    setLikes: function(e) {
        wx.showLoading({
            title: '加载中',
        });
        let tid = e.currentTarget.dataset.tid || '',
            index = e.currentTarget.dataset.index,
            Ttype = e.currentTarget.dataset.ttype,
            is_liked = e.currentTarget.dataset.is_liked,
            param = {};
        if (is_liked == 0) {
            param.url = "likes/vote";
        } else {
            param.url = "likes/cancelVote";
        }
        param.data = {};
        param.data.token = wx.getStorageSync('token');
        param.data.topic_id = tid;
        param.data.user_id = wx.getStorageSync('user_id');
        util.requests(param, res => {
            this.likesFunc(parseInt(Ttype), index);
            wx.showToast({
                title: res.data.msg,
                icon: 'none',
            });
            wx.hideLoading();
        });
    },
    //话题点赞
    likesFunc(Ttype, index) {
        let tlist = [];
        switch (Ttype) {
            case 1:
                tlist = this.data.todays;
                break;
            case 2:
                tlist = this.data.hots;
                break;
            case 3:
                tlist = this.data.topicList;
                break;
        }
        for (let i in tlist) { //遍历列表数据
            if (i == index) { //根据下标找到目标
                if (tlist[i].is_liked == 0) { //如果是没点赞+1
                    tlist[i].is_liked = 1;
                    tlist[i].likes = parseInt(tlist[i].likes) + 1
                } else {
                    tlist[i].is_liked = 0;
                    tlist[i].likes = parseInt(tlist[i].likes) - 1
                }
            }
        }
        switch (Ttype) {
            case 1:
                this.setData({
                    todays: tlist
                });
                break;
            case 2:
                this.setData({
                    hots: tlist
                })
                break;
            case 3:
                this.setData({
                    topicList: tlist
                })
                break;
        }
    },
    // 最热门
    theHot: function() {
        let param = {};
        param.url = "we_topic/theHot";
        param.data = {};
        param.data.order = this.data.sortIdx;
        param.data.token = wx.getStorageSync('token');
        param.data.page = this.data.page;
        param.closeLoad = true;
        util.requests(param, res => {
            if (this.data.is_onPullDown) {
                this.setData({
                    topicList: [],
                });
            }
            let topic_list = res.data.data,
                list = this.data.topicList;
            list = list.concat(topic_list.data);
            this.setData({
                topicList: list,
                last_page: topic_list.last_page,
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
    },
    // 跳转小程序
    openprogram: function(e) {
        let app_id = e.currentTarget.dataset.app_id,
            adv_path = e.currentTarget.dataset.path;
        wx.navigateToMiniProgram({
            appId: app_id,
            path: adv_path,
            extraData: {
                foo: 'bar'
            },
            envVersion: 'develop',
            success(res) {
                // 打开成功
            }
        })
    },
    // 下拉刷新
    onPullDownRefresh: function() {
        this.setData({
            page: 1,
            loadmore: true,
            is_onPullDown: true
        })
        if (this.data.sortIdx == 3) {
            this.theHot();
        } else {
            this.getTopicList();
        }
    },
    // 到达底部加载更多
    onReachBottom: function() {
        if (!this.data.loadmore) return;
        if (this.data.last_page >= this.data.page) {
            if (this.data.sortIdx == 3) {
                this.theHot();
            } else {
                this.getTopicList();
            }
        }
    }
})