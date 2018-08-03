const BASEURL = "http://www.413club.cn/index.php/api/";

const formatTime = (date,hhss) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    if(hhss){
        return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    }else{
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
                default:
                    wx.hideLoading();
                    wx.showModal({
                        title: '提示',
                        content: '程序异常，请稍后再试'
                    })
                    break;
            }
        },
        fail(res) {
            wx.hideLoading();
            wx.showModal({
                title: '提示',
                content: '获取数据失败，请稍后再试！'
            });
        },
        complete(){
            if(param.closeLoad){
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