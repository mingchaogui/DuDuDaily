//story.js
var config = require('../../config.js')
var util = require('../../utils/util.js')

Page({
  data: {
    id: 0,
    title: "",
    body: [],
    comments: 0,
  },
  onLoad: function (options) {
    // 页面初始化，options为页面跳转所带来的参数
    this.setData({
      id: options.id
    })

    var that = this

    // 请求内容数据
    util.ajax(function (res) {
      var body = res.data.body;
      body = body.match(/<p>.*?<\/p>/g);
      var ss = [];
      for (var i = 0, len = body.length; i < len; i++) {
        ss[i] = /<img.*?>/.test(body[i]);
        if (ss[i]) {
          body[i] = body[i].match(/(http:|https:).*?\.(jpg|jpeg|gif|png)/);
        } else {
          body[i] = body[i].replace(/<p>/g, '')
            .replace(/<\/p>/g, '')
            .replace(/<strong>/g, '')
            .replace(/<\/strong>/g, '')
            .replace(/<a.*?\/a>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&ldquo;/g, '"')
            .replace(/&rdquo;/g, '"')
            .replace(/&middot;/g, '·')
            .replace(/&mdash;/g, '—')
            .replace(/&uarr;/g, '↑')
            .replace(/&hellip;/g, '…')
            .replace(/&bull;/g, '•');
        }
      }

      // 重新写入数据
      that.setData({
        title: res.data.title,
        body: body
      })

      wx.setNavigationBarTitle({
        title: res.data.title,
        success: function (res) {
          // success
        }
      });
    }, config.API_HOST + "news/" + this.data.id);

    this.getStoryExtra()
  },

  onShareAppMessage: function () {
    return {
      title: this.data.title,
      path: '/page/story?id=' + this.data.id
    }
  },

  getStoryExtra: function () {
    var that = this
    wx.request({
      url: config.API_HOST + 'story-extra/' + this.data.id,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        that.setData({
          comments: res.data.comments
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  }
})