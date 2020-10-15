// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

 chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
      console.log('The color is green.');
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
     chrome.declarativeContent.onPageChanged.addRules([{
       conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'localhost'},
       })
      ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
   });
  });
  
chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo, tab) {
    // read changeInfo data and do something with it
    // like send the new url to contentscripts.js
    if (changeInfo.url) {
      chrome.tabs.sendMessage( tabId, {
        message: 'tabsUpdated!',
        url: changeInfo.url
      })
    }
  }
);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
		
    // Take screenshot
    if (request.greeting == "take_screenshot"){
      chrome.tabs.captureVisibleTab(null,{},function(dataUrl){
        window.screenshot = dataUrl;
        // console.log(window.screenshot);
        sendResponse({farewell: window.screenshot});
      });
      return true;
    }
		
    }
);

chrome.browserAction.onClicked.addListener(function(tab) { 
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  chrome.tabs.executeScript({
          file: 'contentScript.js'
        });
    });
});