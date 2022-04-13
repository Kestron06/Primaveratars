chrome.webRequest.onCompleted.addListener(function(details) {
    var url = document.createElement('a');
    url.href = details.url;

	chrome.tabs.sendMessage(details.tabId, {replaceAvatar: true });
	
}, {urls: [ "*://*.khanacademy.org/*" ]});


console.log("This has also been triggered");

