/**
 * @author XU Kai(xukai.ken@gmail.com) botobe.net
 * @version 0.0.1
 *
 * 2013-07-08 初始化文件完成最基本的结构
 * 用于提取文章中内容的Chrome插件
 */

(function() {'use strict';

   var DrawContent = function() {
      this.HTMLstructure = '<span></span>';
      this.url = 'http://121.197.1.16:9011/api/getMainText/?url=';

      // 当前插件执行状态
      this.status = 0;

      // 启动APP
      // this.start();

      // 收回打开的页面的情况
      var self = this;
      document.addEventListener('click', function(evt){
         self.hide();
      });
   };

   var DCPrototype = DrawContent.prototype;

   DCPrototype.start = function() {
      if (this.status)
         this.hide();
      else
         this.show();
   };

   DCPrototype.show = function() {
      if (this.targetDOM) {
         this.targetDOM.style.boxShadow = 'rgb(204, 204, 204) 10px 0px 30px'
         this.targetDOM.style.left = 0 + 'px';
         return;
      }

      var self = this, boby = document.body;

      // 显示遮罩层
      var targetWidth = boby.clientWidth * 0.7;
      this.targetWidth = targetWidth;
      var cal = function() {
         return 'height:' + boby.scrollHeight + 'px;width:' + targetWidth + 'px;' + 'left:' + (targetWidth * -1) + 'px;';
      };

      var targetDOM = document.createElement('div');
      targetDOM.innerHTML = this.HTMLstructure;
      targetDOM.className = 'ContentPanel';
      targetDOM.id = 'ContentPanel';
      targetDOM.setAttribute('style', cal());
      targetDOM.addEventListener('transitionend', function() {
         if (self.status) {
            self.targetDOM.style.boxShadow = 'none';
            self.status = 0;
         } else {
            self.sendRequest();
            self.status = 1;
         }
      });
      targetDOM.addEventListener('click', function(evt){
         evt.stopPropagation();
      });

      // 将UI展示流程置为异步
      setTimeout(function() {
         targetDOM.style.left = 0;
      }, 0);

      this.targetDOM = targetDOM;
      boby.appendChild(targetDOM);
   };

   DCPrototype.sendRequest = function() {
      var XHR = new window.XMLHttpRequest();

      // 数据回调处理
      var self = this;
      var callbackRegister = function() {
         if (this.readyState == 4) {
            var ContentData = this.responseText;
            try {
               ContentData = JSON.parse(ContentData);
            } catch(e) {
               console.error(e.message);
            }
            
            // 验证返回值长度
            if (ContentData.length)
               ContentData = ContentData[0];
            ContentData && (self.targetDOM.innerHTML = ContentData.content);
         }
      };
      XHR.onreadystatechange = callbackRegister;

      // 发送请求
      XHR.open("GET", this.url + location.href, true);
      XHR.send(null);
   };

   DCPrototype.hide = function() {
      this.targetDOM.style.left = (0 - this.targetWidth) + 'px';
   };

   var DCInstance = new DrawContent();

   // 接受信号
   chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      DCInstance.start();
   });
})(); 