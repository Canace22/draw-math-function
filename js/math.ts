interface canvas {
  width: number;
  height: number;
  getContext: Function;
}
// 函数绘制类
function FuncDraw(canvas: canvas) {
  this.canvas = canvas;
  const cw = canvas.width;
  const ch = canvas.height;
  const ctx = canvas.getContext('2d');
  let ticker = [];

  let step = 0.01; // 每一次x的取值增加多少
  let pointsPerMillisecond = 100; // 每一毫秒画几个点

  // 设置帧率
  this.setConfig = (s: number, p: number) => {
    step = s;
    pointsPerMillisecond = p;
  };

  // 清空画布
  this.clear = () => {
    const len: number = ticker.length;
    if (len) {
      for (let i = 0; i < len; i++) {
        clearInterval(ticker[i]);
      }
      ticker = [];
    }
    ctx.clearRect(0, 0, cw, ch);
  };

  // 设置线条颜色
  this.setColor = (stroke: string, fill: string) => {
    ctx.strokeStyle = stroke;
    ctx.fillStyle = fill;
  };

  // (x, y)正常坐标系上的点，(cx, cy)为canvas里的坐标点, ctx为canvas绘图环境
  this.drawLine = (x1: number, y1: number, x2: number, y2: number) => {
    const cx1 = x1 + cw / 2;
    const cx2 = x2 + cw / 2;
    const cy1 = ch / 2 - y1;
    const cy2 = ch / 2 - y2;

    ctx.moveTo(cx1, cy1);
    ctx.lineTo(cx2, cy2);
    ctx.stroke();
  };

  this.drawPoint = (x: number, y: number) => {
    const cx = x + cw / 2;
    const cy = ch / 2 - y;
    ctx.fillRect(cx, cy, 1, 1);
  };

  // 画出x轴和y轴
  this.drawCoords = () => {
    this.drawLine(-cw / 2, 0, cw / 2, 0);
    this.drawLine(0, ch / 2, 0, -ch / 2);
  };

  // 画直角坐标系的函数图像，不带动画
  this.drawFxNow = (f: Function, scalex: number, scaley: number) => {
    for (let x = -cw / 2; x < cw / 2; x += step) {
      this.drawPoint(x, f(x * scalex) * scaley);
    }
  };

  // 画直角坐标系的函数图像，带动画
  this.drawFx = (f: Function, scalex: number, scaley: number) => {
    const dp = this.drawPoint;
    let currentx = -cw / 2;
    const t = setInterval(() => {
      for (let i = 0; i < pointsPerMillisecond; i++) {
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
  this.drawPolarFxNow = (fpolar: Function, scalex: number, scaley: number) => {
    for (let sita = 0; sita < 6 * Math.PI; sita += 0.01) {
      const r = fpolar(sita);
      const x = r * Math.cos(sita);
      const y = r * Math.sin(sita);
      this.drawPoint(x * scalex, y * scaley);
    }
  };

  // 画极坐标系的函数，带动画
  this.drawPolarFx = (fpolar: Function, scalex: number, scaley: number) => {
    const dp = this.drawPoint;
    let currentSita = 0;
    const t = setInterval(() => {
      for (let i = 0; i < pointsPerMillisecond; i++) {
        const r = fpolar(currentSita);
        const x = r * Math.cos(currentSita);
        const y = r * Math.sin(currentSita);
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
