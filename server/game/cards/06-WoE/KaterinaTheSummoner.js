const Card = require('../../Card.js');

class KaterinaTheSummoner extends Card {
    // Play/After Reap: Capture 1.
    // Destroyed: Make a token creature for each  on Katerina the Summoner.
    setupCardAbilities(ability) {
        // Play/Reap: Capture 1
        this.play({
            reap: true,
            gameAction: ability.actions.capture()
        });

        // Destroyed: Make a token creature for each A on Katerina the Summoner
        this.destroyed({
            gameAction: ability.actions.makeTokenCreature((context) => ({
                amount: context.source.amber
            }))
        });
    }
}

KaterinaTheSummoner.id = 'katerina-the-summoner';

module.exports = KaterinaTheSummoner;
