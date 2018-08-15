const BASEURL = "http://xiao.xinyuanhudong.com/index.php/api/";

const formatTime = (date, hhss) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    if (hhss) {
        return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    } else {
        return [year, month, day].map(formatNumber).join('-');
    }
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const requests = (param, success) => {
    wx.request({
        url: BASEURL + param.url,
        method: 'POST' || param.methods,
        data: param.data,
        header: {
            'content-type': 'application/json'
        },
        success(res) {
            wx.hideLoading();
            switch (res.data.code) {
                case 1:
                    return success(res);
                    break;
                case 0:
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg
                    })
                    break;
                case 10000:
                    // wx.showModal({
                    //     title: '提示',
                    //     content: res.data.msg,
                    //     success: function (res) {
                    //         if (res.confirm) {
                                
                    //         }
                    //     }
                    // })
                    wx.navigateTo({
                        url: "/pages/authorize/index"
                    })
                    break;
                default:
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg
                    })
                    break;
            }
        },
        fail(res) {
            wx.hideLoading();
            wx.showModal({
                title: '提示',
                // content: '获取数据失败，请稍后再试！'
                content: JSON.stringify(res)
            })
        },
        complete() {
            if (param.closeLoad) {
                wx.hideLoading();
            }
        }
    })
}

module.exports = {
    formatTime: formatTime,
    BASEURL: BASEURL,
    requests: requests
}