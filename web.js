var login = require("facebook-chat-api");
var nflScores = require("nfl_scores");
var weather = require("weather-js")
var weather_dict = {}
 
var items=[
"Hello from Matt Facts! Fact - Matt likes to work out a lot. Send 'STOP' to stop receiving these messages.",
"Hello from Matt Facts! Fact - You might not know that Matt is a big fan of League of Legends, a popular online video game. Send 'STOP' to stop receiving these messages.",
"Hello from Matt Facts! Fact - Matt was born in Thailand and his parents live in Hawaii. Send 'STOP' to stop receiving these messages.",
"Hello from Matt Facts! Fact - Matt graduated with two degrees from the University of Texas at Austin. Send 'STOP' to stop receiving these messages."
]

// Create simple echo bot 
login({email: process.env.EM, password: process.env.FP}, function callback (err, api) {
    if(err) return console.error(err);
 
    api.listen(function callback(err, message) {
        // api.sendMessage(message.body, message.threadID);
//        if(message.type == "body") {
	        if(message.body === 'Matt Fact') {
        	      var item = items[Math.floor(Math.random()*items.length)];
    	          api.sendMessage(item, message.threadID);
	
    	    }
	        if(message.body === 'STOP') {
            	api.sendMessage("'STOP' is an unrecognized command. Send 'STOP' to stop receiving these messages.", message.threadID);
        	}
        
    	    if(message.body === 'NFL') {
				nflScores.refresh(function(err, scores) {
				    var games = ""
				    for (i = 0; i < scores.gms.length; i++) { 
				        games = games + scores.gms[i].d + ": " + scores.gms[i].vnn + " at " + scores.gms[i].hnn + "\n"
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
						api.sendMessage(response, message.threadID);
					});
				}
				catch(err) {
    				api.sendMessage("Failed to get weather, here is the most recent:\n" + weather_dict['Austin, TX'], message.threadID);
					console.log(err)
				}
	        	
	        }
			if(message.body !== 'Weather' && message.body.substring(0,7) === 'Weather') {
				var city = message.body.substring(8,message.body.length)
				try {
    				weather.find({search: city, degreeType: 'F'}, function(err, result) {
						if(err) console.log(err);
						location = "Info for " + result[0].current.observationpoint
						temp = "It is currently " + result[0].current.temperature + " degrees " + result[0].location.degreetype
						weather = "It is " + result[0].current.skytext
						response = location + "\n\n" + temp + "\n" + weather
						weather_dict[city] = response;
						api.sendMessage(response, message.threadID);
					});
				}
				catch(err) {
				    if(typeof weather_dict[city] === 'undefined') {
				    	api.sendMessage("No recent weather for " + city, message.threadID);
				    } else {
					    api.sendMessage("Failed to get weather, here is the most recent:\n" + weather_dict[city], message.threadID);
				    }
				}
				
			}	        
	        

  //      }
        
        
    });
});
