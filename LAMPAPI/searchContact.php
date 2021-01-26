<?php

	$inData = getRequestInfo();

	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "Group25", "25!!Poos", "KnightBook");

	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		// FIXME: get userId working
		$sql = "SELECT FirstName, LastName from Contacts WHERE (FirstName like '%" . $inData["search"] . "%' or LastName like '%" . $inData["search"] . "%') and UserID=" . $inData["userId"];
		
		$result = $conn->query($sql);
		
		if ($result->num_rows > 0)
		{
			while ($row = $result->fetch_assoc())
			{
				if ($searchCount > 0)
				{
					$searchResults .= ",";
				}
				$searchCount += 1;
				$searchResults .= '"' . $row["FirstName"] . ' ' . $row["LastName"] . '"';
			}

			returnWithInfo($searchResults);
		}
		else
		{
			returnWithError("No Contacts Found.");
		}

		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	// Names:
	// .....

	// Email:
	// .....

?>
