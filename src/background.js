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
