const util = require('../util.js');
const logger = require('../log.js');

class ChallongeService {
    getTournamentsForUser(user) {
        return new Promise(async (resolve, reject) => {
            util.httpRequest(`https://api.challonge.com/v1/tournaments.json?api_key=${user.challongeApiKey}`, { json: true })
                .then(response=> {
                    resolve(response.map(x => x.tournament));
                })
                .catch(err => {
                    logger.error('Failed to get tournaments for ', user.username, err);
                    reject();
                });
        });
    }
}

module.exports = ChallongeService;
