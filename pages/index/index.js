// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    location: "loading..",
    iconSize: 250,
    weatherIcon: "/images/icons/100.svg",
    weatherTem: "N/A",
    weatherText: "loading",
    maxTem: "N/A",
    minTem: "N/A",
    infoIconSize: 36,
    feelsLike: "na",
    humidity: "na",
    windSpeed: "na",
    hourWeatherArray: []
  },
  onLoad() {
    const locationKey = "LMZBZ-62PK3-FTR33-RNCRP-SLWW3-H2BDE"
    const weatherKey = "bb2404af986c4d70bc97dc3acef8b4fc"
    let district = ""
    let cityCode = ""
    //获取经纬度
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const latitude = res.latitude
        const longitude = res.longitude

        //获取地区
        wx.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + latitude + ',' + longitude + '&key=' + locationKey,
          success: (res) => {
            district = res.data.result.ad_info.district
            this.setData({
              location: district
            })

            //获取城市代码
            wx.request({
              url: 'https://geoapi.qweather.com/v2/city/lookup?location=' + district + '&key=' + weatherKey,
              success: (res) => {
                cityCode = res.data.location[0].id

                //获取实时天气
                wx.request({
                  url: 'https://devapi.qweather.com/v7/weather/now?location=' + cityCode + '&key=' + weatherKey,
                  success: (res) => {
                    let data = res.data.now
                    this.setData({
                      weatherIcon: "/images/icons/" + data.icon + ".svg",
                      weatherTem: data.temp,
                      weatherText: data.text,
                      feelsLike: data.feelsLike,
                      humidity: data.humidity,
                      windSpeed: data.windSpeed
                    })
                  }
                })

                //获取逐小时天气
                wx.request({
                  url: 'https://devapi.qweather.com/v7/weather/24h?location=' + cityCode + '&key=' + weatherKey,
                  success: (res) => {
                    let hourWeatherArray = res.data.hourly;
                    for (let i = 0; i < hourWeatherArray.length; i++) {
                      let regex = /\d{2}:\d{2}/g.exec(res.data.hourly[i].fxTime)
                      let time = regex[0]
                      hourWeatherArray[i].fxTime = time
                    }
                    this.setData({
                      hourWeatherArray: hourWeatherArray
                    })
                  }
                })

                //获取未来天气
                wx.request({
                  url: 'https://devapi.qweather.com/v7/weather/7d?location=' + cityCode + '&key=' + weatherKey,
                  success: (res) => {
                    const max = res.data.daily[0].tempMax
                    const min = res.data.daily[0].tempMin
                    let weatherArray = res.data.daily
                    weatherArray.shift()
                    for (let i = 0; i < weatherArray.length; i++) {
                      weatherArray[i].weekDay = this.getWeekDay(weatherArray[i].fxDate)
                    }
                    this.setData({
                      weatherArray: weatherArray,
                      maxTem: max,
                      minTem: min,
                    })
                    console.log(weatherArray);
                  }
                })

              }
            })
          }
        })

      },
    })
  },

  //获取星期的方法
  getWeekDay(date) {
    let myDate = new Date(date)
    let myDay = myDate.getDay();
    let weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    return weekDays[myDay]
  }

})