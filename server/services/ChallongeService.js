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

            util.httpRequest(`https://api.challonge.com/v1/tournaments/${tournamentId}/matches.json?api_key=${user.challonge.key}`, { json: true })
                .then(matches => resolve(matches.map(x => x.match)))
                .catch(err => {
                    logger.error('Failed to get tournaments for ', user.username, err);
                    reject();
                });
        });
    }

    getParticipants(user, tournamentId) {
        return new Promise((resolve, reject) => {
            if(!(user.challonge.key && tournamentId)) {
                resolve({});
                return;
            }

            util.httpRequest(`https://api.challonge.com/v1/tournaments/${tournamentId}/participants.json?api_key=${user.challonge.key}`, { json: true })
                .then(participants => resolve(participants.map(x => x.participant)))
                .catch(err => {
                    logger.error('Failed to get participants for ', user.username, err);
                    reject();
                });
        });
    }

    createAttachment(user, data) {
        return new Promise((resolve, reject) => {
            if(!(user.challonge.key)) {
                resolve();
                return;
            }

            let url = `https://api.challonge.com/v1/tournaments/${data.tournamentId}/matches/${data.matchId}/attachments.json?api_key=${user.challonge.key}`;
            util.httpRequest(url, { method:'POST', json: true, body: { url: data.attachment } })
                .then(attachment => resolve(attachment.match_attachment))
                .catch(err => {
                    logger.error('Failed to create attachments for ', user.username, err);
                    reject();
                });
        });
    }
}

module.exports = ChallongeService;
