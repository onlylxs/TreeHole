const BASEURL = "http://www.413club.cn/index.php/api/";

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    // return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    return [year, month, day].map(formatNumber).join('-');
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
            return success(res);
        },
        fail(res) {
            wx.showModal({
                title: '提示',
                content: '获取数据失败，请稍后再试！',
                success: function(res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }
    })
}

module.exports = {
    formatTime: formatTime,
    BASEURL: BASEURL,
    requests: requests
}