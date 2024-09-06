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
