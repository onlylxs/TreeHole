//index.js
//获取应用实例
const app = getApp();
import util from '../../utils/util.js';

Page({
    data: {
        realm: util.REALM,
        TimeCk: true,
        TimeTF: false,
        SortTF: false,
        startDate: util.GetFilterDate('start'),
        endDate: util.GetFilterDate('end'),
        clss: 'icon-paixu',
        sortText: '时间倒序',
        page: 1,
        sortList: [{
            'idx': 0,
            'clss': 'icon-zhifeiji',
            'text': '最新回复'
        }, {
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
        hots: [], //最热门
        todays: [], //今日话题
        topicList: [], //话题列表
        sortIdx: 1, //排序编号
        wx_show: false,
        loadmore: true,
        lastY: 0, //滑动开始y轴位置
        isShowAdver: true,
    },
    // 生命周期函数--监听页面加载
    onLoad: function(options) {
        wx.showLoading({
            title: '加载中',
        });
        this.setData({
            QueryAll: true,
        })
        wx.setStorage({
            key: 'IsUpdate',
            data: false,
        });
        this.getTopicList();
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
            TimeTF: !this.data.TimeTF,
            SortTF: false
        });
    },
    // 确定切换时间
    ChangeTimeFunc: function() {
        this.setData({
            TimeTF: !this.data.TimeTF,
            page: 1,
            is_onPullDown: true,
            loadmore: true,
            QueryAll: false,
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
            this.theHot("we_topic/theHot");
        } else if (sortIdx == 0) {
            this.theHot("we_topic/theReply");
        } else {
            this.getTopicList();
        }
    },
    // 查看全部
    QueryAllTap: function() {
        this.setData({
            page: 1,
            is_onPullDown: true,
            loadmore: true,
            QueryAll: true,
            SortTF: false,
            TimeTF: false
        });
        this.getTopicList();
    },
    //获取话题列表
    getTopicList: function() {
        let param = {},
            startData = '';
        if (!this.data.QueryAll) {
            startData = util.GetDateParse('start', this.data.startDate)
        }
        param.url = "we_topic/index";
        param.data = {};
        param.data.order = this.data.sortIdx;
        param.data.token = wx.getStorageSync('token');
        param.data.start_time = startData;
        param.data.end_time = util.GetDateParse('end', this.data.endDate);
        param.data.page = this.data.page;
        param.closeLoad = true;
        util.requests(param, res => {
            let result = res.data.data;
            if (this.data.is_onPullDown) {
                this.setData({
                    topicList: [],
                    IsAdvertClose: []
                });
            }
            let topic_list = result.topic_list,
                list = this.data.topicList,
                today_list = [],
                hots_list = [],
                advert_list = this.data.advert || [],
                advert_fiexd = '',
                IsAdvertClose = this.data.IsAdvertClose || [],
                per_page = topic_list.per_page;
            if (IsAdvertClose == '') {
                for (var i = 0; i < topic_list.total; i++) {
                    if (i % per_page == 0) {
                        var obj = {}
                        obj.idx = i;
                        obj.checkShow = true;
                        IsAdvertClose.push(obj)
                    }
                }
            }

            today_list.push(result.today);
            hots_list.push(result.hot);
            list = list.concat(topic_list.data);
            for (var key in result.ads) {
                if (key != 'top_ad') {
                    advert_list.push(result.ads[key]);
                } else {
                    advert_fiexd = result.ads[key];
                }
            }
            this.setData({
                todays: today_list,
                hots: hots_list,
                topicList: list,
                last_page: topic_list.last_page,
                wx_show: true,
                advert: advert_list,
                advert_fiexd: advert_fiexd,
                per_page: per_page,
                IsAdvertClose: IsAdvertClose,
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
    theHot: function (url,category_id) {
        let param = {};
        param.url = url;
        param.data = {};
        param.data.token = wx.getStorageSync('token');
        if (this.data.sortIdx == 0){
            param.data.category_id = category_id;
        }else{
            param.data.order = this.data.sortIdx;
        }
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
            this.theHot("we_topic/theHot");
        } else if (this.data.sortIdx == 0) {
            this.theHot("we_topic/theReply");
        } else {
            this.getTopicList();
        }
    },
    // 到达底部加载更多
    onReachBottom: function() {
        if (!this.data.loadmore) return;
        if (this.data.last_page >= this.data.page) {
            if (this.data.sortIdx == 3) {
                this.theHot("we_topic/theHot");
            } else if (this.data.sortIdx == 0) {
                this.theHot("we_topic/theReply");
            } else {
                this.getTopicList();
            }
        }
    },
    handletouchmove: function(event) {
        var currentY = event.touches[0].pageY
        var ty = currentY - this.data.lastY
        if (ty < 10 || ty > 10) {
            this.setData({
                SortTF: false,
                TimeTF: false
            });
        }
        //将当前坐标进行保存以进行下一次计算
        this.data.lastY = currentY
    },
    // 打开网页
    openWebView: function(e) {
        let weburl = e.currentTarget.dataset.weburl;
        wx.navigateTo({
            url: '/pages/web-view/index?weburl=' + weburl
        })
    },
    // 关闭广告
    CloseAdver: function() {
        this.setData({
            isShowAdver: false,
        });
    },
    CloseAdverAcross: function(e) {
        let idx = e.currentTarget.dataset.index,
            IsAdvertClose = this.data.IsAdvertClose;
        for (var i = 0; i < IsAdvertClose.length; i++) {
            if (IsAdvertClose[i].idx == idx) {
                IsAdvertClose[i].checkShow = false;
            }
        }
        this.setData({
            IsAdvertClose: IsAdvertClose
        })
    },
    //举报
    reportFunc(e) {
        wx.navigateTo({
            url: '/pages/report/index?reptype=huati&id=' + e.currentTarget.dataset.id
        })
    }
})