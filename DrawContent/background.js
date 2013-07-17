/**
 * @author XU Kai(xukai.ken@gmail.com) botobe.net
 * @version 0.0.1
 *
 * 2013-07-08 初始化文件完成最基本的结构
 * 用于提取文章中内容的Chrome插件
 */

// 发送消息给content script.
var sendMessage = function() {
   var Tags = chrome.tabs;
   
   Tags.getSelected(null, function(tab) {
      Tags.sendMessage(tab.id, {}, function(resp) {
         return;
      });
   });
};

// 绑定点击事件
chrome.browserAction.onClicked.addListener(sendMessage); 