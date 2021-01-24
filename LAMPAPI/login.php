<?php

	$inData = getRequestInfo();
	
	$ID = 0;
	$FirstName = "";
	$LastName = "";

	// Opens a new connection with the MySQL server
	$conn = new mysqli("localhost", "Group25", "25!!Poos", "KnightBook");

	// Check the connection, return an error if connection fails. 
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// Process user input and query the database to see if the user's information is present.
		$sql = "SELECT ID, FirstName, LastName FROM Users where Login='" . $inData["Login"] . "' and Password='" . $inData["Password"] . "'";
		$result = $conn->query($sql);

		if ($result->num_rows > 0)
		{
			// If the login info is present, put the results in an associative array and return JSON. 
			$row = $result->fetch_assoc();
			$FirstName = $row["FirstName"];
			$LastName = $row["LastName"];
			$ID = $row["ID"];
			
			returnWithInfo($FirstName, $LastName, $ID );
		}
		else
		{
			returnWithError( "No Records Found" );
		}

		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"ID":0,"FirstName":"","LastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"ID":' . $id . ',"FirstName":"' . $firstName . '","LastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>