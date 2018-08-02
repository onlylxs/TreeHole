//index.js
//获取应用实例
const app = getApp()
import util from '../../utils/util.js';

Page({
    data: {
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
        comm_detail:[],
        wx_show: true
    },
    // 生命周期函数--监听页面加载
    onLoad: function(options) {
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
            topicList: []
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
                list = this.data.comm_detail;
            for (let i = 0; i < cdetail.data.length; i++) {
                list.push(cdetail.data[i]);
            }
            this.setData({
                d_content: res.data.data,
                comm_detail: list,
                wx_show: true
            });
        });
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
        util.requests(param, res => {});
    },
    //话题点赞
    setLikes: function(e) {
        let is_liked = e.currentTarget.dataset.is_liked,
            param = {};
        if (is_liked == 0) {
            param.url = "likes/vote";
        } else {
            param.url = "likes/cancelVote";
        }
        param.data = {};
        param.data.token = wx.getStorageSync('token');
        param.data.topic_id = this.data.tid;
        param.data.user_id = wx.getStorageSync('user_id');
        util.requests(param, res => {
            wx.showToast({
                title: res.data.msg,
                icon: 'none',
            });
            let dContent = this.data.d_content;
            if (dContent.is_liked == 1){
                dContent.is_liked = 0;
                dContent.likes -= 1;
            }else{
                dContent.is_liked = 1;
                dContent.likes += 1;
            }
            this.setData({
                d_content: dContent,
            });
        });
    },
})