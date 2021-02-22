<?php

	$inData = getRequestInfo();

	// Opens a new connection with the MySQL server
	$conn = new mysqli("localhost", "Group25", "25!!Poos", "KnightBook");

	// Check the connection, return an error if connection fails. 
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "UPDATE Contacts SET FirstName='" . $inData["firstName"] . "', LastName='" . $inData["lastName"] . "', Email='" . $inData["email"] . "', Phone='" . $inData["phone"] . "', Major='" . $inData["major"] . "' WHERE UserID=" . $inData["userId"] . " and ID=" . $inData["id"];

		if ($conn->query($sql) === FALSE)
		{
			returnWithError("Could not update contact.");
		}

		$conn->close();
	}

	returnWithInfo("Success");

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $message )
	{
		$retValue = '{"message":"' . $message . '", "error" : ""}';
		sendResultInfoAsJson( $retValue );
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

?>
