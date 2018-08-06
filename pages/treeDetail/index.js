//index.js
//获取应用实例
const app = getApp()
import util from '../../utils/util.js';

Page({
    data: {
        height: '',
        TimeCk: false,
        SortTF: false,
        clss: 'icon-paixu',
        sortText: '时间顺序',
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
        page: 1, //分页
        sortIdx: 1, //排序编号
        d_content: '',
        comm_detailList: [],
        wx_show: false,
        loadmore:true,
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
            comm_detailList: [],
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
            let cdetail = res.data.data.detail,
                list = this.data.comm_detailList;
            
            if (cdetail != '') {
                for (let i = 0; i < cdetail.data.length; i++) {
                    list.push(cdetail.data[i]);
                }
            }
            this.setData({
                d_content: res.data.data,
                comm_detailList: list,
                last_page: cdetail.last_page || 0,
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
    // 到达底部加载更多
    lower: function(e) {
        if (this.data.last_page >= this.data.page) {
            this.topicDetail();
        }
    },
    //获取评论内容
    comment_content: function(e) {
        this.setData({
            comm_content: e.detail.value
        });
    },
    //发送评论
    SendComment: function() {
        let param = {};
        param.url = "we_topic_detail/addDetail";
        param.data = {};
        param.data.token = wx.getStorageSync('token');
        param.data.topic_id = this.data.tid;
        param.data.content = this.data.comm_content;
        util.requests(param, res => {
            wx.showToast({
                title: res.data.msg,
                icon: 'none',
            });
            let list = this.data.comm_detailList,
                commObj = {};
            commObj.content = this.data.comm_content;
            commObj.likes = 0;
            commObj.create_time = util.formatTime(new Date(),true);
            list.splice(0, 0, commObj);
            this.setData({
                comm_detailList: list,
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
            param.url = "we_topic_detail/vote";
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
})