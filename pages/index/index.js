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
    windSpeed: "na"
  },
  onLoad() {
  },
})