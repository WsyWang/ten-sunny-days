// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    location: "loading....",
    scrollHeight: 0,
    weatherArray: [],
    iconImageHeight: 160,
    dayTemperature: "N/A",
    weatherIcon: "/images/icons/100-fill.svg",
    tips: "loading......",
    updateTime: "loading",
  },
  onLoad() {

    //运行计算滚动列表高度函数
    this.calcScrollHeight();

    //页面加载后获取用户的定位信息
    let that = this
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const location_key = "LMZBZ-62PK3-FTR33-RNCRP-SLWW3-H2BDE"
        const weather_key = "bb2404af986c4d70bc97dc3acef8b4fc"
        let district = "default"
        let cityId = "default"

        // 获取详细位置
        wx.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + latitude + ',' + longitude + '&key=' + location_key,
          success(res) {
            district = res.data.result.address_component.district
            that.setData({
              location: res.data.result.address_component.street + ',' + res.data.result.address_component.district
            })
            //获取城市代码
            wx.request({
              url: 'https://geoapi.qweather.com/v2/city/lookup?location=' + district + '&key=' + weather_key,
              success(res) {
                cityId = res.data.location[0].id
                // 获取天气
                wx.request({
                  url: 'https://devapi.qweather.com/v7/weather/7d?location=' + cityId + '&key=' + weather_key,
                  success(res) {
                    let weatherArray = res.data.daily;
                    weatherArray.shift()
                    for (let i = 0; i < weatherArray.length; i ++) {
                      weatherArray[i].weekday = that.getWeekday(weatherArray[i].fxDate);
                      weatherArray[i].iconDay = "/images/icons/" + weatherArray[i].iconDay + "-fill.svg"
                    }
                    that.setData({
                      weatherArray: weatherArray,
                    })
                  }
                })

                //获取实时天气
                wx.request({
                  url: 'https://devapi.qweather.com/v7/weather/now?location=' + cityId + '&key=' + weather_key,
                  success(res) {
                    let regex = /\d{2}:\d{2}/g.exec(res.data.updateTime)
                    let updateTime = regex[0]
                    that.setData({
                      dayTemperature: res.data.now.temp,
                      updateTime: updateTime,
                      weatherIcon: "/images/icons/"+ res.data.now.icon +"-fill.svg"
                    })
                  }
                })

                //获取穿衣指数
                wx.request({
                  url: 'https://devapi.qweather.com/v7/indices/1d?type=3&location=' + cityId + '&key=' + weather_key,
                  success(res) {
                    that.setData({
                      tips: "天气比较" + res.data.daily[0].category
                    })
                  }
                })
              }
            })
          }
        })
      }
    })

  },

  //计算滚动列表高度函数
  calcScrollHeight() {
    let that = this;
    let query = wx.createSelectorQuery().in(this);
    query.select('.top').boundingClientRect((res) => {
      let topHeight = res.height;
      let screenHeight = wx.getSystemInfoSync().windowHeight;
      let scrollHeight = screenHeight - topHeight - 70;
      that.setData({
        scrollHeight: scrollHeight
      })
    }).exec();
  },

  //获取星期函数
  getWeekday(date) {
    let myDate = new Date(date);
    let myDay = myDate.getDay();
    var weekends = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    return weekends[myDay];
  }

})