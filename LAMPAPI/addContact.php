<?php

	$inData = getRequestInfo();

	// connect to db
	$conn = new mysqli("localhost", "Group25", "25!!Poos", "KnightBook");

	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$sql = "INSERT INTO Contacts (UserID, FirstName, LastName, Email, Phone, Major) VALUES (" . $inData["userId"] . ",'" . $inData["firstName"] . "','" . $inData["lastName"] . "','" . $inData["email"] . "','" . $inData["phone"] . "','" . $inData["major"] . "')";

		if ($conn->query($sql) === FALSE)
		{
			returnWithError("Could not add contact.");
		}
		else
		{
			returnWithInfo("Successfully created the contact.");
		}

		$conn->close();
	}

	function returnWithError($err)
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithInfo( $message )
	{
		$retValue = '{"message":"' . $message . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>