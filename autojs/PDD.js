//PPD JS
//packageName: com.xunmeng.pinduoduo
//需要先将商品放入收藏

var packageName = "com.xunmeng.pinduoduo",
sleepTime = 500, //等待毫秒数
myCenterText = "个人中心",
myFavText = "商品收藏",
//productText = "小黑瓶",
productText = "神仙水",
productText = "苹果",
couponText = "无门槛",
robText = "开抢",
robGoText = "领取",
oneDay = 1000*60*60*24,
lazyDelaySec = 10, //持续点击10秒
startTime = {
  hours: [15, 17, 18, 21], 
  Minute:0, 
  second:0
};
stopApp = false;

var init = ()=>{
  //启动app
  app.launch(packageName);
  //等待 这个函数相当于await
  waitForPackage(packageName);
  sleep(sleepTime * 3);
  //找到个人中心
  var myCenter = textContains(myCenterText).exists();
  if(myCenter){
    var myCenterBounds =  textContains(myCenterText).findOne().bounds();
    click(myCenterBounds.centerX(), myCenterBounds.centerY());
    sleep(sleepTime);
  }

  //收藏
  var myFav = textContains(myFavText).exists();
  if(myFav){
    var myFavBounds = textContains(myFavText).findOne().bounds();
    click(myFavBounds.centerX(), myFavBounds.centerY());
    sleep(sleepTime);
  }
  
  //找到商品
  var productBtn = textContains(productText).exists()
  if(productBtn){
    var productBounds = textContains(productText).findOne().bounds();
    click(productBounds.centerX(), productBounds.centerY());
    sleep(sleepTime);
  }

  //找到优惠券
  var couponBtn = textContains(couponText).exists()
  if(!couponBtn) return;
  var couponBounds = textContains(couponText).findOne().bounds();
  click(couponBounds.centerX(), couponBounds.centerY());

  //开抢按钮
  sleep(sleepTime);
  var robBtnBounds = null;
  var beforeRob = textContains(robText).exists();
  var startRob = textContains(robGoText).exists();
  if(beforeRob){
    robBtnBounds = textContains(robText).findOne().bounds();
  }else if(startRob){
    robBtnBounds = textContains(robGoText).findOne().bounds();
  }
  
  if(!robBtnBounds) return;
  //click(robBtnBounds.centerX(), robBtnBounds.centerY());
  //alert("clicked Rob")
  
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
  console.log("nextStart", nextStart);

  //监听音量下键 未生效，稍后研究
  // events.observeKey();
  // events.onKeyDown("volume_down", (event) => {
  //   stopApp = true;
  //   toast("脚本终止")
  //   exit();
  // })

  loopRob(robBtnBounds, nextStart.getTime(), 2);
}


var loopRob = (robBtnSender, startTime, loopTime) => {
  if(!robBtnSender) return;
  if(!startTime) return;
  if(stopApp) return;
  this.count = this.count || 0;
  var now = new Date();
  if(now.getTime() > (startTime + (lazyDelaySec * 1000))){
    return;
  }

  loopTime = loopTime || 10;
  console.log(this.count, now, "clicked");
  //toast("已点击"+ this.count);
  //click(robBtnSender.centerX(), robBtnSender.centerY());
  //使用press，点击速度更快
  for(var i = 0; i < 50; i++){
    //点击位置, 每次用时1毫秒
    console.log(this.count, "clicked", i);
    press(robBtnSender.centerX(), robBtnSender.centerY(), 1);
  }
  this.count++;
  sleep(loopTime);
  loopRob(robBtnSender, startTime, loopTime);
  // setTimeout(()=>{
  //   loopRob(robBtnSender, startTime, loopTime);
  // }, loopTime)
}

setTimeout(init, sleepTime);
//threads.start(init);