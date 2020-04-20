'use strict';

// ***************
// * Handle Page *
// ***************

var page = getQueryParams(document.location.search).page;
if(page === undefined || page == "undefined" || page == "index" ){
        page = "main";
}
page = page.replace(/[^A-Za-z0-9]/g,'');

document.addEventListener("DOMContentLoaded", function(event) {
        doRequest("GET", "pages/"+page+".html", pageLogic, []);
});

window.addEventListener( "pageshow", function ( event ) {
	var historyTraversal = event.persisted || ( typeof window.performance != "undefined" &&  window.performance.navigation.type === 2 );
	if ( historyTraversal ) {
		console.log("Detected history traversal - Reloading to eliminate caching issues");
		window.location.reload();
	}
});

// ***********
// * Network *
// ***********
window.errorReported = false;
var openRequests=0;
var timeout = 10000;

setTimeout(killLoader, timeout);

function killLoader(){
	document.getElementById("loading").style.display="none";
}

function killLoaderIfNoRequestsOpen(){
	setTimeout(killLoaderIfNoRequestsOpenInt, 300);
}

function killLoaderIfNoRequestsOpenInt(){
	// console.log("open requests: "+openRequests);
	if(openRequests==0){
		killLoader();
	}
}

function doRequestBody(method, data, type, url, callback, params) {
	doRequestBodyInternal(method,data,type,url,callback,params);
}

function doRequest(method, url, callback, params) {
	doRequestBodyInternal(method,null,null,url,callback,params);
}

function doRequestBodyInternal(method,data,type,url,callback,params){
	openRequests++;
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			openRequests--;
			killLoaderIfNoRequestsOpen();
			if (request.status == 200) {
				var response = "";
				if(url.includes(".html")){
					response = request.responseText;
				}else{
					try {
						var responseJSON = JSON.parse(request.responseText);
						response = responseJSON;
					} catch (e) {
						showAlert("Something went wrong","Error receiving information from backend - "+e.message,"error");
					}
				}
				params = [response].concat(params);
				params.push(request.status);
				callback.apply(this,params);
			} else if(request.status == 401){
				if(!window.errorReported){
					window.errorReported=true;
					showAlert("Unauthorized","","error");
				}
			} else if(request.status==404){
				showAlert("Not found","Unable to find resource","warning");
			} else if(request.status==0){
				openRequests--;
				killLoaderIfNoRequestsOpen();
				if(!window.errorReported){
					window.errorReported=true;
					showAlert("Something went wrong","The request for " + url + " timed out. Please try again","error");
				}
			}else{
				try {
					response = JSON.parse(request.responseText);
					if(!window.errorReported){
						window.errorReported=true;
						showAlert("Something went wrong",response.error,"error");
					}
				}catch (e){
					if(!window.errorReported){
						window.errorReported=true;
						var body = request.responseText.substring(0,20);
						alert("Unknown error - HTTP Return Code: '"+request.status+"' - Exception Message: '"+e.message+"' - Response Body: "+body);
					}
				}
			}
		}
	};
	if(method.toUpperCase()==="GET"){
		var cacheBusterStrng = "cacheBuster=";
		if(!url.includes(cacheBusterStrng)){
			var appendChar = url.includes("?") ? "&" : "?";
			url = url + appendChar + cacheBusterStrng + (Math.random()*1000000);
		}
	}
	request.open(method, url);
	request.timeout = timeout;
	if(type!==null){
        	request.setRequestHeader("Content-Type", type);
	}
	request.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate");
	if(data!=null){
		request.send(data);
	}else{
		request.send();
	}
}

// ********************
// * Helper Functions *
// ********************

function getQueryParams(qs) {
	qs = qs.split('+').join(' ');
	var params = {}, tokens, re = /[?&]?([^=]+)=([^&]*)/g;
	while (tokens = re.exec(qs)) {
		params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
	}
	return params;
}

function showAlert(title,text,type){
	Swal.fire({
		title: title,
		text: text,
		icon: type,
		confirmButtonText: 'OK'
	})
}

window.onerror = function(msg, url, line, col, error) {
	showAlert("Something went wrong","\""+error+"\"","error");
};

function renderBreadCrumbs(crumbs){
	var breadCrumbs = document.getElementById("breadCrumbs");
	if(breadCrumbs==null){
		console.log("Error: No bread crumbs span")
		return;
	}
	var crumbsString = "";
	for (var i = 0; i < crumbs.length; i++) {
		crumbs[i][1] = crumbs[i][1]==null?"javascript:;":"index.html?page="+crumbs[i][1];
		crumbsString += "&rarr;<a style=\"color:#f29800\" href=\""+crumbs[i][1]+"\">"+crumbs[i][0]+"</a>";
	}
	breadCrumbs.innerHTML = crumbsString;
}
