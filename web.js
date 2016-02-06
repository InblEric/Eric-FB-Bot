var login = require("facebook-chat-api");
var nflScores = require("nfl_scores");
var weather = require("weather-js")
var weather_dict = {}
var posts_dict = {}
 
var items=[
"Hello from Matt Facts! Fact - Matt likes to work out a lot. Send 'STOP' to stop receiving these messages.",
"Hello from Matt Facts! Fact - You might not know that Matt is a big fan of League of Legends, a popular online video game. Send 'STOP' to stop receiving these messages.",
"Hello from Matt Facts! Fact - Matt was born in Thailand and his parents live in Hawaii. Send 'STOP' to stop receiving these messages.",
"Hello from Matt Facts! Fact - Matt graduated with two degrees from the University of Texas at Austin. Send 'STOP' to stop receiving these messages.",
"Hello from Matt Facts! Fact – Matt’s favorite animal is a red panda. Send 'STOP' to stop receiving these messages.",
"Hello from Matt Facts! Fact – Matt is a fan of Electronic Dance Music, otherwise known as EDM. Send 'STOP' to stop receiving these messages.",
"Hello from Matt Facts! Fact – One of Matt’s favorite authors is Kurt Vonnegut. He also enjoys the Walking Dead graphic novels and shampoo bottles. Send 'STOP' to stop receiving these messages.",
"Hello from Matt Facts! Fact – Matt’s favorite meal is a #6 from Jimmy John’s. Send 'STOP' to stop receiving these messages.",
"Hello from Matt Facts! Fact – Matt enjoys the simple pleasure of appletinis. Send 'STOP' to stop receiving these messages.",
"Hello from Matt Facts! Fact – Matthew Dodson never picks up the telephone. Send 'STOP' to stop receiving these messages.",
"Hello from Matt Facts! Fact – Fantasy sports is not Matt's Forte. Send 'STOP' to stop receiving these messages.",
"Hello from Matt Facts! Fact – Although he is mostly of Polish descent, Matt would have you believe he is 100% German. Send 'STOP' to stop receiving these messages."
]

login({email: process.env.EM, password: process.env.FP}, function callback (err, api) {
    if(err) return console.error(err);
 
    api.listen(function callback(err, message) {
    
    		if (message.senderName in posts_dict) {
	    		posts_dict[message.senderName]++;
	    	} else {
	    		posts_dict[message.senderName] = 1;
	    	}
	    	
	    	if(message.body === 'test') {
				var item = posts_dict[message.senderName]       	      
    	        api.sendMessage(item, message.threadID);	
    	    }
    
	        if(message.body === 'Matt Fact') {
        	      var item = items[Math.floor(Math.random()*items.length)];
    	          api.sendMessage(item, message.threadID);
	
    	    }
	        if(message.body === 'STOP') {
            	api.sendMessage("'STOP' is an unrecognized command. Send 'STOP' to stop receiving these messages.", message.threadID);
            	var item = items[Math.floor(Math.random()*items.length)];
    	        api.sendMessage(item, message.threadID);
        	}
        
    	    if(message.body === 'NFL') {
				nflScores.refresh(function(err, scores) {
				    var games = ""
				    for (i = 0; i < scores.gms.length; i++) { 
				        games = games + scores.gms[i].d + ", " + scores.gms[i].t + ": " + scores.gms[i].vnn + " at " + scores.gms[i].hnn + "\n"
					}
					api.sendMessage(games, message.threadID);
				});
	        }
	        
	        if(message.body === 'Weather') {
	        	weather = require("weather-js")
	        	try {
    				weather.find({search: 'Austin, TX', degreeType: 'F'}, function(err, result) {
						if(err) console.log(err);
						location = "Info for " + result[0].current.observationpoint
						temp = "It is currently " + result[0].current.temperature + " degrees " + result[0].location.degreetype
						weather = "It is " + result[0].current.skytext
						response = location + "\n\n" + temp + "\n" + weather
						weather_dict['Austin, TX'] = response;
						high = 
						low = result[0].forecast[0]['low']						
						forecast = "High: " + result[0].forecast[0]['high'] + "\nLow: " + result[0].forecast[0]['low']
						api.sendMessage(response, message.threadID);
						api.sendMessage(forecast, message.threadID);
						
					});
				}
				catch(err) {
    				api.sendMessage("Failed to get weather, here is the most recent:\n" + weather_dict['Austin, TX'], message.threadID);
					console.log(err)
				}
	        	
	        }
			if(message.body !== 'Weather' && message.body.substring(0,7) === 'Weather') {
				weather = require("weather-js")
				var city = message.body.substring(8,message.body.length)
				try {
    				weather.find({search: city, degreeType: 'F'}, function(err, result) {
						if(err) console.log(err);
						location = "Info for " + result[0].current.observationpoint
						temp = "It is currently " + result[0].current.temperature + " degrees " + result[0].location.degreetype
						weather = "It is " + result[0].current.skytext
						response = location + "\n\n" + temp + "\n" + weather
						weather_dict[city] = response;
						forecast = "High: " + result[0].forecast[0]['high'] + "\nLow: " + result[0].forecast[0]['low']
						api.sendMessage(response, message.threadID);
						api.sendMessage(forecast, message.threadID);
					});
				}
				catch(err) {
				    console.log(err)
				    if(typeof weather_dict[city] === 'undefined') {
				    	api.sendMessage("No recent weather for " + city, message.threadID);
				    } else {
					    api.sendMessage("Failed to get weather, here is the most recent:\n" + weather_dict[city], message.threadID);
				    }
				}
				
			}	      
			
			if(message.body === 'Does OU still suck?') {
				api.sendMessage("Yes.", message.threadID);
			}  
	        

        
        
    });
});
