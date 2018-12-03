const Card = require('../../Card.js');

class TheSting extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.skipStep('key')
        });

        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.forgeAmberGainedByOpponent()
        });

        this.action({
            gameAction: ability.actions.sacrifice()
        });
    }
}

TheSting.id = 'the-sting'; // This is a guess at what the id might be - please check it!!!

module.exports = TheSting;
