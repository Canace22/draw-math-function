// 函数绘制类
function FuncDraw(canvas) {
  var _this = this;
  this.canvas = canvas;
  var cw = canvas.width;
  var ch = canvas.height;
  var ctx = canvas.getContext('2d');
  var ticker = [];
  var step = 0.01; // 每一次x的取值增加多少
  var pointsPerMillisecond = 100; // 每一毫秒画几个点
  // 设置帧率
  this.setConfig = function(s, p) {
    step = s;
    pointsPerMillisecond = p;
  };
  // 清空画布
  this.clear = function() {
    var len = ticker.length;
    if (len) {
      for (var i = 0; i < len; i++) {
        clearInterval(ticker[i]);
      }
      ticker = [];
    }
    ctx.clearRect(0, 0, cw, ch);
  };
  // 设置线条颜色
  this.setColor = function(stroke, fill) {
    ctx.strokeStyle = stroke;
    ctx.fillStyle = fill;
  };
  // (x, y)正常坐标系上的点，(cx, cy)为canvas里的坐标点, ctx为canvas绘图环境
  this.drawLine = function(x1, y1, x2, y2) {
    var cx1 = x1 + cw / 2;
    var cx2 = x2 + cw / 2;
    var cy1 = ch / 2 - y1;
    var cy2 = ch / 2 - y2;
    ctx.moveTo(cx1, cy1);
    ctx.lineTo(cx2, cy2);
    ctx.stroke();
  };
  this.drawPoint = function(x, y) {
    var cx = x + cw / 2;
    var cy = ch / 2 - y;
    ctx.fillRect(cx, cy, 1, 1);
  };
  // 画出x轴和y轴
  this.drawCoords = function() {
    _this.drawLine(-cw / 2, 0, cw / 2, 0);
    _this.drawLine(0, ch / 2, 0, -ch / 2);
  };
  // 画直角坐标系的函数图像，不带动画
  this.drawFxNow = function(f, scalex, scaley) {
    for (var x = -cw / 2; x < cw / 2; x += step) {
      _this.drawPoint(x, f(x * scalex) * scaley);
    }
  };
  // 画直角坐标系的函数图像，带动画
  this.drawFx = function(f, scalex, scaley) {
    var dp = _this.drawPoint;
    var currentx = -cw / 2;
    var t = setInterval(function() {
      for (var i = 0; i < pointsPerMillisecond; i++) {
        dp(currentx, f(currentx * scalex) * scaley);
        currentx += step;
      }
      if (currentx > cw / 2) {
        clearInterval(t);
      }
    }, 1);
    ticker.push(t);
  };
  // 画极坐标系的函数，不带动画
  this.drawPolarFxNow = function(fpolar, scalex, scaley) {
    for (var sita = 0; sita < 6 * Math.PI; sita += 0.01) {
      var r = fpolar(sita);
      var x = r * Math.cos(sita);
      var y = r * Math.sin(sita);
      _this.drawPoint(x * scalex, y * scaley);
    }
  };
  // 画极坐标系的函数，带动画
  this.drawPolarFx = function(fpolar, scalex, scaley) {
    var dp = _this.drawPoint;
    var currentSita = 0;
    var t = setInterval(function() {
      for (var i = 0; i < pointsPerMillisecond; i++) {
        var r = fpolar(currentSita);
        var x = r * Math.cos(currentSita);
        var y = r * Math.sin(currentSita);
        dp(x * scalex, y * scaley);
        currentSita += step;
      }
      if (currentSita > 100 * Math.PI) {
        clearInterval(t);
      }
    }, 1);
    ticker.push(t);
  };
}
// export default FuncDraw;
