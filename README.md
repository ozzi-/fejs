# fejs
This is the skeleton of my JS "framework" I use to build SPA.

It contains nice things as a convenient XHR functions with callbacks, routing, a basic HTML skeleton and an error handler.


## Pages
The directory pages contains all "pages", they are loaded automagically. Using the url parameter "page", the according html will be loaded via XHR. 

Example: "index.html?page=test" will load pages/test.html.

## ressources/code.js
Here you can place your functions used by the page logic, such as creating the employees table or filling out the employee forms.

## ressources/logic.js
This is where the "mapping" between pages and the according functions is performed.

## Doing networking
There are two methods available:

One that takes a request body and one without:
```
doRequestBody(method, data, type, url, callback, params)
doRequest(method, url, callback, params)
```
Whereas params is an optional array for the callback (Note: first parameter for the callback function will always be the response body).
 

## Example
```
<h3>Employees</h3><br>
<div id="employees"></div>
```
and
```
doRequest("GET", "fakeapi/employees.json", listEmployees);
```
Equals:
![screenshot employees](https://i.imgur.com/AvrfeUn.png)


```
<h3>Employee</h3><br>
Name:<br><input id="name"><br><br>
Age:<br><input id="age"><br><br>
Salary:<br><input id="salary"><br></br>
<img id="photo">
```
and
```
var id = getQueryParams(document.location.search).id;
doRequest("GET", "fakeapi/"+id+".json" , showEmployee);
```

Equals:
![screenshot specific employee](https://i.imgur.com/b3mjO3o.png)
