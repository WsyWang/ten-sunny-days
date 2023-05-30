// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    location: "loading...."
  },
  onLoad() {
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
                  url: 'https://devapi.qweather.com/v7/weather/3d?location=' + cityId + '&key=' + weather_key,
                  success(res) {
                    console.log(res.data.daily)
                  }
                })
              }
            })
          }
        })
      }
    })

  },
})