

var urlBase = 'http://knightbook.rocks/LAMPAPI';
var extension = 'php';

var userId;
var firstName;
var lastName;

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;

	if (login === "" && password === "") {
		document.getElementById("loginResult").innerHTML = "Please Enter Valid Username/Password combination";
		return;
	}
	if (login === "") {
		document.getElementById("loginResult").innerHTML = "Please enter a username";
		return;
	}
	if (password === "") {
		document.getElementById("loginResult").innerHTML = "Please enter a password";
		return;
	}

	var hash = md5( password );
	
	// used to display to user return result of login attempt
	document.getElementById("loginResult").innerHTML = "";

	// create json object for backend
	// var jsonPayload = `{"login" : "${login}", "password" : "${hash}"}`;
	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
	var url = urlBase + '/login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);
		
		var jsonObject = JSON.parse( xhr.responseText );
		
		userId = jsonObject.id;
		
		if( userId < 1 )
		{
			document.getElementById("loginResult").innerHTML = "Username/Password combination incorrect";
			return;
		}
		
		firstName = jsonObject.firstName;
		lastName = jsonObject.lastName;

		saveCookie();
	
		window.location.href = "contacts.html";
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function doRegister()
{
	// fields that user will enter into register page
	var firstName = document.getElementById("registerFirstName").value;
	var lastName = document.getElementById("registerLastName").value;
	var login = document.getElementById("registerName").value;
	var password = document.getElementById("registerPassword").value;
	var hash = md5( password );

	if (firstName === "" || lastName === "" || login === "" || password === "") {
		document.getElementById("loginResult").innerHTML = "One or more fields missing";
		return;
	}
	
	// used to display to user return result of login attempt
	document.getElementById("loginResult").innerHTML = "";

	// create json object for backend
	var jsonPayload = '{"firstName" : "' + firstName + '","lastName" : "' + lastName + '","login" : "' + login + '", "password" : "' + hash + '"}';
	var url = urlBase + '/register.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		// send payload to register api
		xhr.send(jsonPayload);
		
		// get response from api
		var jsonObject = JSON.parse( xhr.responseText );
		
		// save values from api response
		userId = jsonObject.id;
		firstName = jsonObject.firstName;
		lastName = jsonObject.lastName;
		if (userId == 0) {
			document.getElementById("loginResult").innerHTML = jsonObject.error;
			return;
		}

		saveCookie();
	
		window.location.href = "contacts.html";
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}


function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("user").innerHTML = "Welcome " + firstName + " " + lastName + "!";
	}
} 

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function searchContacts()
{
	var header = `<tr class="bg-warning" id="contactHeader"><th>First Name</th><th>Last Name</th><th>Phone</th><th>Email</th><th>Major</th><th></th></tr>`;
	var srch = document.getElementById("searchText").value;

	document.getElementById("contacts").innerHTML = header;

	// result for later
	var nameList = "";
	// var emailList = "";
	// var phoneList = "";
	// var majorList = "";
	// var lastOnlineList = "";
	
	// make json payload and send to api
	var jsonPayload = `{ "search" : "${srch}", "userId" : ${userId} }`;
	var url = urlBase + '/searchContact.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );

				jsonObject["id"].forEach((id, i) => {
					nameList += `<tr id="${id}">`
					nameList += `<td> ${jsonObject.fname[i]} </td>`;
					nameList += `<td> ${jsonObject.lname[i]} </td>`
					nameList += `<td> ${jsonObject.phone[i]} </td>`;
					nameList += `<td> ${jsonObject.email[i]} </td>`;
					nameList += `<td> ${jsonObject.major[i]} </td>`;

					// nameList += "<td class='buttons'>" +
                  	// 			"<i class='far fa-edit modify-btn btn btn-defualt' onclick='editContact();'></i>" +
                  	// 			"<i class='fas fa-trash-alt modify-btn btn btn-default' onclick='deleteContact();'></i>" +
                	// 			"</td></tr>"

					nameList += `<td class='buttons'>
									<i class='far fa-edit modify-btn btn btn-defualt' onclick='editContact(this);'></i>
									<i class='fas fa-trash-alt modify-btn btn btn-default' onclick='deleteContact(this);'></i>
								</td></tr>`;
				});

				let table = document.getElementById("contactHeader");
				table.insertAdjacentHTML("afterend", nameList);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("searchResult").innerHTML = err.message;
	}
}


function addContact()
{
	var firstName = document.getElementById("contactFirstName").value;
	var lastName = document.getElementById("contactLastName").value;
	var email = document.getElementById("contactEmail").value;
	var phone = document.getElementById("contactPhone").value;
	var major = document.getElementById("contactMajor").value;
	// var lastOnline = document.getElementById("lastOnline").value;

	document.getElementById("contactAddResult").innerHTML = "";

	var jsonPayload = `{"firstName" : "${firstName}", "lastName" : "${lastName}", "email" : "${email}" , "phone" : "${phone}", "major" : "${major}", "userId" : ${userId}}`;
	var url = urlBase + '/addContact.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse(xhr.responseText);
		
				if (jsonObject.error != "") {
					document.getElementById("contactAddResult").innerHTML = jsonObject.error;
					return;
				}

				location.reload();
				
			// 	// TODO: add lastonline if there is time
			// 	var newContact = `<tr id="${jsonObject.id}"><td>${firstName}</td><td>${lastName}</td><td>${email}</td><td>${phone}</td><td>${major}</td>`;

			// 	newContact += "	<td class='buttons'>" +
			// 	"<i class='far fa-edit modify-btn btn btn-defualt' onclick='editContact();'></i>" +
			// 	"<i class='fas fa-trash-alt modify-btn btn btn-default' onclick='deleteContact();'></i>" +
			// "</td></tr>"
			// 	getElementById("searchResults").innerHTML += newContact;
			}
		};

	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
		return;
	}

	$('#addEditModal').modal('hide');
}

function updateContact(id) 
{
	var contactId = document.getElementById("contactId").value;
	var firstName = document.getElementById("firstName").value;
	var lastName = document.getElementById("lastName").value;
	var email = document.getElementById("email").value;
	var phone = document.getElementById("phone").value;
	var major = document.getElementById("major").value;

	var jsonPayload = `{ "id" : ${contactId}, "firstName" : "${firstName}", "lastName" : "${lastName}", "email" : "${email}", "phone" : "${phone}", "major" : "${major}" }`
	document.getElementById("updateResult").innerHTML = "";

	var url = urlBase + "/updateContact." + extension;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);

		if (jsonObject.hasOwnProperty("error"))
		{
			document.getElementById("updateResult").innerHTML = jsonObject.error;
			return;
		}

		window.location.href = "contacts.html";
	}
	catch (err)
	{
		document.getElementById("updateResult").innerHTML = err.message;
	}
}

function deleteContact(id)
{
	alert(id);
	var jsonPayload = `{ "id" : ${id} }`;
	var url = urlBase + "/deleteContact." + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try 
	{
		xhr.send(jsonPayload);
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.stats == 200)
			{
				var jsonObject = JSON.parse(xhr.responseText);
				
				if (jsonObject.error != "")
					throw jsonObject.error;
				
				location.reload();
			}
		}
	} 
	catch(err)
	{
		alert(err.message);
	}
}
