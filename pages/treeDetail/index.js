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
        page: 1,    //分页
        sortIdx: 1, //排序编号
        d_content:''
    },
    // 生命周期函数--监听页面加载
    onLoad: function(options) {
        this.setData({
            tid: options.tid
        })
        this.topicDetail();
    },
    //话题详情
    topicDetail: function() {
        let param = {};
        param.url = "we_topic_detail/topicDetail";
        param.data = {};
        param.data.id = this.data.tid;
        param.data.page = this.data.page;
        param.data.order = this.data.sortIdx;
        util.requests(param, res => {
            this.setData({
                d_content:res.data.data  
            })
        });
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
            topicList: []
        })
        this.topicDetail();
    },
})