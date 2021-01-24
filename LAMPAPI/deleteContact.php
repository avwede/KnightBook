<?php

	// unpack JSON
	$inData = getRequestInfo();

	// TODO: connect to db
	$conn = new mysqli("", "", "", "");
	// if cannot connect, return with error
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	// delete contact from table
	else
	{
		$sql = "DELETE FROM Contacts WHERE ID='" . $inData["id"] . "'";
		$result = $conn->query($sql);
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
?>
