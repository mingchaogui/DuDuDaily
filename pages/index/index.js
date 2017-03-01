//index.js
var config = require('../../config.js')
//获取应用实例
var app = getApp()
Page({

  data: {
    dataList: [],
  },

  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    }),
      this.getStories()
  },

  onShareAppMessage: function () {
    return {
      title: '知乎日报',
      path: '/page/index'
    }
  },

  onPullDownRefresh: function () {
    this.getStories()
  },

  onReachBottom: function () {
    if (this.data.dataList.length > 0) this.loadBeforeStories()
  },

  getStories: function () {
    var that = this
    var dataList = this.data.dataList
    wx.request({
      url: config.API_HOST + 'news/latest',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        var lastDate = dataList.length === 0 ? 0 : dataList[0].date
        if (res.data.date === lastDate) {
          dataList[0] = res.data
        } else if (res.data.date > lastDate) {
          dataList.unshift(res.data)
        }
        that.setData({
          dataList: dataList,
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        wx.stopPullDownRefresh()
      }
    })
  },

  loadBeforeStories: function () {
    var that = this
    var dataList = this.data.dataList
    wx.request({
      url: config.API_HOST + 'news/before/' + dataList[dataList.length - 1].date,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        var firstDate = dataList.length === 0 ? 0 : dataList[dataList.length - 1].date
        if (firstDate > res.data.date) {
          dataList.push(res.data)
        }
        that.setData({
          dataList: dataList,
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {

      }
    })
  }
})
