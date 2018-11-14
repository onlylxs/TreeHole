//index.js
//获取应用实例
const app = getApp();
import util from '../../utils/util.js';

Page({
    data: {},
    ReturnFunc() {
        wx.navigateBack();
    },
    onLoad(t) {
        this.setData({
            id: t.id,
            reptype: t.reptype
        });
        if (t.reptype == "huati") {
            this.topicDetail(t.id);
        } else if (t.reptype == "huifu") {
            let det = {};
            det.content = t.content;
            det.create_time = t.create_time;
            this.setData({
                detail: det
            });
        }
    },
    //话题详情
    topicDetail: function(id) {
        let param = {};
        param.url = "we_topic_detail/topicDetail";
        param.data = {};
        param.data.token = wx.getStorageSync('token');
        param.data.id = id;
        param.data.page = 1;
        param.data.order = 3;
        param.closeLoad = true;
        util.requests(param, res => {
            this.setData({
                detail: res.data.data
            })
        });
    },
    getTextVal(e) {
        this.setData({
            textval: e.detail.value
        });
    },
    //提交举报
    ConfirmFunc: function(e) {
        let param = {},
            ths = this.data;
        if (ths.reptype == 'huati') {
            param.url = "we_topic/report";
        } else if (ths.reptype == 'huifu') {
            param.url = "we_topic_detail/detailReport";
        }
        param.data = {};
        param.data.token = wx.getStorageSync('token');
        param.data.value = ths.id;
        param.data.comment = ths.textval;
        param.closeLoad = true;
        util.requests(param, res => {
            console.info(res);
        });
    },
})