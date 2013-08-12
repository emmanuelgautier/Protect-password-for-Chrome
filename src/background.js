/*
    Protect password for chrome Version 0.1
    Copyright (C) 2013 Emmanuel Gautier

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
*/

var auth = false,

redirectUrl = null,

passwd = localStorage.password,

isProtectedPage = function(url){
    return ((url.indexOf("chrome://extensions") != -1 || url.indexOf("chrome://settings/passwords") != -1 || (url.indexOf("chrome-extension://" + chrome.runtime.id) != -1 && url.indexOf("login.html") == -1 && redirectUrl == null)) && !auth);
},

createPageLogin = function(tabId){
    passwd = localStorage.password;
    
    //delete the localStorage password temporarily
    delete localStorage.password;
    
    chrome.tabs.update(tabId, {url: chrome.extension.getURL("login.html")}, function(tab){
    var timer = setInterval(function(){
            if(localStorage.password && localStorage.password != 'undefined'){
                if (localStorage.password === passwd){
                    auth = true;
                    chrome.tabs.update(tabId, {url: redirectUrl});
                    redirectUrl = null;
                    clearInterval(timer);
                } else {
                    delete localStorage.password;
                    chrome.tabs.reload(tabId);
                }
            }
        }, 100);
    });
};

if(!localStorage.hasOwnProperty("password")){
    localStorage.password = "passwd";
    chrome.tabs.create({url: chrome.extension.getURL("options.html")});
}

chrome.tabs.onCreated.addListener(function(tab){
    if(isProtectedPage(tab.url)){
        redirectUrl = tab.url;
        createPageLogin(tab.id);
    }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(isProtectedPage(tab.url)){
        redirectUrl = tab.url;
        createPageLogin(tabId);
    }
});
