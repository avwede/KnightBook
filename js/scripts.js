var urlBase = 'http://knightbook.rocks/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
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
	
		// FIXME: this should redirect user to home page, whatever that file gets called
		// just checking to make sure link up works
		window.location.href = "contacts.html";
	}
	catch(err)
	{
		alert(err.message); // FIXME: get rid of this
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
		if (jsonObject.error != "") {
			throw jsonObject.error;
		}
		
		// save values from api response
		userId = jsonObject.id;
		firstName = jsonObject.firstName;
		lastName = jsonObject.lastName;

		saveCookie();
	
		window.location.href = "contacts.html";
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
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
		document.getElementById("userName").textContent = "Logged in as " + firstName + " " + lastName;
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
	var srch = document.getElementById("searchText").value;
	document.getElementById("searchResult").innerHTML = "";
	
	// result for later
	var nameList = "";
	// var emailList = "";
	// var phoneList = "";
	// var majorList = "";
	
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
				document.getElementById("searchResult").innerHTML = "Results:";
				var jsonObject = JSON.parse( xhr.responseText );
				
				for( var i=0; i<jsonObject.results.length; i++ )
				{
					nameList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						nameList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = nameList;
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
	var firstName = document.getElementById("firstName").value;
	var lastName = document.getElementById("lastName").value;
	var email = document.getElementById("email").value;
	var phone = document.getElementById("phone").value;
	// var major = document.getElementById("major").value;

	document.getElementById("contactAddResult").innerHTML = "";
	
	// TODO: add major functionality (var declared above) if there is time
	var jsonPayload = 	`{ "firstName" : "${firstName}", "lastName" : "${lastName}", 
						"email" : "${email}", "phone" : "${phone}" }`;
	var url = urlBase + '/addContact.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
}

// TODO: fill in body
function updateContact() 
{

}

// TODO: fill in body
function deleteContact()
{

}
