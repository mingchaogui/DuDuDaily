//index.js
var config = require('../../config.js')
//获取应用实例
var app = getApp()
Page({

    data: {
        id: 0,
        longComments: [],
        shortComments: [],
    },

    onLoad: function (options) {
        this.setData({
            id: options.id
        })

        this.getLongComments()
        this.getShortComments()
    },

    onShareAppMessage: function () {
        return {
            title: '知乎日报 - 评论',
            path: '/page/comment?id=' + this.data.id
        }
    },

    getLongComments: function () {
        var that = this
        wx.request({
            url: config.API_HOST + 'story/' + that.data.id + "/long-comments",
            data: {},
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {
                var comments = res.data.comments
                for (var i = 0; i < comments.length; i++) {
                    comments[i]['time'] = that.formatTimeMills(comments[i].time)
                }
                // success
                that.setData({
                    longComments: comments
                })
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })
    },

    getShortComments: function () {
        var that = this
        wx.request({
            url: config.API_HOST + 'story/' + that.data.id + "/short-comments",
            data: {},
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {
                var comments = res.data.comments
                for (var i = 0; i < comments.length; i++) {
                    comments[i]['time'] = that.formatTimeMills(comments[i].time)
                }
                // success
                that.setData({
                    shortComments: comments
                })
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })
    },

    formatTimeMills: function (timeMills) {
        var date = new Date(parseInt(timeMills) * 1000)
        return date.Format("MM-dd hh:mm")
    }
})