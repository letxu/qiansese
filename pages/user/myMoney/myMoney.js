// pages/query/query.js
const app = getApp();
Page({
  data: {
    sortindex: 0, //排序索引
    height: "",
    sort: [{
        id: 1,
        title: "全部"
      },
      {
        id: 2,
        title: "正在审核"

      },
      {
        id: 3,
        title: "审核成功"
      },
      {
        id: 4,
        title: "审核失败"
      }
    ],
    data: null,
    tabId: 1,
    page: 1,
    tabIndex: 0,
    footerTab: [{
        id: 1,
        pic: '/images/home_icon.png'
      },
      {
        id: 2,
        pic: '/images/user_icon.png'
      }
    ],
  },
  setSortBy: function(e) { //选择排序方式
    const d = this.data;
    const dataset = e.currentTarget.dataset;
    this.setData({
      sortindex: dataset.sortindex,
    });
  },

  loadData: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.baseUrl + '/User/User_Balance_Log',
      header: {
        'content-type': 'application/json', // 默认值
        "token": app.globalData.token
      },
      data: {
        page: that.data.page
      },
      method: 'GET',
      success: function(res) {
        if (res.data.success) {
          if (res.data.data != null && res.data.data.length > 0) {
            var tempData = that.data.data;
            if (tempData == null || that.data.page == 1) {
              that.setData({
                data: res.data.data
              })
            } else {
              Array.prototype.push.apply(tempData, res.data.data);
              that.setData({
                data: tempData
              })
            }
          } else {
            that.setData({
              page: that.data.page - 1
            });
            setTimeout(() => {
              wx.showToast({
                title: "这里空空如也，快点来霸占我",
                icon: 'none'
              })
              setTimeout(() => {
                wx.hideToast();
              }, 3000)
            }, 0);
          }
        } else {
          if (res.data.needLogin) {
            wx.navigateTo({
              url: '../login/login'
            })
          } else {
            setTimeout(() => {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
              setTimeout(() => {
                wx.hideToast();
              }, 3000)
            }, 0);
          }
        }
      },
      complete: function() {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  // 底部
  Navigation: function(e) {
    let id = e.currentTarget.dataset.id,
      index = parseInt(e.currentTarget.dataset.index)
    this.curIndex = parseInt(e.currentTarget.dataset.index)
    console.log(e.currentTarget.dataset)
    var that = this;
    if (e.currentTarget.dataset.id == 1) {
      wx.reLaunch({
        url: '../../index/index'
      })
    } else if (e.currentTarget.dataset.id == 2) {
      wx.reLaunch({
        url: '../../user/user'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.dialog = this.selectComponent("#dialog");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var height = res.windowHeight / 2;
        if (res.windowHeight > 600) {
          height = res.windowHeight / 2.5;
        }
        if (res.windowHeight > 650) {
          height = res.windowHeight / 3;
        }
        if (res.windowHeight > 700) {
          height = res.windowHeight / 5;
        }
        that.setData({
          height: height
        })
      },
    })
    that.loadData();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  showDialog: function() {
    this.setData({
      hasMask: true
    })
    this.dialog.showDialog();
  },
  //关闭事件
  _confirmEvent() {
    this.setData({
      hasMask: false
    })
    this.dialog.hideDialog();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this
    that.setData({
      page: 1
    })
    that.loadData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    console.log(that.data.page)
    that.setData({
      page: that.data.page + 1
    })
    that.loadData();
  },
  onShareAppMessage: function (res) {
    return {
      title: '千色色沙拉会员+',
      imageUrl: '/images/share.jpg',
      path: '/pages/index/index'
    }
  },
})