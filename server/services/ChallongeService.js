const util = require('../util.js');
const logger = require('../log.js');

class ChallongeService {
    async getTournamentsForUser(user) {
        if (!user.challonge.key) {
            throw 'Challonge key not found';
        }

        let personal, community;

        try {
            personal = await util.httpRequest(
                `https://api.challonge.com/v1/tournaments.json?api_key=${user.challonge.key}`,
                { json: true }
            );
            community = user.challonge.subdomain
                ? await util.httpRequest(
                      `https://api.challonge.com/v1/tournaments.json?api_key=${user.challonge.key}&subdomain=${user.challonge.subdomain}`,
                      { json: true }
                  )
                : [];
        } catch (error) {
            logger.error(`Failed to get tournaments for ${user.username}`, error);
            throw new Error('Failed to get tournaments');
        }

        let final = [...personal.map((x) => x.tournament), ...community.map((x) => x.tournament)];
        final = final.filter((x) => x.game_name === 'Keyforge' && x.state !== 'complete');
        final = final.sort((a, b) => {
            let aDate = new Date(a.created_at);
            let bDate = new Date(b.created_at);
            return aDate > bDate ? 0 : 1;
        });
        return final;
    }

    async getMatches(user, tournamentId) {
        if (!user.challonge.key || !tournamentId) {
            throw new Error('Challonge key or tournament ID not found');
        }

        let matches;
        try {
            matches = await util.httpRequest(
                `https://api.challonge.com/v1/tournaments/${tournamentId}/matches.json?api_key=${user.challonge.key}`,
                { json: true }
            );
        } catch (error) {
            logger.error(`Failed to get tournaments for ${user.username}`, error);
            throw new Error('Failed to get tournaments');
        }

        return matches.map((x) => x.match);
    }

    async getParticipants(user, tournamentId) {
        if (!user.challonge.key || !tournamentId) {
            throw new Error('Challonge key or tournament ID not found');
        }

        let participants;
        try {
            participants = await util.httpRequest(
                `https://api.challonge.com/v1/tournaments/${tournamentId}/participants.json?api_key=${user.challonge.key}`,
                { json: true }
            );
        } catch (error) {
            logger.error(`Failed to get participants for ${user.username}`, error);
            throw new Error('Failed to get participants');
        }

        return participants.map((x) => x.participant);
    }

    async attachMatchLink(user, data) {
        if (!user.challonge.key) {
            throw new Error('Challonge key not found');
        }

        let challongeResults;
        try {
            challongeResults = [];

            for (let match of data) {
                let result;
                let url = `https://api.challonge.com/v1/tournaments/${match.tournamentId}/matches/${match.matchId}/attachments.json?api_key=${user.challonge.key}`;

                try {
                    result = await util.httpRequest(url, {
                        method: 'POST',
                        json: true,
                        body: {
                            description: 'Click This link to enter your game.',
                            url: match.attachment
                        }
                    });
                } catch (error) {
                    logger.error(`Failed to get attachments for ${user.username}`, error);
                    throw new Error('Failed to get attachments');
                }

                challongeResults.push(result.match_attachment);
            }
        } catch (error) {
            logger.error(`Failed to get attachments for ${user.username}`, error);
            throw new Error('Failed to get attachments');
        }

        return challongeResults;
    }
}

module.exports = ChallongeService;
