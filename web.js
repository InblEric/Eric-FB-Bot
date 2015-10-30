var login = require("facebook-chat-api");
 
// Create simple echo bot 
login({email: process.env.EM, password: process.env.FP}, function callback (err, api) {
    if(err) return console.error(err);
 
    api.listen(function callback(err, message) {
        api.sendMessage(message.body, message.threadID);
        if(event.body === 'Matt Fact') {
              api.sendMessage("MATT FACT", event.thread_id);
        }
    });
});
