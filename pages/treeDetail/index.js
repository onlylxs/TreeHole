//index.js
//获取应用实例
const app = getApp()

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
        page: 1,
    },
    //跳转详情页面
    ToDetail: function(e) {
        let itemid = e.currentTarget.dataset.tpid;
        wx.navigateTo({
            url: '../treeDetail/index?id=' + tpid
        })
    },
    ChangeSortTF: function(e) {
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