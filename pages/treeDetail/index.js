const app = getApp()
import util from '../../utils/util.js';

Page({
    data: {
        height: '',
        TimeCk: false,
        SortTF: false,
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
        page: 1, //分页
        sortIdx: 1, //排序编号
        d_content: '',
        comm_detailList: [],
        wx_show: false,
        loadmore: true,
        comm_content: '',
    },
    // 生命周期函数--监听页面加载
    onLoad: function(options) {
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    height: res.windowHeight - 90
                })
            }
        });
        this.setData({
            tid: options.tid
        });
        wx.showLoading({
            title: '加载中',
        })
        this.topicDetail();
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
            is_onPullDown: true,
            loadmore: true
        })
        this.topicDetail();
    },
    //话题详情
    topicDetail: function() {
        let param = {};
        param.url = "we_topic_detail/topicDetail";
        param.data = {};
        param.data.token = wx.getStorageSync('token');
        param.data.id = this.data.tid;
        param.data.page = this.data.page;
        param.data.order = this.data.sortIdx;
        param.closeLoad = true;
        util.requests(param, res => {
            if (this.data.is_onPullDown) {
                this.setData({
                    comm_detailList: []
                });
            }
            let cdetail = res.data.data.detail,
                list = this.data.comm_detailList;
            if (cdetail != '') {
                list = list.concat(cdetail.data);
            }
            this.setData({
                d_content: res.data.data,
                comm_detailList: list,
                last_page: cdetail.last_page || 0,
                is_onPullDown: false,
                wx_show: true
            });
            if (this.data.last_page <= this.data.page) {
                this.setData({
                    loadmore: false
                });
            }
            this.data.page++;
        });
    },
    // 图片预览
    imgYu: function(event) {
        var src = event.currentTarget.dataset.src; //获取data-src
        var imgList = event.currentTarget.dataset.list; //获取data-list
        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: imgList // 需要预览的图片http链接列表
        })
    },
    //获取评论内容
    comment_content: function(e) {
        this.setData({
            comm_content: e.detail.value
        });
    },
    //发送评论
    SendComment: function() {
        wx.showLoading({
            title: '加载中',
        })
        let param = {};
        param.url = "we_topic_detail/addDetail";
        param.data = {};
        param.data.token = wx.getStorageSync('token');
        param.data.topic_id = this.data.tid;
        param.data.content = this.data.comm_content;
        util.requests(param, res => {
            wx.hideLoading();
            wx.showToast({
                title: res.data.msg,
                icon: 'none',
            });
            let list = this.data.comm_detailList,
                commObj = {},
                rdata = res.data.data;
            commObj.id = rdata.id;
            commObj.content = rdata.content;
            commObj.likes = 0;
            commObj.is_liked = 0;
            commObj.create_time = util.formatTime(new Date(), true);
            list.splice(0, 0, commObj);
            this.setData({
                comm_detailList: list,
                comm_content: ''
            });
        });
    },
    //评论点赞
    setLikes: function(e) {
        let tid = e.currentTarget.dataset.tid,
            is_liked = e.currentTarget.dataset.isliked,
            index = e.currentTarget.dataset.index,
            param = {};
        if (is_liked == 0) {
            param.url = "we_detail_likes/vote";
        } else {
            param.url = "we_detail_likes/cancelVote";
        }
        param.data = {};
        param.data.token = wx.getStorageSync('token');
        param.data.detail_id = tid;
        util.requests(param, res => {
            wx.showToast({
                title: res.data.msg,
                icon: 'none',
            });
            let tlist = this.data.comm_detailList;
            for (let i in tlist) { //遍历列表数据
                if (i == parseInt(index)) { //根据下标找到目标
                    if (tlist[i].is_liked == 0) { //如果是没点赞+1
                        tlist[i].is_liked = 1;
                        tlist[i].likes = parseInt(tlist[i].likes) + 1;
                    } else {
                        tlist[i].is_liked = 0;
                        tlist[i].likes = parseInt(tlist[i].likes) - 1;
                    }
                }
            }
            this.setData({
                comm_detailList: tlist,
            });
        });
    },
    //话题点赞
    setLikesHT: function(e) {
        let tid = e.currentTarget.dataset.tid,
            is_liked = e.currentTarget.dataset.isliked,
            index = e.currentTarget.dataset.index,
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
            let dcon = this.data.d_content;
            if (dcon.is_liked == 1) {
                dcon.is_liked = 0;
                dcon.likes--;
            } else {
                dcon.is_liked = 1;
                dcon.likes++;
            }
            this.setData({
                d_content: dcon
            })
            wx.showToast({
                title: res.data.msg,
                icon: 'none',
            });
        });
    },
    // 下拉刷新
    onPullDownRefresh: function() {
        this.setData({
            page: 1,
            loadmore: true,
            is_onPullDown: true
        })
        this.topicDetail();
    },
    // 到达底部加载更多
    onReachBottom: function() {
        if (!this.data.loadmore) return;
        if (this.data.last_page >= this.data.page) {
            this.topicDetail();
        }
    }
})