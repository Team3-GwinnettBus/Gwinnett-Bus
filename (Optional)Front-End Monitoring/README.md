<u><span style="font-size:2em;">Server API calls and data formatting:</span></u>

<b>- /getBusData:</b><br>
Body of request must include json as such:</br>
{</br>
"id": bus id,
</br>
}</br>

<b>- /setBusData:</b></br>
Data inside 'body' tag of request must include json formatted as such:</br>
{</br>
"id" : bus_number,</br>
"longitude" : long,</br>
"latitude" : lat,</br>
"heading" : heading,</br>
"accuracy" : accuracy,</br>
"speed" : speed</br>
}

insertion into relational database example (dummy data):
(change Bus1 to your bus number)

INSERT INTO test_bus_data.Bus1 (time,longitude,latitude,heading,accuracy,speed)
VALUES (NOW(),-84.043763,33.853552,3,300,50);

Query from relational database example (returns most recent ):
(change Bus1 to your bus number)
SELECT \*
FROM test_bus_data.Bus1
ORDER BY time DESC
LIMIT 1;
