// pages/saysome/index.js
const app = getApp();
import util from '../../utils/util.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        index: 0,
        array: [],
        arrayID: [],
        listid: [],
        listpath: [],
        positionT: '请选择位置'
    },
    onLoad: function (options) {
        this.getHotFieldList()
    },
    //获取发布位置
    bindPickerChange: function (e) {
        this.setData({
            index: e.detail.value
        })
    },
    //获取地址经纬度
    getMap: function (e) {
        wx.chooseLocation({
            success: res => {
                this.setData({
                    longt: res.longitude,
                    lat: res.latitude,
                    positionT: res.address
                });
            }
        })
    },
    //获取输入的内容
    sayContent: function (e) {
        this.setData({
            sayContent: e.detail.value || ''
        });
    },
    //上传图片
    getChooseImg: function () {
        let ths = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                wx.showToast({
                    title: '正在上传...',
                    icon: 'loading',
                    mask: true,
                    duration: 10000
                })
                let tempFilePaths = res.tempFilePaths;
                wx.uploadFile({
                    url: util.BASEURL + 'attachment/uploadImage',
                    filePath: tempFilePaths[0],
                    name: 'file',
                    method: 'POST',
                    formData: {
                        'token': wx.getStorageSync('token')
                    },
                    header: {
                        "Content-Type": "multipart/form-data"
                    },
                    success: function (res) {
                        wx.hideToast();
                        let rdata = JSON.parse(res.data),
                            list_id = ths.data.listid,
                            list_path = ths.data.listpath;
                        list_id.push(rdata.data.id);
                        list_path.push(rdata.data.path);
                        ths.setData({
                            listid: list_id,
                            listpath: list_path
                        });
                    },
                    fail: function (res) {
                        wx.hideToast();
                        wx.showModal({
                            title: '错误提示',
                            content: '上传图片失败',
                            showCancel: false
                        });
                    }
                })
            }
        })
    },
    // 获取热门领域
    getHotFieldList: function () {
        let param = {};
        param.url = "we_category/index";
        param.data = {};
        param.data.token = wx.getStorageSync('token');
        util.requests(param, res => {
            let list = [],
                listID = [];
            for (let i = 0; i < res.data.data.data.length; i++) {
                list.push(res.data.data.data[i].name);
                listID.push(res.data.data.data[i].id);
            }
            this.setData({
                array: list,
                arrayID: listID
            })
        });
    },
    //发送
    SendTopic: function () {
        let content=this.data.sayContent || '';
        if (content == ''){
            wx.showToast({
                title: '请输入话题内容',
                icon:"none"
            })
            return false;
        }
        let param = {};
        param.url = "we_topic/addTopic";
        param.data = {};
        param.data.token = wx.getStorageSync('token');
        param.data.content = content;
        param.data.longt = this.data.longt;
        param.data.lat = this.data.lat;
        param.data.category_id = this.data.arrayID[this.data.index];
        if (this.data.listid != '') {
            param.data.photos = this.data.listid.toString();
        }
        param.closeLoad = true;
        util.requests(param, res => {
            wx.hideLoading();
            wx.showModal({
                title: '提示',
                content: "操作成功"
            })
            this.setData({
                content:'',
                array: [],
                arrayID: [],
                positionT: '请选择位置'
            })
        });
    }
})