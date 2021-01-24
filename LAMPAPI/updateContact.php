<?php

	$inData = getRequestInfo();

	// Opens a new connection with the MySQL server
	$conn = new mysqli("localhost", "admin", "25!!Poos", "KnightBook");

	// Check the connection, return an error if connection fails. 
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "UPDATE Contacts SET FirstName=" . $inData["firstName"] . ", LastName=" . $inData["lastName"] ;
	}



		
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

?>
