const Card = require('../../Card.js');

class KaterinaTheSummoner extends Card {
    setupCardAbilities(ability) {
        // Play/Reap: Capture 1
        this.play({
            reap: true,
            gameAction: ability.actions.capture()
        });

        // Destroyed: Make a token creature for each A on Katerina the Summoner
        this.destroyed({
            gameAction: ability.actions.makeTokenCreature((context) => ({
                amount: context.source.tokens.amber ?? 0
            }))
        });
    }
}

KaterinaTheSummoner.id = 'katerina-the-summoner';

module.exports = KaterinaTheSummoner;
