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
        positionT: '请选择位置',
        imageArray: [],
        isOpenLocation: false
    },
    onLoad: function(options) {
        wx.setStorage({
            key: 'isUpdateField',
            data: false,
        })
        this.getHotFieldList();
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
                    this.setData({
                        isOpenLocation: true,
                        positionT: '未授权位置，点击授权'
                    })
                }
            }
        })
    },
    onShow: function() {
        if (wx.getStorageSync('isUpdateField') == true) {
            wx.setStorage({
                key: 'isUpdateField',
                data: false,
            })
            this.getHotFieldList()
        }
    },
    //获取发布位置
    bindPickerChange: function(e) {
        this.setData({
            index: e.detail.value
        })
    },
    // 打开授权回调函数
    openSettingFunc: function(res) {
        if (res.detail.authSetting['scope.userLocation'] == true) {
            this.setData({
                isOpenLocation: false,
                positionT: '请选择位置'
            });
            this.getMap();
        }
    },
    //获取地址经纬度
    getMap: function(e) {
        wx.chooseLocation({
            success: res => {
                this.setData({
                    longt: res.longitude,
                    lat: res.latitude,
                    positionT: res.address
                });
            },
            fail: res => {
                if (res.errMsg == 'chooseLocation:fail auth deny') {
                    this.setData({
                        isOpenLocation: true,
                        positionT: '未授权位置，点击授权'
                    });
                }
            }
        })
    },
    //获取输入的内容
    sayContent: function(e) {
        this.setData({
            sayContent: e.detail.value || ''
        });
    },

    //上传图片
    getChooseImg: function() {
        let ths = this;
        wx.chooseImage({
            count: 3,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                wx.showToast({
                    title: '正在上传...',
                    icon: 'loading',
                    mask: true,
                    duration: 10000
                })
                let tempFilePaths = res.tempFilePaths;
                for (let i = 0; i < tempFilePaths.length; i++) {
                    wx.uploadFile({
                        url: util.BASEURL + 'attachment/uploadImage',
                        filePath: tempFilePaths[i],
                        name: 'file',
                        method: 'POST',
                        formData: {
                            'token': wx.getStorageSync('token')
                        },
                        header: {
                            "Content-Type": "multipart/form-data"
                        },
                        success: function(res) {
                            wx.hideToast();
                            if (res.statusCode == 413) {
                                wx.showModal({
                                    title: '提示',
                                    content: '上传图片过大',
                                    showCancel: false
                                })
                                return false;
                            }
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
                        fail: function(res) {
                            wx.hideToast();
                            wx.showModal({
                                title: '错误提示',
                                content: '上传图片失败',
                                showCancel: false
                            });
                        }
                    })
                }
            }
        })
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
    // 获取关注的领域
    getHotFieldList: function() {
        let param = {};
        param.url = "we_user_category/index";
        param.data = {};
        param.data.token = wx.getStorageSync('token');
        param.data.flag = 1;
        util.requests(param, res => {
            let list = [],
                listID = [],
                res_data = res.data.data;
            for (let i = 0; i < res_data.length; i++) {
                list.push(res_data[i].name);
                listID.push(res_data[i].id);
            }
            if (wx.getStorageSync('isUpdateField') == true) {
                this.setData({
                    array: [],
                    arrayID: [],
                    index: 0,
                })
            }
            this.setData({
                array: list,
                arrayID: listID,
            })
            wx.setStorage({
                key: 'isUpdateField',
                data: false,
            })
        });
    },
    delImage: function (e) {
        let eidx = e.target.dataset.idx,
            list_id = this.data.listid,
            list_path = this.data.listpath;
        list_id.remove(eidx);
        list_path.remove(eidx);
        this.setData({
            listid: list_id,
            listpath: list_path
        });
    },
    //发送
    SendTopic: function() {
        let content = this.data.sayContent || '';
        if (content == '') {
            wx.showToast({
                title: '请输入话题内容',
                icon: "none"
            })
            return false;
        }
        let param = {},
            location = '';
        if (this.data.longt != undefined && this.data.longt != '') {
            location = this.data.positionT;
        }
        param.url = "we_topic/addTopic";
        param.data = {};
        param.data.token = wx.getStorageSync('token');
        param.data.content = content;
        param.data.longt = this.data.longt;
        param.data.lat = this.data.lat;
        param.data.location = location;
        param.data.category_id = this.data.arrayID[this.data.index];
        if (this.data.listid != '') {
            param.data.photos = this.data.listid.toString();
        }
        param.closeLoad = true;
        util.requests(param, res => {
            wx.hideLoading();
            util.setStorageAll();
            wx.showModal({
                title: '提示',
                content: "操作成功",
                showCancel: false,
                success: res => {
                    wx.navigateTo({
                        url: '/pages/field-list/index?cid=' + this.data.arrayID[this.data.index] + '&focus=1' + '&tit=' + this.data.array[this.data.index]
                    })
                    this.setData({
                        sayContent: '',
                        listid: [],
                        listpath: [],
                        positionT: '请选择位置'
                    });
                }
            })
        });
    }
})