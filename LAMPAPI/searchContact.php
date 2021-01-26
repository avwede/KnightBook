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
		$sql = "SELECT (FirstName, LastName) from Contacts WHERE (FirstName like '%" . $inData["search"] . "%' or LastName like '%" . $inData["search"] . "%') and UserID=" . $inData["userId"];

		// SELECT (FirstName, LastName) from Contacts WHERE (FirstName like '%s%' or LastName like '%s%') and UserID=2
		
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
				// FIXME: not actually sure if this is right
				$searchResults .= '"' . $row["FirstName"] . ' ' . $row["LastName"] . '"';
			}

			returnWithInfo($searchResults);
		}
		else
		{
			returnWithError($sql);
			// returnWithError("No Contacts Found.");
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
