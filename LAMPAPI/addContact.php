<?php

	$inData = getRequestInfo();

	// TODO: connect to db
	$conn = new mysqli("", "", "", "");
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$sql = "INSERT INTO Contacts (FirstName, LastName, Email, Phone) VALUES (?, ?, ?, ?)";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param($inData["firstName"], $inData["lastName"], $inData["email"], $inData["phone"]);
		$stmt->execute();
		$conn->close();
	}

	function returnWithError($err)
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>