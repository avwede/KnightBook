<?php

// Unpack JSON object
$inData = getRequestInfo();

// Make connection with database
$conn = new mysqli("localhost", "Group25", "25!!Poos", "KnightBook");
if ($conn->connect_error)
{
    returnWithError($conn->connect_error);
}
else
{
    // Check if username already exists, if it does tell user to try again
    $sql = "SELECT ID FROM Users where Login='" . $inData["login"] . "'";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) 
    {
        returnWithError("Username Has Been Taken");
    }
    // If username does not exist, create account and log them in
    else 
    {
        $sql = "INSERT INTO Users (Login, Password, FirstName, LastName) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        // FIXME: these are just placeholder names for the db and json package for now, they can be changed if needed
        $stmt->bind_param($inData["login"], $inData["password"], $inData["firstName"], $inData["lastName"]);
        $stmt->execute();
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
    $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
}

function returnWithInfo( $firstName, $lastName, $id )
{
    $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
    sendResultInfoAsJson( $retValue );
}

?>
