const BASEURL = "https://xiao.xinyuanhudong.com/index.php/api/";

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

const formatTimeText = (times) => {
    let _year = times.substr(0, 4),
        _month = times.substr(5, 2),
        _day = times.substr(8, 2);
    return _year + "年" + _month + "月" + _day + "日";
}
const setStorageAll = () =>{
    wx.setStorage({
        key: 'IsUpdate',
        data: true,
    })
    wx.setStorage({
        key: 'IsUpdateMsg',
        data: true,
    })
    wx.setStorage({
        key: 'IsUpdateUser',
        data: true,
    })
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
    formatTimeText: formatTimeText,
    setStorageAll: setStorageAll,
    BASEURL: BASEURL,
    requests: requests
}