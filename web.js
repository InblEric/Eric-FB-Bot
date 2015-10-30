var login = require("facebook-chat-api");
 
// Create simple echo bot 
login({email: "FB_EMAIL", password: "FB_PASSWORD"}, function callback (err, api) {
    if(err) return console.error(err);
 
    api.listen(function callback(err, message) {
        api.sendMessage(message.body, message.threadID);
    });
});
