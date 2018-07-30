//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        TimeCk: true,
        TimeTF: false,
        SortTF: false,
        startDate: '2016-09-01',
        endDate: '2016-09-01',
        clss: 'icon-paixu',
        sortText: '时间顺序',
        sortList: [{
            'idx': 0,
            'clss': 'icon-paixu',
            'text': '时间顺序'
        }, {
            'idx': 1,
            'clss': 'icon-shengxu',
            'text': '时间倒序'
        }, {
            'idx': 2,
            'clss': 'icon-remen',
            'text': '最热门'
        }]
    },
    //跳转详情页面
    ToDetail: function (e) {
        let itemid = e.currentTarget.dataset.itemId;
        wx.navigateTo({
            url: '../treeDetail/index?id=' + itemid
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
    ChangeTimeTF: function () {
        this.setData({
            TimeTF: !this.data.TimeTF
        })
    },
    ChangeSortTF: function (e) {
        let clsss = e.currentTarget.dataset.clss || '',
            sortTexts = e.currentTarget.dataset.text || '';
        if (clsss == '') {

            this.setData({
                SortTF: !this.data.SortTF
            })
        } else {

            this.setData({
                clss: clsss,
                sortText: sortTexts,
                SortTF: !this.data.SortTF
            })
        }
    }
})