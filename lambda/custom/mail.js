const graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

module.exports = {
    countUnreadEmails: async function(accessToken){
        const client = graph.Client.init({
            authProvider: (done) => {
              done(null, accessToken);
            }
          });

        try {
            const result = await client
                .api('/me/mailfolders/inbox/messages')
                .top(10)
                .select('subject,from,receivedDateTime,isRead')
                .filter('isRead eq false')
                .orderby('receivedDateTime DESC')
                .count(true)
                .get();

            console.log("Unread messages: ", JSON.stringify(result));
            return result['@odata.count'];
        } catch (err) {
            console.log("Cannot retrieve unread emails", JSON.stringify(err));
        } 
    }
}