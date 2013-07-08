/**
 * @author XU Kai(xukai.ken@gmail.com) botobe.net
 * @version 0.0.1
 *
 * 2013-07-08 初始化文件完成最基本的结构
 * 用于提取文章中内容的Chrome插件
 */

(function() {
   'use strict';

   var DrawContent = function() {
      this._HTMLstructure = '<span>Hello, world!</span>';
      this._CSSstructure = '';

      // 当前插件执行状态
      this._status = 0;
      this._url = 'http://127.0.0.1:3000/test';

      // 启动APP
      this.start();
   };

   var DCPrototype = DrawContent.prototype;

   DCPrototype.start = function() {
      this._initialize();
   };

   DCPrototype._initialize = function() {
      var initDOM = function() {
         this.bodyElem = document.body;
      };
      initDOM.call(this);
      this._showPanel();
   };

   DCPrototype._showPanel = function() {
      var self = this;

      // 显示遮罩层
      var targetWidth = self.bodyElem.clientWidth * 0.7;
      var cal = function() {
         return 'height:' + self.bodyElem.scrollHeight + 'px;width:' + targetWidth + 'px;' + 'left:' + (targetWidth * -1) + 'px;';
      };

      var targetDOM = document.createElement('div');
      targetDOM.innerHTML = this._HTMLstructure;
      targetDOM.className = 'ContentPanel';
      targetDOM.id = 'ContentPanel';
      targetDOM.setAttribute('style', cal());
      this.targetDOM = targetDOM;
      this.bodyElem.appendChild(targetDOM);
      setTimeout(function() {
         targetDOM.style.left = 0;
      }, 0);

      targetDOM.addEventListener('transitionend', function() {
         self._sendRequest();
      });
   };

   DCPrototype._sendRequest = function() {
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

         }
      };
      XHR.onreadystatechange = callbackRegister;

      // 发送请求
      XHR.open("GET", this._url, true);
      XHR.send(null);
   };

   setTimeout(function() {
      new DrawContent();
   }, 3000);
   
})();