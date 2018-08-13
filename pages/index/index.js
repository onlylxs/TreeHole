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
        hots: [], //最热门
        todays: [], //今日话题
        topicList: [], //话题列表
        sortIdx: 1, //排序编号
        wx_show: false,
        loadmore: true,
    },
    // 生命周期函数--监听页面加载
    onShow: function(options) {
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
        if (wx.getStorageSync('token') == '') {
            app.checkLogin(res => {
                this.getTopicList();
            }, res => {
                this.getTopicList();
            });
        } else {
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
        this.setData({
            startDate: e.detail.value
        })
    },
    // 获取结束时间
    endDateFunc: function(e) {
        this.setData({
            endDate: e.detail.value
        })
    },
    // 按时间查看显示隐藏
    ChangeTimeTF: function() {
        this.setData({
            TimeTF: !this.data.TimeTF
        });
    },
    ChangeTimeFunc: function() {
        this.setData({
            TimeTF: !this.data.TimeTF,
            page: 1,
            topicList: [],
            loadmore: true
        });
        this.getTopicList();
    },
    // 排序显示隐藏
    ChangeSortTF: function(e) {
        this.setData({
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
            topicList: [],
            loadmore: true
        })
        this.getTopicList();
    },
    //获取话题列表
    getTopicList: function() {
        let param = {};
        param.url = "we_topic/index";
        param.data = {};
        param.data.order = this.data.sortIdx;
        param.data.token = wx.getStorageSync('token');
        param.data.start_time = Date.parse(this.data.startDate);
        param.data.end_time = Date.parse(this.data.endDate);
        param.data.page = this.data.page;
        param.closeLoad = true;
        util.requests(param, res => {
            let topic_list = res.data.data.topic_list,
                list = this.data.topicList,
                today_list = [],
                hots_list = [];
            today_list.push(res.data.data.today);
            hots_list.push(res.data.data.hot);
            for (let i = 0; i < topic_list.data.length; i++) {
                list.push(topic_list.data[i]);
            }
            this.setData({
                todays: today_list,
                hots: hots_list,
                topicList: list,
                last_page: topic_list.last_page,
                advert: res.data.data.ads,
                wx_show: true
            });
            if (topic_list.last_page <= this.data.page) {
                this.setData({
                    loadmore: false
                });
            }
            console.info(this.data.topicList)
            this.data.page++;
        });
    },
    // 到达底部加载更多
    lower: function(e) {
        if (this.data.last_page >= this.data.page) {
            this.getTopicList();
        }
    },
    //话题点赞
    setLikes: function (e) {
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
    openprogram: function (e) {
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

    }
})