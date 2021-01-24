<?php

	$inData = getRequestInfo();

	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "admin", "25!!Poos", "KnightBook");
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$sql = "SELECT (FirstName, LastName) from Contacts WHERE FirstName like '%" . $inData["search"] . "%' or LastName like '%" . $inData["search"] . "' and UserID=" . $inData["userId"];
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
		}
		else
		{
			returnWithError("No Contacts Found");
		}
		$conn->close();
	}

	returnWithInfo($searchResults);

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>