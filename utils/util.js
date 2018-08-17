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

// 获取筛选时间
const GetFilterDate = (ttypes, param) => {
    let year = new Date().getFullYear(),
        month = new Date().getMonth(),
        day = new Date().getDate(),
        sindex = (month + 2) - 3, //月开始时间
        dayIndex = day - 1, //日下标
        monthIndex = 0, //月下标
        yearIndex = 1; //年下标

    let monthArr = MonthFormat(sindex, month + 1);
    monthIndex = monthArr.length - 1;
    if (ttypes == 'start') {
        dayIndex = day - 8;
        if (day <= 7) { //如果当天日期小于一周（7天）
            let mm = month - 1;
            dayIndex = day - 8;
            if (mm == 1) {
                day = 28;
            } else {
                day = mm % 2 == 0 ? 30 : 31;
            }
            dayIndex = dayIndex < 0 ? (day + dayIndex) : dayIndex;
            monthIndex--;
        }
    }

    let date = {
        year: [year - 1, year, year + 1, ],
        yearIndex: yearIndex,
        month: monthArr,
        monthIndex: monthIndex,
        day: DayFormat(day),
        dayIndex: dayIndex
    }
    return date;
}

// 格式化月份
const MonthFormat = (sindex, eindex) => {
    var arr = [];
    for (var i = sindex; i <= eindex; i++) {
        arr.push(i);
    }
    return arr;
}

// 格式化日
const DayFormat = date => {
    var arr = [];
    for (var i = 1; i <= date; i++) {
        arr.push(i);
    }
    return arr;
}
// 切换时间
const ChangeTimes = param => {
    let timesArr = param.date;
    timesArr[param.type] = param.index;
    if (param.type == "monthIndex") {
        let monthText = param.monthText,
            day = 1;
        if (monthText == 2) {
            day = 28;
        } else {
            day = monthText % 2 == 0 ? 31 : 30;
        }
        let dayArr = DayFormat(day);
        timesArr.day = dayArr;
        if (monthText == (new Date().getMonth() + 1)) { //等于当前月
            day = new Date().getDate();
            dayArr = DayFormat(day);
            timesArr.day = dayArr;
            timesArr.dayIndex = dayArr.length - 1;
        }
    }
    return timesArr;
}

// 获取时间戳
const GetDateParse = (types, date) => {
    let year = date.year[date.yearIndex],
        month = date.month[date.monthIndex],
        day = date.day[date.dayIndex],
        unitedate = '';
    if (types == 'start') {
        unitedate = year + "/" + month + "/" + day + " 00:00:00";
    } else {
        unitedate = year + "/" + month + "/" + day + " 23:59:59";
    }
    return Date.parse(unitedate) / 1000;
}


// 那些页面需要刷新
const setStorageAll = () => {
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
                        content: res.data.msg || '程序异常，稍后再试。'
                    })
                    break;
            }
        },
        fail(res) {
            wx.hideLoading();
            wx.showModal({
                title: '提示',
                content: '获取数据失败，请稍后再试！'
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
    GetFilterDate: GetFilterDate,
    setStorageAll: setStorageAll,
    ChangeTimes: ChangeTimes,
    GetDateParse: GetDateParse,
    BASEURL: BASEURL,
    requests: requests
}