'use strict';

var page = getCurrentPage();

function pageLogic (response){

	var breadcrumbs = [];
	document.getElementById("pageContainer").innerHTML = response;

	breadcrumbs.push(["Home","main"]);

	// here you can define what should happen for each page
	if(page=="main"){
		doRequest("GET", "fakeapi/employees.json", listEmployees);
	}else if(page=="employee"){
		var id = getQueryParams(document.location.search).id;
		doRequest("GET", "fakeapi/"+id+".json" , showEmployee);
		breadcrumbs.push(["Employee","employee&id="+id]);
	}

	renderBreadCrumbs(breadcrumbs);
}
