//PPD JS
//packageName: com.kaola
//需要先将商品放入购物车

var packageName = "com.kaola",
sleepTime = 500, //等待毫秒数
shortSleepTime = 100, //短时等待毫秒数
longSleepTime = 1000,
myCenterText = "个人中心",
myFavText = "商品收藏",
myShoppingCartText = "购物车",
//productText = "小黑瓶",
productText = "神仙水",
productText = "苹果",
couponText = "无门槛",
robText = "开抢",
robGoText = "领取",
goOrderBtnText = "结算",
goOrderCheckedBtnText = "结算(", //已选中购物车产品
saveOrderText = "提交订单",
oneDay = 1000*60*60*24,
lazyDelaySec = 10, //持续点击10秒
startTime = {
  hours: [10], 
  Minute:0, 
  second:0
};
stopApp = false;

var init = ()=>{
  //启动app
  app.launch(packageName);
  //等待 这个函数相当于await
  waitForPackage(packageName);
  sleep(sleepTime * 2);

  //找到购物车
  var myShoppingCarts = textContains(myShoppingCartText).find();
  var myShoppingCartBounds;
  if(!myShoppingCarts.empty()){
    console.log("hasCarts", myShoppingCarts.length);
    for(var i=0,l=myShoppingCarts.length;i<l;i++){
      if(myShoppingCarts[i].bounds() && myShoppingCarts[i].bounds().centerY() > 1000){ //在页面以下的购物车按钮
        myShoppingCartBounds = myShoppingCarts[i].bounds();
      }
    }
    if(myShoppingCartBounds){
      press(myShoppingCartBounds.centerX(), myShoppingCartBounds.centerY(), 100);
      sleep(sleepTime);
    }
  }

  //获取最近的抢购时间
  var now = new Date();
  var nextStart = new Date();
  nextStart.setMinutes(startTime.Minute);
  nextStart.setSeconds(startTime.second);
  nextStart.setMilliseconds(0);
  for(var i=0,l=startTime.hours.length;i<l;i++){
    if(nextStart.getHours() != now.getHours()){ //如果已经设置为不同了，则break
      break;
    }

    if(now.getHours() < startTime.hours[i]){
      nextStart.setHours(startTime.hours[i])
    }
  }
  if(nextStart.getHours() == now.getHours()){
    nextStart.setHours(0);
    nextStart = new Date(nextStart.getTime() + oneDay);
  }

  loopCartToOrder(nextStart.getTime(), 500).then((isSuccess)=>{
    if(isSuccess){
      //提交订单
      sleep(longSleepTime);
      //toast([device.width, device.height].join(","))
      press(device.width - 40, device.height - 60, 50);
      return;
    }
  })
  return;
}

var loopCartToOrder = function(startTime, loopTime){
  return new Promise((resolve, reject)=>{
    if(!startTime) {
      resolve(false);
      return;
    }
    loopTime = loopTime || 10;
    this.count = this.count || 0;

    var loopSiwpe = ()=>{
      console.log("loopCartToOrder", this.count++);
      var now = new Date();
      if(now.getTime() > (startTime + (lazyDelaySec * 1000))){
        resolve(false);
        return;
      }
      //模拟滑动
      //RootAutomator需要有root权限
      // var ra = new RootAutomator();
      // events.on('exit', function(){
      //   ra.exit();
      // });
      // ra.swipe(100, 100, 100, 400, 300);
      var swipeSuccess = swipe(100, 400, 100, 1200, 300);
      sleep(loopTime);
      //找到结算按钮
      var goOrderBtn = textContains(goOrderBtnText).exists()
      var goOrderCheckedBtn = textContains(goOrderCheckedBtnText).exists()
      if(goOrderBtn && goOrderCheckedBtn){ //已经选中购物车产品，可以直接点击下单
        var goOrderBtnBounds = textContains(goOrderBtnText).findOne().bounds();
        press(goOrderBtnBounds.centerX(), goOrderBtnBounds.centerY(), 1);
        resolve(true);
        return;
      }else if(goOrderBtn){ //在购物车但是没有选中产品，持续刷新
        loopSiwpe();
      }
    }
    loopSiwpe();
  })
}

setTimeout(init, sleepTime);