const util = require('../util.js');
const logger = require('../log.js');

class ChallongeService {
    getTournamentsForUser(user) {
        return new Promise((resolve, reject) => {
            if(!user.challonge.key) {
                resolve([]);
                return;
            }

            const personal = util.httpRequest(`https://api.challonge.com/v1/tournaments.json?api_key=${user.challonge.key}`, { json: true });
            const community = user.challonge.subdomain ? util.httpRequest(`https://api.challonge.com/v1/tournaments.json?api_key=${user.challonge.key}&subdomain=${user.challonge.subdomain}`, { json: true }) : [];
            Promise.all([personal, community])
                .then(([personal, community]) => {
                    let final = [...personal.map(x => x.tournament), ...community.map(x => x.tournament)];
                    final = final.filter(x => x.game_name === 'Keyforge' && x.state !== 'complete');
                    final = final.sort((a, b) => {
                        let aDate = new Date(a.created_at);
                        let bDate = new Date(b.created_at);
                        return aDate > bDate ? 0 : 1;
                    });
                    resolve(final);
                })
                .catch(err => {
                    logger.error('Failed to get tournaments for ', user.username, err);
                    reject();
                });
        });
    }

    getMatches(user, tournamentId) {
        return new Promise((resolve, reject) => {
            if(!(user.challonge.key && tournamentId)) {
                resolve({});
                return;
            }

            let matches = util.httpRequest(`https://api.challonge.com/v1/tournaments/${tournamentId}/matches.json?api_key=${user.challonge.key}`, { json: true });
            let participants = util.httpRequest(`https://api.challonge.com/v1/tournaments/${tournamentId}/participants.json?api_key=${user.challonge.key}`, { json: true });
            Promise.all([matches, participants])
                .then(([matches, participants]) => {
                    let final = {
                        matches: matches.map(x => x.match),
                        participants: participants.map(x => x.participant)
                    };
                    resolve(final);
                })
                .catch(err => {
                    logger.error('Failed to get tournaments for ', user.username, err);
                    reject();
                });
        });
    }
}

module.exports = ChallongeService;
