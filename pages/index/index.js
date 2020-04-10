// pages/index2/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasWidth: 600,
    canvasHeight: 600,
    rotate: 0,
    prizeList: [
      {
        text: '奖品一',
        imgurl: '../../img/koushuidou.png'
      },
      {
        text: '奖品二',
        imgurl: '../../img/maozi.png'
      },
      {
        text: '奖品一一',
        imgurl: '../../img/naiping.png'
      },
      {
        text: '奖品',
        imgurl: '../../img/shuibei.png'
      },
      {
        text: '奖',
        imgurl: '../../img/xiaohuangya.png'
      },
      {
        text: '奖123',
        imgurl: '../../img/yingerche.png'
      },
    ]
  },
  onLoad() {
    let that = this;
    wx.getSystemInfo({
      success(res) {
        //圆边背景色
        that.colorBj = "red"
        //圆边宽度
        that.outsideWidth = 20;
        //小灯个数 建议 lightNum % 2 == 0 && 360 % lightNum == 0
        that.lightNum = 12;
        //小灯半径 必须小于圆边宽度的一半
        that.lightWidth = 4;
        //小灯颜色(一个正常，一个高亮，初始都正常)
        that.lightBgType = ['#fff', '#f5c058'];
        that.lightBg = [];
        for (var i = 0; i < that.lightNum; i++) {
          that.lightBg.push(that.lightBgType[0]);
        }
        //奖品个数
        that.prizeNum = that.data.prizeList.length;
        //扇形颜色
        that.sectorBjOne = "#ffe8b5";
        that.sectorBjTwo = "#ffb933";
        //文字颜色
        that.textColor = "#5c1e08";
        //文字大小及字体
        that.textStyle = "16px Georgia";
        //文字距离圆边的距离
        that.textTop = 14;
        //图片距离圆边的距离
        that.imgTop = 40;
        //图片宽度(建议按图片实际宽高缩放)
        that.imgWidth = 32;
        that.imgHeight = 32;
        //旋转结束值(start函数中已默认配置)
        that.rotateEnd = 0;
        //偏差角（无需更改）
        that.deviation = 0;
        for (var i = 0; i < that.prizeNum;) {
          if (i * 360 / that.prizeNum > 270) {
            that.deviation = i * 360 / that.prizeNum - 270;
            break;
          } else {
            i++;
          }
        }
        //使转盘初始是正直向上的（可注释）
        that.setData({
          rotate: that.data.rotate - that.deviation + 180 / that.prizeNum
        })
        that.canvas();
      }
    })
  },
  canvas() {
    const query = wx.createSelectorQuery();
    query.select('#turntable')
      .fields({ node: true, size: true })
      .exec((res) => {
        var canvas = res[0].node;

        var dpr = wx.getSystemInfoSync().windowWidth / 750;
        canvas.width = this.data.canvasWidth * dpr;
        canvas.height = this.data.canvasHeight * dpr;
        this.canvasWidth = this.data.canvasWidth * dpr;
        this.canvasHeight = this.data.canvasHeight * dpr;

        var canvasContext = canvas.getContext('2d')
        canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        //绘制圆边背景
        canvasContext.beginPath();
        canvasContext.fillStyle = this.colorBj;
        canvasContext.arc(this.canvasWidth / 2, this.canvasHeight / 2, this.canvasWidth / 2, 0, 2 * Math.PI);
        canvasContext.fill();
        canvasContext.closePath();

        //绘制周边小灯
        for (var i = 0; i < this.lightNum; i++) {
          canvasContext.beginPath();
          canvasContext.fillStyle = this.lightBg[i];
          canvasContext.arc(this.canvasWidth / 2 + (this.canvasWidth / 2 - this.outsideWidth / 2) * Math.cos(360 / this.lightNum * i * Math.PI / 180), this.canvasHeight / 2 + (this.canvasHeight / 2 - this.outsideWidth / 2) * Math.sin(360 / this.lightNum * i * Math.PI / 180), this.lightWidth, 0, 2 * Math.PI);
          canvasContext.fill();
          canvasContext.closePath();
        }

        //奖品扇形
        for (var i = 0; i < this.prizeNum; i++) {
          canvasContext.beginPath();

          canvasContext.moveTo(this.canvasWidth / 2, this.canvasHeight / 2);
          canvasContext.lineTo(this.canvasWidth / 2 + (this.canvasWidth / 2 - this.outsideWidth) * Math.cos(360 / this.prizeNum * i * Math.PI / 180), this.canvasHeight / 2 + (this.canvasHeight / 2 - this.outsideWidth) * Math.sin(360 / this.prizeNum * i * Math.PI / 180));

          canvasContext.arc(this.canvasWidth / 2, this.canvasHeight / 2, this.canvasWidth / 2 - this.outsideWidth, 360 / this.prizeNum * Math.PI / 180 * i, 360 / this.prizeNum * Math.PI / 180 * (i + 1));

          canvasContext.moveTo(this.canvasWidth / 2, this.canvasHeight / 2);
          canvasContext.lineTo(this.canvasWidth / 2 + (this.canvasWidth / 2 - this.outsideWidth) * Math.cos(360 / this.prizeNum * (i + 1) * Math.PI / 180), this.canvasHeight / 2 + (this.canvasHeight / 2 - this.outsideWidth) * Math.sin(360 / this.prizeNum * (i + 1) * Math.PI / 180));

          if (i % 2 == 0) {
            canvasContext.fillStyle = this.sectorBjOne;
          } else {
            canvasContext.fillStyle = this.sectorBjTwo;
          }

          canvasContext.fill();
          canvasContext.closePath();
        }
        //绘制文字与图片
        let img = [];
        for (let i = 0; i < this.prizeNum; i++) {
          img[i] = canvas.createImage();
          img[i].src = this.data.prizeList[i].imgurl;
          img[i].onload = () => {
            canvasContext.save();
            canvasContext.beginPath();

            canvasContext.translate(this.canvasWidth / 2, this.canvasHeight / 2);
            canvasContext.rotate((this.deviation - 360 / (this.prizeNum * 2) * (i * 2 + 1)) * Math.PI / 180);
            canvasContext.translate(-this.canvasWidth / 2, -this.canvasHeight / 2);

            canvasContext.fillStyle = this.textColor;
            canvasContext.font = this.textStyle;
            canvasContext.textAlign = 'center';
            canvasContext.textBaseline = 'top';
            canvasContext.fillText(this.data.prizeList[i].text, this.canvasWidth / 2, this.outsideWidth + this.textTop);

            canvasContext.drawImage(img[i], this.canvasWidth / 2 - this.imgWidth / 2, this.outsideWidth + this.imgTop, this.imgWidth, this.imgHeight)
            canvasContext.closePath();
            canvasContext.restore();
          }
        }
      })
  },
  start() {
    //逆时针
    // this.rotateEnd = this.rotateEnd+ -360 * 3 + -this.rand(0, 360);
    // Math.floor
    this.timerApi = setInterval(() => {
      this.setData({
        rotate: this.data.rotate + 40
      })
    }, 100)
    console.log('请求中...')
    setTimeout(() => {
      console.log('请求成功...')
      clearInterval(this.timerApi);
      this.setData({
        rotate: 0
      })
      //请求接口返回获得了哪个奖，现在是下标为1的奖
      var i = 1;
      this.rotateEnd = 360 * 2 + this.rand(360 / this.prizeNum * i + 1, 360 / this.prizeNum * (i + 1) - 1) - this.deviation;
      let speed = Math.ceil(((this.rotateEnd - this.data.rotate) / 20));
      // console.log(this.rotateEnd, speed);
      this.timerInterval = setInterval(() => {
        speed = Math.ceil(((this.rotateEnd - this.data.rotate) / 20));
        // console.log(this.data.rotate, speed)
        if (this.data.rotate + speed >= this.rotateEnd) {
          this.setData({
            rotate: this.rotateEnd % 360
          })
          this.rotateEnd = this.rotateEnd % 360;
          let prize = (Math.floor((Math.abs(this.data.rotate) + this.deviation) / (360 / this.prizeNum)));
          if (prize == this.prizeNum) {
            prize = 0;
          }

          console.log(this.data.prizeList[prize]);

          clearInterval(this.timerInterval);
          // clearTimeout(this.timerTimeout);
        } else {
          this.setData({
            rotate: this.data.rotate + speed
          })
        }
      }, 100)
      //取消重绘（取消效果：周边灯闪烁；原因：小程序性能差，重绘太慢；解决方法：单独为周边灯绘制一个canvas，此处不予解决）
      // this.timerTimeout = setInterval(() => {
      //   this.lightBg = [];
      //   for (var i = 0; i < this.lightNum; i++) {
      //     if (this.rand(0, 9) < 2) {
      //       this.lightBg.push(this.lightBgType[1]);
      //     } else {
      //       this.lightBg.push(this.lightBgType[0]);
      //     }
      //   }
      //   console.log(this.lightBg);
      //   this.canvas();
      // }, 2000)
    }, 1000)
  },
  rand(n, m) {
    var c = m - n + 1;
    return Math.floor(Math.random() * c + n);
  }
})
