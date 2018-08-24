//index.js
//获取应用实例
const app = getApp();
import util from '../../utils/util.js';

Page({
    data: {
        wx_show: true
    },
    // 生命周期函数--监听页面加载
    onLoad: function(options) {
       
        this.setData({
            weburl: options.weburl
        });
    }
})