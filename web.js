var login = require("facebook-chat-api");
var nflScores = require("nfl_scores");
var weather = require("weather-js")
var weather_dict = {}
var posts_dict = {}
var posts = 0
var pg = require('pg');

pg.defaults.ssl = true;

pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT table_schema,table_name FROM information_schema.tables;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});

pg.connect(conString, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('SELECT $1::int AS number', ['1'], function(err, result) {
    //call `done()` to release the client back to the pool 
    done();
 
    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0].number);
    //output: 1 
  });
});
 
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
"Hello from Matt Facts! Fact – Although he is mostly of Polish descent, Matt would have you believe he is 100% German. Send 'STOP' to stop receiving these messages.",
"Hello from Matt Facts! Fact – Matt secretly thinks the Chargers should move to Los Angeles. Send 'STOP' to stop receiving these messages."
]

login({email: process.env.EM, password: process.env.FP}, function callback (err, api) {
    if(err) return console.error(err);
 
    api.listen(function callback(err, message) {
    
    		try {
    			posts++;
    			var sender = (message.senderName).toString();    			
    			if (posts_dict.hasOwnProperty((message.senderName).toString())) {
	    			posts_dict[(message.senderName).toString()]++;
			    } else {
	    			posts_dict[(message.senderName).toString()] = 1;
	    		}
	    	
	    		
	    		
	    		
	    		
	    		// get a pg client from the connection pool
                  pg.connect(conString, function(err, client, done) {
                
                    var handleError = function(err) {
                      if(!err) return false;

                      if(client){
                        done(client);
                      }                      
                      return true;
                    };
                
                    // handle an error from the connection
                    if(handleError(err)) return;
                
                    // record the visit
                    client.query('INSERT INTO visit (date) VALUES ($1)', [new Date()], function(err, result) {
                
                      // handle an error from the query
                      if(handleError(err)) return;
                
                      // get the total number of visits today (including the current visit)
                      client.query("UPDATE posts SET postsnum=postsnum+1 WHERE personname='Eric'; INSERT INTO posts (postsnum, personname) SELECT 1, 'Eric' WHERE NOT EXISTS (SELECT 1 FROM posts WHERE personname='Eric');", function(err, result) {
                      
                
                        // handle an error from the query
                        if(handleError(err)) return;
                
                        // return the client to the connection pool for other requests to reuse
                        done();
                        res.writeHead(200, {'content-type': 'text/plain'});
                        res.end('You are visitor number ' + result.rows[0].count);
                      });
                    });
                  });
	    		
	    		
	    		
	    		
	    		
	    		
	    		
	    		
	    		
	    		
	    		
	    		
	    		
	    		
	    		
	    		
	    		
	    		
    				
			}
			catch(err) {
				console.log(err)
			}
    
	    	/*if(message.body === 'test') {
	    		try {
					var item = (posts_dict[(message.senderName).toString()]).toString()       	      
    		        api.sendMessage(item, message.threadID);	
    		    }
    		    catch(err) {
    		    	console.log(err)
    		    }
    	    }*/
    	    
    	    /*if(message.body === 'reset') {
    	    	try {
    	    		for (var key in posts_dict) {
						if (posts_dict.hasOwnProperty(key)) {
    						posts_dict[key] = 0;
	  					}
					}
				}
				catch(err) {
					console.log(err)
				}
    	    }*/
    	    
    	    //if(message.body === 'stats') {
    	    if (posts >= 100) {
    	        posts = 0;
    	    	try {    	    							
					var sortable = [];
					for (var person in posts_dict) {
				    	sortable.push([person, posts_dict[person]])
				    }
					console.log(sortable)
					sortable.sort(function(a, b) {return b[1] - a[1]})
					console.log(sortable)
					var item = "Top posters in last 100 posts:\n"
					for (var i=0; i < sortable.length; i++) {					    
						
					    item = item + ("" + sortable[i][0].toString() + ": " + sortable[i][1].toString() + "\n").toString();
					    
					}
					api.sendMessage(item, message.threadID);
					
					try {
    	    			for (var key in posts_dict) {
							if (posts_dict.hasOwnProperty(key)) {
    							posts_dict[key] = 0;
		  					}
						}
					}
					catch(err) {
						console.log(err)
					}
					
					
					
    	    	
	    	    	//for (var key in posts_dict) {
						//if (posts_dict.hasOwnProperty(key)) {
							//var item = key.toString()
    						//var item = ("" + key.toString() + " " + (posts_dict[key].toString())).toString()     				
    						//api.sendMessage(item, message.threadID);
  						//}
					//}
				}
				catch(err) {
					console.log(err)
				} 
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
        
    	    /*if(message.body === 'NFL') {
				nflScores.refresh(function(err, scores) {
				    var games = ""
				    for (i = 0; i < scores.gms.length; i++) { 
				        games = games + scores.gms[i].d + ", " + scores.gms[i].t + ": " + scores.gms[i].vnn + " at " + scores.gms[i].hnn + "\n"
					}
					api.sendMessage(games, message.threadID);
				});
	        }*/
	        // TODO: Add this back in next season
	        
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
