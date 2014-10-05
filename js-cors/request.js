// Calculate the amount of time for each query.
function calculateRequests(){
  var currentDate= new Date;
  // Save the current time in the now variable.
  var now= parseInt(currentDate.getTime()/1000);
  // Instantiate the variable limit and set its value to one day before the now variable.
  var limit=currentDate.setDate(currentDate.getDate() - 1);
  limit=parseInt(currentDate.getTime()/1000);
  // Make the CORS request to Carriots to get all the streams between now and the limit (one natural day before).
  makeCorsRequest('GET', "http://api.carriots.com/devices/madrid@carriotsMeteo.carriotsMeteo/streams/?at_to="+now+"&at_from="+limit, "day");
  // Set the limit variable to 6 days before its current value (7 days total before the now variable).
  limit=currentDate.setDate(currentDate.getDate() - 6);
  limit=parseInt(currentDate.getTime()/1000);
  // Make the CORS request to Carriots to get all the streams between now and the limit (7 natural day before).
  makeCorsRequest('GET', "http://api.carriots.com/devices/madrid@carriotsMeteo.carriotsMeteo/streams/?at_to="+now+"&at_from="+limit, "week");
  // Set the limit variable to 23 days before its current value (30 days total before the now variable).
  limit=currentDate.setDate(currentDate.getDate() - 23);
  limit=parseInt(currentDate.getTime()/1000);
  // Make the CORS request to Carriots to get all the streams between now and the limit (30 natural day before).
  makeCorsRequest('GET', "http://api.carriots.com/devices/madrid@carriotsMeteo.carriotsMeteo/streams/?at_to="+now+"&at_from="+limit, "month");

}

// Create the XHR object.
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

// Make the actual CORS request.
function makeCorsRequest(meth, url, timePeriod) {
  // Create the XHR object.
  var xhr = createCORSRequest(meth, url);
  // Specify the Meteo apikey (when connecting CORS to your Carriots account you must substitute your apikey here).
  var apikey= 'a3dd2a33c514de9ed0ad1e8e751a82a8c699916858b1ad0a6e2425d71cce48ea';

  if (!xhr) {
    alert('CORS not supported');
    return;
  }
  
  // Add the needed headers to make the CORS request to Carriots.
  xhr.setRequestHeader('Host', 'api.carriots.com');
  xhr.setRequestHeader('carriots.apiKey', apikey);
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('User-Agent', 'Carriots-client');
  xhr.setRequestHeader('Content-Type', 'application/json');

  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
    if(meth!='POST'){ 
      // Print the value returned by decode function in each input box.
      switch(timePeriod){
        case 'day': document.getElementById('day').value=decode(text); break;
        case 'week': document.getElementById('week').value=decode(text); break;
        case 'month': document.getElementById('month').value=decode(text); break;
      }
    }
    
  };

  xhr.onerror = function() {
    alert('There was an error making the request.');
  };

  xhr.send();
}

 
function decode(text){
  // Parse the text returned from the request into a JSON object.
  obj = JSON.parse(text);
  var temp=0;
  var avg=0;
  // Get the temperature for each data set returned in the request (one for every hour).
  for(var i=0; i<obj.result.length; i++){
    temp=obj.result[i].data.temp;
    // Add the temperature to the sum of temperatures.
    avg+=parseFloat(temp);
  }
  // Return the average temperature for the amount of hours (which will be the value of i when it leaves the for loop).
  return avg=(parseFloat(avg)/i).toFixed(2);
}
